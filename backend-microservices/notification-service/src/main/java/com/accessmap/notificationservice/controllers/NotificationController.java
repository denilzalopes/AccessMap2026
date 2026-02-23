package com.accessmap.notificationservice.controllers;

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
        return ResponseEntity.ok().build();
    }
}
