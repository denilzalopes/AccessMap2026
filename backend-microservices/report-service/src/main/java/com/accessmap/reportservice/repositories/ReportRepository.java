package com.accessmap.reportservice.repositories;
import com.accessmap.reportservice.models.Report;
import com.accessmap.reportservice.models.Category;
import com.accessmap.reportservice.models.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.UUID;
public interface ReportRepository extends JpaRepository<Report, UUID> {
    List<Report> findByCreatedBy(UUID userId);
    List<Report> findByStatus(Status status);
    List<Report> findByCategory(Category category);
    // Requête géospatiale : signalements dans un rayon (en mètres)
    @Query(value = "SELECT * FROM reports WHERE ST_DWithin(location::geography, ST_SetSRID(ST_MakePoint(:lon,:lat),4326)::geography, :radius)", nativeQuery = true)
    List<Report> findWithinRadius(@Param("lat") double lat, @Param("lon") double lon, @Param("radius") double radiusMeters);
}
