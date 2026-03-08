package com.accessmap.userservice.models;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;
@Entity @Table(name = "users") @Data @NoArgsConstructor @AllArgsConstructor
public class User {
    @Id private UUID id;
    @Column(unique = true, nullable = false) private String email;
    @Column(name = "password_hash", nullable = false) private String passwordHash;
    @Enumerated(EnumType.STRING) @Column(nullable = false) private Role role;
    @Column(name = "display_name", nullable = false) private String displayName;
    @org.hibernate.annotations.JdbcTypeCode(org.hibernate.type.SqlTypes.JSON)
    @Column(name = "accessibility_prefs", columnDefinition = "jsonb") private String accessibilityPrefs = "{}";
    @Column(name = "created_at") private LocalDateTime createdAt;
    @Column(name = "updated_at") private LocalDateTime updatedAt;
    @PreUpdate protected void onUpdate() { this.updatedAt = LocalDateTime.now(); }
}
