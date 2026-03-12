package com.accessmap.notificationservice.controllers;
import com.accessmap.notificationservice.dto.EmailRequest;
import com.accessmap.notificationservice.services.NotificationService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/notifications") @RequiredArgsConstructor
@Tag(name = "Notifications", description = "Envoi d'emails de notification")
public class NotificationController {
    private final NotificationService notificationService;
    @PostMapping("/email") public ResponseEntity<Void> sendEmail(@Valid @RequestBody EmailRequest req) {
        notificationService.sendEmail(req.getTo(), req.getSubject(), req.getBody());
        return ResponseEntity.ok().build();
    }
    @PostMapping("/welcome")
    public ResponseEntity<Void> welcome(@RequestParam String to, @RequestParam String name) {
        notificationService.sendWelcomeEmail(to, name);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/report-validated")
    public ResponseEntity<Void> reportValidated(@RequestParam String to, @RequestParam String category) {
        notificationService.sendReportValidatedEmail(to, category);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/report-rejected")
    public ResponseEntity<Void> reportRejected(@RequestParam String to, @RequestParam String category) {
        notificationService.sendReportRejectedEmail(to, category);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/vote-notification")
    public ResponseEntity<Void> voteNotification(
            @RequestParam String to,
            @RequestParam String category,
            @RequestParam int votesUp,
            @RequestParam int votesDown) {
        notificationService.sendVoteNotificationEmail(to, category, votesUp, votesDown);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/weekly-recap")
    public ResponseEntity<Void> weeklyRecap(
            @RequestParam String to,
            @RequestParam String displayName,
            @RequestParam int totalReports,
            @RequestParam int validated,
            @RequestParam int votesUp) {
        notificationService.sendWeeklyRecapEmail(to, displayName, totalReports, validated, votesUp);
        return ResponseEntity.ok().build();
    }
}
