package com.accessmap.reportservice.dto;

import com.accessmap.reportservice.models.Report;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class ReportResponse {
    private UUID   id;
    private UUID   userId;
    private String authorName;
    private String authorEmail;
    private String title;
    private String category;
    private String description;
    private String status;
    private String imageUrl;
    private UUID   createdBy;
    private double latitude;
    private double longitude;
    private int    votesUp;
    private int    votesDown;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static ReportResponse from(Report r) {
        ReportResponse dto = new ReportResponse();
        dto.setId(r.getId());
        dto.setUserId(r.getUserId());
        dto.setAuthorName(r.getAuthorName());
        dto.setAuthorEmail(r.getAuthorEmail());
        dto.setTitle(r.getTitle());
        dto.setCategory(r.getCategory() != null ? r.getCategory().name() : null);
        dto.setDescription(r.getDescription());
        dto.setStatus(r.getStatus() != null ? r.getStatus().name() : null);
        dto.setImageUrl(r.getPhotoUrl());
        dto.setCreatedBy(r.getCreatedBy());
        dto.setLatitude(r.getLatitude());
        dto.setLongitude(r.getLongitude());
        dto.setVotesUp(r.getVotesUp() != null ? r.getVotesUp() : 0);
        dto.setVotesDown(r.getVotesDown() != null ? r.getVotesDown() : 0);
        dto.setCreatedAt(r.getCreatedAt());
        dto.setUpdatedAt(r.getUpdatedAt());
        return dto;
    }
}
