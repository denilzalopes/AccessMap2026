package com.accessmap.reportservice.controllers;

import com.accessmap.reportservice.dto.ReportRequest;
import com.accessmap.reportservice.models.Report;
import com.accessmap.reportservice.models.Status;
import com.accessmap.reportservice.models.VoteType;
import com.accessmap.reportservice.services.ReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * Contrôleur REST — CRUD signalements d'accessibilité urbaine.
 */
@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
@Tag(name = "Signalements", description = "Gestion des obstacles d'accessibilité")
public class ReportController {

    private final ReportService reportService;

    @GetMapping
    @Operation(summary = "Liste tous les signalements")
    public ResponseEntity<List<Report>> getAllReports() {
        return ResponseEntity.ok(reportService.getAllReports());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Détail d'un signalement")
    public ResponseEntity<Report> getReportById(@PathVariable UUID id) {
        return reportService.getReportById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Signalements d'un utilisateur")
    public ResponseEntity<List<Report>> getByUser(@PathVariable UUID userId) {
        return ResponseEntity.ok(reportService.getReportsByUser(userId));
    }

    @GetMapping("/nearby")
    @Operation(summary = "Signalements à proximité (rayon en mètres)")
    public ResponseEntity<List<Report>> getNearby(
            @RequestParam double lat,
            @RequestParam double lon,
            @RequestParam(defaultValue = "500") double radius) {
        return ResponseEntity.ok(reportService.getReportsNearby(lat, lon, radius));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Créer un signalement")
    public ResponseEntity<Report> create(@Valid @RequestBody ReportRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(reportService.createReport(request));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Modifier le statut (MODERATOR/ADMIN)")
    public ResponseEntity<Report> updateStatus(
            @PathVariable UUID id,
            @RequestParam Status status) {
        return ResponseEntity.ok(reportService.updateStatus(id, status));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Modifier un signalement")
    public ResponseEntity<Report> update(
            @PathVariable UUID id,
            @Valid @RequestBody ReportRequest request) {
        return ResponseEntity.ok(reportService.updateReport(id, request));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Supprimer un signalement")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        reportService.deleteReport(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{reportId}/vote")
    @Operation(summary = "Voter pour/contre un signalement")
    public ResponseEntity<Report> vote(
            @PathVariable UUID reportId,
            @RequestParam UUID userId,
            @RequestParam VoteType type) {
        return ResponseEntity.ok(reportService.vote(reportId, userId, type));
    }
}
