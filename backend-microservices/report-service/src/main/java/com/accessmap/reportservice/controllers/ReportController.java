package com.accessmap.reportservice.controllers;

import com.accessmap.reportservice.models.Report;
import com.accessmap.reportservice.models.Type;
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

    private final ReportService reportService;

    @GetMapping
    public ResponseEntity<List<Report>> getAllReports() {
        return ResponseEntity.ok(reportService.getAllReports());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Report> getReportById(@PathVariable UUID id) {
        return reportService.getReportById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Report> createReport(@RequestBody Report report) {
        return ResponseEntity.ok(reportService.createReport(report));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Report> updateReport(@PathVariable UUID id, @RequestBody Report reportDetails) {
        return ResponseEntity.ok(reportService.updateReport(id, reportDetails));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReport(@PathVariable UUID id) {
        reportService.deleteReport(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{reportId}/vote")
    public ResponseEntity<Report> voteReport(@PathVariable UUID reportId, @RequestParam UUID userId, @RequestParam Type voteType) {
        return ResponseEntity.ok(reportService.voteReport(reportId, userId, voteType));
    }
}
