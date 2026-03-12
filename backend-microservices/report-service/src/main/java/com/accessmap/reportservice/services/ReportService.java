package com.accessmap.reportservice.services;

import com.accessmap.reportservice.dto.ReportRequest;
import com.accessmap.reportservice.models.*;
import com.accessmap.reportservice.repositories.ReportRepository;
import com.accessmap.reportservice.repositories.VoteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.client.RestTemplate;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.PrecisionModel;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Service signalements — CRUD + votes + requêtes géospatiales PostGIS.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReportService {

    @Value("${notification.service.url:https://notification-service-hhbj.onrender.com}")
    private String notifUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    private void notifyAsync(String url) {
        try { restTemplate.postForEntity(url, null, Void.class); }
        catch (Exception e) { /* notification non bloquante */ }
    }

    private final ReportRepository reportRepository;
    private final VoteRepository voteRepository;

    /** Factory JTS avec SRID 4326 (WGS84 — coordonnées GPS standard) */
    private static final GeometryFactory GEOMETRY_FACTORY =
            new GeometryFactory(new PrecisionModel(), 4326);

    // ── Lecture ─────────────────────────────────────────────────────────────

    public List<Report> getAllReports() {
        return reportRepository.findAll();
    }

    public Optional<Report> getReportById(UUID id) {
        return reportRepository.findById(id);
    }

    public List<Report> getReportsByUser(UUID userId) {
        return reportRepository.findByCreatedBy(userId);
    }

    public List<Report> getReportsByStatus(Status status) {
        return reportRepository.findByStatus(status);
    }

    public List<Report> getReportsNearby(double lat, double lon, double radiusMeters) {
        return reportRepository.findWithinRadius(lat, lon, radiusMeters);
    }

    // ── Création / Modification ──────────────────────────────────────────────

    @Transactional
    public Report createReport(ReportRequest req) {
        Report report = new Report();
        report.setLocation(buildPoint(req.getLatitude(), req.getLongitude()));
        report.setCategory(req.getCategory());
        report.setDescription(req.getDescription());
        report.setPhotoUrl(req.getPhotoUrl());
        report.setCreatedBy(UUID.fromString(req.getCreatedBy()));
        report.setStatus(Status.PENDING);
        Report saved = reportRepository.save(report);
        // Notifier l'auteur du vote (non bloquant)
        notifyAsync(notifUrl + "/api/notifications/vote-notification?to=&category="
            + saved.getCategory().name()
            + "&votesUp=" + saved.getVotesUp()
            + "&votesDown=" + saved.getVotesDown());
        return saved;
    }

    @Transactional
    public Report updateStatus(UUID id, Status newStatus) {
        Report report = reportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Signalement introuvable : " + id));
        report.setStatus(newStatus);
        return reportRepository.save(report);
    }

    @Transactional
    public Report updateReport(UUID id, ReportRequest request) {
        Report report = reportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Report not found"));
        if (!report.getCreatedBy().equals(UUID.fromString(request.getCreatedBy()))) {
            throw new RuntimeException("Forbidden: you can only edit your own reports");
        }
        if (request.getCategory() != null) report.setCategory(Category.valueOf(request.getCategory().toString()));
        report.setDescription(request.getDescription());
        if (request.getPhotoUrl() != null) report.setPhotoUrl(request.getPhotoUrl());
        return reportRepository.save(report);
    }

    public void deleteReport(UUID id, UUID requestingUserId) {
        Report report = reportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Report not found"));
        if (!report.getCreatedBy().equals(requestingUserId)) {
            throw new RuntimeException("Forbidden: you can only delete your own reports");
        }
        reportRepository.deleteById(id);
    }

    // ── Votes ────────────────────────────────────────────────────────────────

    @Transactional
    public Report vote(UUID reportId, UUID userId, VoteType voteType) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new RuntimeException("Signalement introuvable"));

        Optional<Vote> existingVote = voteRepository.findByReportIdAndUserId(reportId, userId);

        if (existingVote.isPresent()) {
            Vote vote = existingVote.get();
            if (vote.getType().equals(voteType)) {
                // Vote identique → annulation
                if (voteType == VoteType.UP) report.setVotesUp(Math.max(0, report.getVotesUp() - 1));
                else report.setVotesDown(Math.max(0, report.getVotesDown() - 1));
                voteRepository.delete(vote);
            } else {
                // Changement de vote
                if (voteType == VoteType.UP) {
                    report.setVotesUp(report.getVotesUp() + 1);
                    report.setVotesDown(Math.max(0, report.getVotesDown() - 1));
                } else {
                    report.setVotesDown(report.getVotesDown() + 1);
                    report.setVotesUp(Math.max(0, report.getVotesUp() - 1));
                }
                vote.setType(voteType);
                voteRepository.save(vote);
            }
        } else {
            // Nouveau vote
            Vote vote = new Vote(null, reportId, userId, voteType);
            voteRepository.save(vote);
            if (voteType == VoteType.UP) report.setVotesUp(report.getVotesUp() + 1);
            else report.setVotesDown(report.getVotesDown() + 1);
        }

        return reportRepository.save(report);
    }

    // ── Utilitaires ──────────────────────────────────────────────────────────

    /** Construit un Point JTS à partir de lat/lon avec SRID WGS84 */
    private Point buildPoint(double lat, double lon) {
        Point point = GEOMETRY_FACTORY.createPoint(new Coordinate(lon, lat));
        point.setSRID(4326);
        return point;
    }
}
