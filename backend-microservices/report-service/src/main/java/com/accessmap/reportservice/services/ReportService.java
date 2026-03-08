package com.accessmap.reportservice.services;

<<<<<<< HEAD
import com.accessmap.reportservice.dto.ReportRequest;
import com.accessmap.reportservice.models.*;
import com.accessmap.reportservice.repositories.ReportRepository;
import com.accessmap.reportservice.repositories.VoteRepository;
import lombok.RequiredArgsConstructor;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.PrecisionModel;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
=======
import com.accessmap.reportservice.models.Report;
import com.accessmap.reportservice.models.Vote;
import com.accessmap.reportservice.models.Type;
import com.accessmap.reportservice.repositories.ReportRepository;
import com.accessmap.reportservice.repositories.VoteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
>>>>>>> 8dc75969daaaeb0db3191c2950f49b72f0e441ea

import java.util.List;
import java.util.Optional;
import java.util.UUID;
<<<<<<< HEAD

/**
 * Service signalements — CRUD + votes + requêtes géospatiales PostGIS.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
=======
import org.locationtech.jts.geom.Point;

@Service
@RequiredArgsConstructor
>>>>>>> 8dc75969daaaeb0db3191c2950f49b72f0e441ea
public class ReportService {

    private final ReportRepository reportRepository;
    private final VoteRepository voteRepository;

<<<<<<< HEAD
    /** Factory JTS avec SRID 4326 (WGS84 — coordonnées GPS standard) */
    private static final GeometryFactory GEOMETRY_FACTORY =
            new GeometryFactory(new PrecisionModel(), 4326);

    // ── Lecture ─────────────────────────────────────────────────────────────

=======
>>>>>>> 8dc75969daaaeb0db3191c2950f49b72f0e441ea
    public List<Report> getAllReports() {
        return reportRepository.findAll();
    }

    public Optional<Report> getReportById(UUID id) {
        return reportRepository.findById(id);
    }

<<<<<<< HEAD
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
        return reportRepository.save(report);
    }

    @Transactional
    public Report updateStatus(UUID id, Status newStatus) {
        Report report = reportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Signalement introuvable : " + id));
        report.setStatus(newStatus);
        return reportRepository.save(report);
    }

    @Transactional
=======
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

>>>>>>> 8dc75969daaaeb0db3191c2950f49b72f0e441ea
    public void deleteReport(UUID id) {
        reportRepository.deleteById(id);
    }

<<<<<<< HEAD
    // ── Votes ────────────────────────────────────────────────────────────────

    @Transactional
    public Report vote(UUID reportId, UUID userId, VoteType voteType) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new RuntimeException("Signalement introuvable"));
=======
    public Report voteReport(UUID reportId, UUID userId, Type voteType) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new RuntimeException("Report not found"));
>>>>>>> 8dc75969daaaeb0db3191c2950f49b72f0e441ea

        Optional<Vote> existingVote = voteRepository.findByReportIdAndUserId(reportId, userId);

        if (existingVote.isPresent()) {
            Vote vote = existingVote.get();
            if (vote.getType().equals(voteType)) {
<<<<<<< HEAD
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
=======
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
>>>>>>> 8dc75969daaaeb0db3191c2950f49b72f0e441ea
                }
                vote.setType(voteType);
                voteRepository.save(vote);
            }
        } else {
<<<<<<< HEAD
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
=======
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
>>>>>>> 8dc75969daaaeb0db3191c2950f49b72f0e441ea
}
