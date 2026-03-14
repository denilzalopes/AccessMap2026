package com.accessmap.notificationservice.controllers;

import com.accessmap.notificationservice.dto.NotificationRequest;
import com.accessmap.notificationservice.services.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @PostMapping("/send")
    public ResponseEntity<Void> send(@RequestBody NotificationRequest req) {
        switch (req.getType()) {
            case "SUBMITTED" -> notificationService.sendReportSubmittedToContributor(
                req.getToEmail(), req.getAuthorName(), req.getReportTitle());
            case "VALIDATED" -> notificationService.sendReportValidatedToContributor(
                req.getToEmail(), req.getAuthorName(), req.getReportTitle());
            case "REJECTED" -> notificationService.sendReportRejectedToContributor(
                req.getToEmail(), req.getAuthorName(), req.getReportTitle());
            case "NEW_REPORT_ADMIN" -> notificationService.sendNewReportToAdmin(
                req.getAuthorName(), req.getReportTitle(), req.getCategory(), req.getReportId());
        }
        return ResponseEntity.ok().build();
    }
}
