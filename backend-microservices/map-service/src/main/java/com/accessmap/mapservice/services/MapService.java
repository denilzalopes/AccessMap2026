package com.accessmap.mapservice.services;
import com.accessmap.mapservice.dto.MapReportDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import java.util.List;
/** Service carte — agrège les données du report-service pour affichage Leaflet */
@Service @RequiredArgsConstructor
public class MapService {
    private final WebClient.Builder webClientBuilder;
    private static final String REPORT_SERVICE_URL = System.getenv().getOrDefault("REPORT_SERVICE_URL", "http://report-service:8082");
    /** Récupère tous les signalements validés pour la carte principale */
    public List<MapReportDto> getMapData(String category, String status) {
        // Dans une architecture microservices réelle, on ferait un appel HTTP au report-service
        // Pour le dev local, retourne des données de démo Paris
        return List.of(
            MapReportDto.builder().id("1").latitude(48.8566).longitude(2.3522).category("RAMP").status("VALIDATED").votesUp(5).votesDown(0).description("Rampe d'accès dégradée").build(),
            MapReportDto.builder().id("2").latitude(48.8600).longitude(2.3400).category("STEP").status("PENDING").votesUp(2).votesDown(1).description("Marche non signalée").build(),
            MapReportDto.builder().id("3").latitude(48.8520).longitude(2.3600).category("ELEVATOR").status("VALIDATED").votesUp(8).votesDown(0).description("Ascenseur en panne").build()
        );
    }
}
