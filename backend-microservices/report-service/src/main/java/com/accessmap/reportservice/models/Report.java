package com.accessmap.reportservice.models;

import jakarta.persistence.*;
<<<<<<< HEAD
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.locationtech.jts.geom.Point;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Entité signalement — représente un obstacle d'accessibilité urbaine.
 * Utilise JTS Point pour les coordonnées GPS (PostGIS GEOMETRY(POINT, 4326)).
 */
@Entity
@Table(name = "reports",
       indexes = {
           @Index(name = "idx_reports_created_by", columnList = "created_by"),
           @Index(name = "idx_reports_status", columnList = "status"),
           @Index(name = "idx_reports_category", columnList = "category")
       })
=======
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.UUID;
import org.locationtech.jts.geom.Point;
import java.time.LocalDateTime;

@Entity
@Table(name = "reports")
>>>>>>> 8dc75969daaaeb0db3191c2950f49b72f0e441ea
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Report {

    @Id
<<<<<<< HEAD
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    /**
     * Localisation GPS — GEOMETRY(POINT, 4326) avec SRID WGS84.
     * Hibernate 7 + JTS gère nativement le type Point via hibernate-spatial intégré.
     * Note: PostgreSQL GEOGRAPHY est converti en GEOMETRY côté Hibernate.
     */
    @NotNull
    @Column(columnDefinition = "GEOMETRY(POINT, 4326)", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private Point location;

    @com.fasterxml.jackson.annotation.JsonProperty("latitude")
    public double getLatitude() { return location != null ? location.getY() : 0; }

    @com.fasterxml.jackson.annotation.JsonProperty("longitude")
    public double getLongitude() { return location != null ? location.getX() : 0; }

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
=======
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    // For PostGIS GEOGRAPHY(POINT, 4326), a specific library like Hibernate Spatial
    // or a custom type mapping would be needed. For now, representing as String.
    @Column(columnDefinition = "GEOGRAPHY(Point, 4326)")
    private Point location;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
>>>>>>> 8dc75969daaaeb0db3191c2950f49b72f0e441ea
    private Category category;

    @Column(columnDefinition = "TEXT")
    private String description;

<<<<<<< HEAD
    @Column(name = "photo_url", length = 500)
    private String photoUrl;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Status status = Status.PENDING;

    @NotNull
    @Column(name = "created_by", nullable = false)
    private UUID createdBy;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

=======
    @Column(name = "photo_url")
    private String photoUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

    @Column(name = "created_by", nullable = false)
    private UUID createdBy;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

>>>>>>> 8dc75969daaaeb0db3191c2950f49b72f0e441ea
    @Column(name = "votes_up", nullable = false)
    private Integer votesUp = 0;

    @Column(name = "votes_down", nullable = false)
    private Integer votesDown = 0;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
<<<<<<< HEAD
        this.updatedAt = LocalDateTime.now();
        if (this.status == null) this.status = Status.PENDING;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
=======
>>>>>>> 8dc75969daaaeb0db3191c2950f49b72f0e441ea
    }
}
