package com.accessmap.reportservice.dto;

import com.accessmap.reportservice.models.Category;
import lombok.Data;

import java.util.UUID;

@Data
public class CreateReportRequest {
    private UUID     userId;
    private String   authorName;
    private String   authorEmail;
    private String   title;
    private String   description;
    private Category category;
    private Double   latitude;
    private Double   longitude;
    private String   imageUrl;
}
