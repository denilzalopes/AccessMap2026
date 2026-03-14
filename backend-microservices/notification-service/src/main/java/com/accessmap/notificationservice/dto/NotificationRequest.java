package com.accessmap.notificationservice.dto;

import lombok.Data;

@Data
public class NotificationRequest {
    private String type;
    private String toEmail;
    private String authorName;
    private String reportTitle;
    private String category;
    private String reportId;
}
