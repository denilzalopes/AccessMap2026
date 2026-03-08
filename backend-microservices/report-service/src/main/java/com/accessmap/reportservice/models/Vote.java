package com.accessmap.reportservice.models;
<<<<<<< HEAD
import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;
@Entity
@Table(name = "votes", uniqueConstraints = @UniqueConstraint(columnNames = {"report_id","user_id"}))
@Data @NoArgsConstructor @AllArgsConstructor
public class Vote {
    @Id @GeneratedValue(strategy = GenerationType.UUID) private UUID id;
    @Column(name = "report_id", nullable = false) private UUID reportId;
    @Column(name = "user_id", nullable = false) private UUID userId;
    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 4) private VoteType type;
=======

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.UUID;

@Entity
@Table(name = "votes", uniqueConstraints = {@UniqueConstraint(columnNames = {"report_id", "user_id"})})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Vote {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "report_id", nullable = false)
    private UUID reportId;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Type type;
>>>>>>> 8dc75969daaaeb0db3191c2950f49b72f0e441ea
}
