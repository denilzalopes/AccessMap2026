package com.accessmap.mapservice.controllers;
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
    }
}
