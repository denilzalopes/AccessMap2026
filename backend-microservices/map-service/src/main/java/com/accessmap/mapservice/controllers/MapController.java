package com.accessmap.mapservice.controllers;
<<<<<<< HEAD
import com.accessmap.mapservice.dto.MapReportDto;
import com.accessmap.mapservice.services.MapService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController @RequestMapping("/api/map") @RequiredArgsConstructor
@Tag(name = "Carte", description = "Données géospatiales pour l'affichage Leaflet")
public class MapController {
    private final MapService mapService;
    @GetMapping("/reports") @Operation(summary = "Données carte (filtres optionnels)")
    public ResponseEntity<List<MapReportDto>> getMapData(
        @RequestParam(required = false) String category,
        @RequestParam(required = false) String status) {
        return ResponseEntity.ok(mapService.getMapData(category, status));
=======

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.accessmap.mapservice.services.MapService;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/map")
@RequiredArgsConstructor
public class MapController {

    private final MapService mapService;

    @GetMapping("/reports")
    public ResponseEntity<List<Map<String, Object>>> getAggregatedReports() {
        // Placeholder for aggregated geospatial data, clustering, and filters
        return ResponseEntity.ok(mapService.getAggregatedReports());
>>>>>>> 8dc75969daaaeb0db3191c2950f49b72f0e441ea
    }
}
