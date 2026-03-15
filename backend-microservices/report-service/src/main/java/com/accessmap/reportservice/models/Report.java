package com.accessmap.reportservice.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.locationtech.jts.geom.Point;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "reports")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "author_name", nullable = false)
    private String authorName;

    @Column(name = "author_email", nullable = false)
    private String authorEmail;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "GEOMETRY(POINT, 4326)")
    @JsonIgnore
    private Point location;

    @JsonProperty("latitude")
    public double getLatitude() { return location != null ? location.getY() : 0; }

    @JsonProperty("longitude")
    public double getLongitude() { return location != null ? location.getX() : 0; }

    @Enumerated(EnumType.STRING)
    private Category category;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "photo_url")
    @JsonIgnore
    private String photoUrl;

    @JsonProperty("imageUrl")
    public String getImageUrl() { return photoUrl; }

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private Status status = Status.PENDING;

    @Column(name = "created_by")
    private UUID createdBy;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "votes_up")
    @Builder.Default
    private Integer votesUp = 0;

    @Column(name = "votes_down")
    @Builder.Default
    private Integer votesDown = 0;
}
