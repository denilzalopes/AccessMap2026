package com.accessmap.reportservice.controllers;

<<<<<<< HEAD
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
=======
import com.accessmap.reportservice.models.Report;
import com.accessmap.reportservice.models.Type;
import com.accessmap.reportservice.services.ReportService;
import lombok.RequiredArgsConstructor;
>>>>>>> 8dc75969daaaeb0db3191c2950f49b72f0e441ea
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

<<<<<<< HEAD
/**
 * Contrôleur REST — CRUD signalements d'accessibilité urbaine.
 */
@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
@Tag(name = "Signalements", description = "Gestion des obstacles d'accessibilité")
=======
@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
>>>>>>> 8dc75969daaaeb0db3191c2950f49b72f0e441ea
public class ReportController {

    private final ReportService reportService;

    @GetMapping
<<<<<<< HEAD
    @Operation(summary = "Liste tous les signalements")
=======
>>>>>>> 8dc75969daaaeb0db3191c2950f49b72f0e441ea
    public ResponseEntity<List<Report>> getAllReports() {
        return ResponseEntity.ok(reportService.getAllReports());
    }

    @GetMapping("/{id}")
<<<<<<< HEAD
    @Operation(summary = "Détail d'un signalement")
=======
>>>>>>> 8dc75969daaaeb0db3191c2950f49b72f0e441ea
    public ResponseEntity<Report> getReportById(@PathVariable UUID id) {
        return reportService.getReportById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

<<<<<<< HEAD
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

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Supprimer un signalement")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
=======
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
>>>>>>> 8dc75969daaaeb0db3191c2950f49b72f0e441ea
        reportService.deleteReport(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{reportId}/vote")
<<<<<<< HEAD
    @Operation(summary = "Voter pour/contre un signalement")
    public ResponseEntity<Report> vote(
            @PathVariable UUID reportId,
            @RequestParam UUID userId,
            @RequestParam VoteType type) {
        return ResponseEntity.ok(reportService.vote(reportId, userId, type));
=======
    public ResponseEntity<Report> voteReport(@PathVariable UUID reportId, @RequestParam UUID userId, @RequestParam Type voteType) {
        return ResponseEntity.ok(reportService.voteReport(reportId, userId, voteType));
>>>>>>> 8dc75969daaaeb0db3191c2950f49b72f0e441ea
    }
}
