package com.accessmap.reportservice.services;

import com.accessmap.reportservice.models.Report;
import com.accessmap.reportservice.models.Vote;
import com.accessmap.reportservice.models.Type;
import com.accessmap.reportservice.repositories.ReportRepository;
import com.accessmap.reportservice.repositories.VoteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final ReportRepository reportRepository;
    private final VoteRepository voteRepository;

    public List<Report> getAllReports() {
        return reportRepository.findAll();
    }

    public Optional<Report> getReportById(UUID id) {
        return reportRepository.findById(id);
    }

    public Report createReport(Report report) {
        return reportRepository.save(report);
    }

    public Report updateReport(UUID id, Report reportDetails) {
        Report report = reportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Report not found"));
        report.setLocation(reportDetails.getLocation());
        report.setCategory(reportDetails.getCategory());
        report.setDescription(reportDetails.getDescription());
        report.setPhotoUrl(reportDetails.getPhotoUrl());
        report.setStatus(reportDetails.getStatus());
        return reportRepository.save(report);
    }

    public void deleteReport(UUID id) {
        reportRepository.deleteById(id);
    }

    public Report voteReport(UUID reportId, UUID userId, Type voteType) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new RuntimeException("Report not found"));

        Optional<Vote> existingVote = voteRepository.findByReportIdAndUserId(reportId, userId);

        if (existingVote.isPresent()) {
            Vote vote = existingVote.get();
            if (vote.getType().equals(voteType)) {
                // User already voted this way, do nothing or throw exception
                return report;
            } else {
                // Change vote
                if (voteType.equals(Type.UP)) {
                    report.setVotesUp(report.getVotesUp() + 1);
                    report.setVotesDown(report.getVotesDown() - 1);
                } else {
                    report.setVotesDown(report.getVotesDown() + 1);
                    report.setVotesUp(report.getVotesUp() - 1);
                }
                vote.setType(voteType);
                voteRepository.save(vote);
            }
        } else {
            // New vote
            Vote newVote = new Vote();
            newVote.setReportId(reportId);
            newVote.setUserId(userId);
            newVote.setType(voteType);
            voteRepository.save(newVote);

            if (voteType.equals(Type.UP)) {
                report.setVotesUp(report.getVotesUp() + 1);
            } else {
                report.setVotesDown(report.getVotesDown() + 1);
            }
        }
        return reportRepository.save(report);
    }
}
