package com.accessmap.notificationservice.dto;
import jakarta.validation.constraints.*;
import lombok.Data;
@Data
public class EmailRequest {
    @Email @NotBlank private String to;
    @NotBlank @Size(max = 200) private String subject;
    @NotBlank private String body;
}
