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
    @PostMapping("/welcome") public ResponseEntity<Void> welcome(@RequestParam String to, @RequestParam String name) {
        notificationService.sendWelcomeEmail(to, name);
        return ResponseEntity.ok().build();
    }
}
