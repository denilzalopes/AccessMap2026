package com.accessmap.authservice.models;

import jakarta.persistence.*;
<<<<<<< HEAD
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Entité utilisateur — table partagée entre auth-service et user-service.
 * Le auth-service gère uniquement les champs d'authentification.
 */
@Entity
@Table(name = "users",
       indexes = @Index(name = "idx_users_email", columnList = "email"))
=======
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.UUID;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
>>>>>>> 8dc75969daaaeb0db3191c2950f49b72f0e441ea
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
<<<<<<< HEAD
    @GeneratedValue(strategy = GenerationType.UUID)  // Java 21 + Hibernate 7 : UUID natif
    private UUID id;

    @Email
    @NotBlank
    @Column(unique = true, nullable = false, length = 255)
    private String email;

    @NotBlank
    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Role role = Role.CONTRIBUTOR;

    @NotBlank
    @Column(name = "display_name", nullable = false, length = 100)
    private String displayName;

    @org.hibernate.annotations.JdbcTypeCode(org.hibernate.type.SqlTypes.JSON)
    @Column(name = "accessibility_prefs", columnDefinition = "jsonb")
    private String accessibilityPrefs = "{}";

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
=======
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Column(nullable = false)
    private String displayName;

    @Column(columnDefinition = "jsonb")
    private String accessibilityPrefs;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
>>>>>>> 8dc75969daaaeb0db3191c2950f49b72f0e441ea
    }
}
