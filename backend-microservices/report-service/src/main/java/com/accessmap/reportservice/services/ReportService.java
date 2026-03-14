package com.accessmap.reportservice.services;

import com.accessmap.reportservice.dto.CreateReportRequest;
import com.accessmap.reportservice.models.Report;
import com.accessmap.reportservice.models.Status;
import com.accessmap.reportservice.repositories.ReportRepository;
import com.accessmap.reportservice.repositories.VoteRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReportService {

    private final ReportRepository reportRepository;
    private final VoteRepository   voteRepository;
    private final RestTemplate     restTemplate;

    @Value("${notification.service.url:https://notification-service-hhbj.onrender.com}")
    private String notificationUrl;

    @Transactional
    public Report createReport(CreateReportRequest req) {
        Report report = Report.builder()
            .userId(req.getUserId())
            .authorName(req.getAuthorName())
            .authorEmail(req.getAuthorEmail())
            .title(req.getTitle())
            .description(req.getDescription())
            .category(req.getCategory())
            .latitude(req.getLatitude())
            .longitude(req.getLongitude())
            .imageUrl(req.getImageUrl())
            .build();

        Report saved = reportRepository.save(report);

        notifyAsync("SUBMITTED", saved.getAuthorEmail(), saved.getAuthorName(),
                    saved.getTitle(), saved.getCategory().name(), saved.getId().toString());

        notifyAsync("NEW_REPORT_ADMIN", null, saved.getAuthorName(),
                    saved.getTitle(), saved.getCategory().name(), saved.getId().toString());

        return saved;
    }

    @Transactional
    public Report updateStatus(UUID id, Status status) {
        Report report = reportRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Report not found"));

        report.setStatus(status);
        Report saved = reportRepository.save(report);

        String type = (status == Status.VALIDATED) ? "VALIDATED" : "REJECTED";
        notifyAsync(type, saved.getAuthorEmail(), saved.getAuthorName(),
                    saved.getTitle(), saved.getCategory().name(), saved.getId().toString());

        return saved;
    }

    @Transactional
    public void deleteReport(UUID id, UUID userId) {
        Report report = reportRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Report not found"));
        if (!report.getUserId().equals(userId))
            throw new RuntimeException("Unauthorized");

        voteRepository.deleteByReportId(id);
        reportRepository.delete(report);
    }

    public List<Report> getAllReports()             { return reportRepository.findAll(); }
    public List<Report> getByStatus(Status status) { return reportRepository.findByStatus(status); }
    public List<Report> getByUserId(UUID userId)   { return reportRepository.findByCreatedBy(userId); }
    public List<Report> getPendingReports()        { return reportRepository.findByStatus(Status.PENDING); }
    public Optional<Report> getById(UUID id)       { return reportRepository.findById(id); }

    @Async
    protected void notifyAsync(String type, String toEmail, String authorName,
                               String reportTitle, String category, String reportId) {
        try {
            Map<String, String> body = new HashMap<>();
            body.put("type",        type);
            body.put("toEmail",     toEmail != null ? toEmail : "");
            body.put("authorName",  authorName);
            body.put("reportTitle", reportTitle);
            body.put("category",    category);
            body.put("reportId",    reportId);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            restTemplate.postForEntity(
                notificationUrl + "/api/notifications/send",
                new HttpEntity<>(body, headers),
                Void.class
            );
            log.info("Notification [{}] envoyee pour {}", type, authorName);
        } catch (Exception e) {
            log.warn("Notification [{}] non envoyee : {}", type, e.getMessage());
        }
    }
}
