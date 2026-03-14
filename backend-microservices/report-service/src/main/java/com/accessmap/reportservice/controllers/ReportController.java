package com.accessmap.reportservice.controllers;

import com.accessmap.reportservice.dto.CreateReportRequest;
import com.accessmap.reportservice.models.Report;
import com.accessmap.reportservice.models.Status;
import com.accessmap.reportservice.models.Vote;
import com.accessmap.reportservice.models.VoteType;
import com.accessmap.reportservice.repositories.VoteRepository;
import com.accessmap.reportservice.services.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService  reportService;
    private final VoteRepository voteRepository;

    @PostMapping
    public ResponseEntity<Report> create(@RequestBody CreateReportRequest req) {
        return ResponseEntity.status(201).body(reportService.createReport(req));
    }

    @GetMapping
    public ResponseEntity<List<Report>> getAll(
            @RequestParam(required = false) String status) {
        if (status != null) {
            return ResponseEntity.ok(reportService.getByStatus(Status.valueOf(status)));
        }
        return ResponseEntity.ok(reportService.getAllReports());
    }

    @GetMapping("/pending")
    public ResponseEntity<List<Report>> getPending(
            @RequestParam(required = false) String requesterRole) {
        if (!"ADMIN".equals(requesterRole) && !"MODERATOR".equals(requesterRole)) {
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.ok(reportService.getPendingReports());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Report>> getByUser(@PathVariable UUID userId) {
        return ResponseEntity.ok(reportService.getByUserId(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Report> getById(@PathVariable UUID id) {
        return reportService.getById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Report> updateStatus(
            @PathVariable UUID id,
            @RequestParam String status,
            @RequestParam(required = false) String requesterRole) {
        if (!"ADMIN".equals(requesterRole) && !"MODERATOR".equals(requesterRole)) {
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.ok(reportService.updateStatus(id, Status.valueOf(status)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable UUID id,
            @RequestParam String userId) {
        reportService.deleteReport(id, UUID.fromString(userId));
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{reportId}/vote")
    public ResponseEntity<?> vote(
            @PathVariable UUID reportId,
            @RequestParam String userId,
            @RequestParam String type) {
        UUID uid = UUID.fromString(userId);
        var existing = voteRepository.findByReportIdAndUserId(reportId, uid);
        if (existing.isPresent()) {
            return ResponseEntity.badRequest().body("Vous avez deja vote pour ce signalement.");
        }
        Vote vote = Vote.builder()
            .reportId(reportId)
            .userId(uid)
            .type(VoteType.valueOf(type))
            .build();
        voteRepository.save(vote);
        int upCount   = voteRepository.findByReportId(reportId).stream()
            .filter(v -> v.getType() == VoteType.UP).toList().size();
        int downCount = voteRepository.findByReportId(reportId).stream()
            .filter(v -> v.getType() == VoteType.DOWN).toList().size();
        return ResponseEntity.ok(java.util.Map.of("up", upCount, "down", downCount));
    }
}
