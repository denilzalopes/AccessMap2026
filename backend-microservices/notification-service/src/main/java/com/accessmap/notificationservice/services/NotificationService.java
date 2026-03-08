package com.accessmap.notificationservice.services;
<<<<<<< HEAD
=======

>>>>>>> 8dc75969daaaeb0db3191c2950f49b72f0e441ea
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
<<<<<<< HEAD
/** Service notifications — envoi d'emails via JavaMailSender (Mailtrap en dev) */
@Service @RequiredArgsConstructor
public class NotificationService {
    private final JavaMailSender mailSender;
    public void sendEmail(String to, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("noreply@accessmap.app");
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);
        mailSender.send(message);
    }
    public void sendWelcomeEmail(String to, String displayName) {
        sendEmail(to, "Bienvenue sur AccessMap 🗺️",
            "Bonjour " + displayName + ",\n\nMerci de rejoindre AccessMap !\nEnsemble, améliorons l'accessibilité urbaine.\n\nL'équipe AccessMap");
    }
    public void sendReportValidatedEmail(String to, String category) {
        sendEmail(to, "Votre signalement a été validé ✓",
            "Votre signalement de type " + category + " a été validé par notre équipe de modération.\nMerci pour votre contribution !");
    }
=======

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final JavaMailSender mailSender;

    public void sendEmail(String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("noreply@accessmap.com");
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        mailSender.send(message);
    }
>>>>>>> 8dc75969daaaeb0db3191c2950f49b72f0e441ea
}
