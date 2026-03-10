package com.accessmap.reportservice.models;
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
}
