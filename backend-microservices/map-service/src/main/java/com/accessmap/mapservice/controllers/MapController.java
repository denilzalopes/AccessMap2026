package com.accessmap.mapservice.controllers;

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
    }
}
