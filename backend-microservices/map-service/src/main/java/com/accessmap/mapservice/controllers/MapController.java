package com.accessmap.mapservice.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/map")
@RequiredArgsConstructor
public class MapController {

    @GetMapping("/reports")
    public ResponseEntity<List<Map<String, Object>>> getAggregatedReports() {
        // Placeholder for aggregated geospatial data, clustering, and filters
        // This will be implemented in detail once PostGIS is set up and report-service is functional.
        return ResponseEntity.ok(List.of(
                Map.of("id", "1", "latitude", 48.8566, "longitude", 2.3522, "category", "RAMP", "status", "VALIDATED"),
                Map.of("id", "2", "latitude", 48.8600, "longitude", 2.3400, "category", "STEP", "status", "PENDING")
        ));
    }
}
