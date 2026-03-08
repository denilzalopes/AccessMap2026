package com.accessmap.mapservice.dto;
import lombok.*;
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class MapReportDto {
    private String id;
    private double latitude;
    private double longitude;
    private String category;
    private String status;
    private int votesUp;
    private int votesDown;
    private String description;
}
