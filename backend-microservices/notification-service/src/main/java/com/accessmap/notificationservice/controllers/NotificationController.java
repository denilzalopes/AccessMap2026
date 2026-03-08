package com.accessmap.notificationservice.controllers;
<<<<<<< HEAD
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
=======

import com.accessmap.notificationservice.services.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @PostMapping("/send-email")
    public ResponseEntity<Void> sendEmail(@RequestParam String to, @RequestParam String subject, @RequestParam String text) {
        notificationService.sendEmail(to, subject, text);
>>>>>>> 8dc75969daaaeb0db3191c2950f49b72f0e441ea
        return ResponseEntity.ok().build();
    }
}
