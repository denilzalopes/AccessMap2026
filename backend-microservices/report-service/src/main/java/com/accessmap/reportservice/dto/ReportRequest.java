package com.accessmap.reportservice.dto;
import com.accessmap.reportservice.models.Category;
import jakarta.validation.constraints.*;
import lombok.Data;
@Data
public class ReportRequest {
    @NotNull @DecimalMin("-90") @DecimalMax("90") private Double latitude;
    @NotNull @DecimalMin("-180") @DecimalMax("180") private Double longitude;
    @NotNull private Category category;
    @Size(max = 1000) private String description;
    @Size(max = 500) private String photoUrl;
    @NotNull private String createdBy; // UUID en string
}
