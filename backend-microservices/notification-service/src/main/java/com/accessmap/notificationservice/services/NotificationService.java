package com.accessmap.notificationservice.services;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
@Slf4j
public class NotificationService {

    @Value("${brevo.api.key:placeholder}")
    private String apiKey;

    @Value("${app.admin.email:azlinedlopes@gmail.com}")
    private String adminEmail;

    private final RestTemplate restTemplate = new RestTemplate();
    private static final String BREVO_URL = "https://api.brevo.com/v3/smtp/email";

    private void send(String to, String subject, String body) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("api-key", apiKey);

            Map<String, Object> payload = Map.of(
                "sender",  Map.of("name", "AccessMap", "email", "azlinedlopes@gmail.com"),
                "to",      new Object[]{Map.of("email", to)},
                "subject", subject,
                "textContent", body
            );

            restTemplate.postForEntity(BREVO_URL, new HttpEntity<>(payload, headers), String.class);
            log.info("Email envoye a {} : {}", to, subject);
        } catch (Exception e) {
            log.error("Echec envoi email a {} : {}", to, e.getMessage());
        }
    }

    public void sendReportSubmittedToContributor(String toEmail, String authorName, String reportTitle) {
        send(toEmail,
            "Votre signalement a bien ete recu - AccessMap",
            "Bonjour " + authorName + ",\n\nMerci pour votre contribution !\n\nVotre signalement \"" + reportTitle + "\" a bien ete recu et est en cours d'examen.\n\nVous recevrez un email des qu'il aura ete traite.\n\nL'equipe AccessMap\nhttps://app-accessmap.netlify.app");
    }

    public void sendNewReportToAdmin(String authorName, String reportTitle, String category, String reportId) {
        send(adminEmail,
            "Nouveau signalement a moderer - AccessMap",
            "Bonjour,\n\nUn nouveau signalement est en attente.\n\nContributeur : " + authorName + "\nTitre : " + reportTitle + "\nCategorie : " + category + "\n\nhttps://app-accessmap.netlify.app/admin\n\n- AccessMap");
    }

    public void sendReportValidatedToContributor(String toEmail, String authorName, String reportTitle) {
        send(toEmail,
            "Votre signalement a ete valide - AccessMap",
            "Bonjour " + authorName + ",\n\nVotre signalement \"" + reportTitle + "\" a ete valide !\nIl est desormais visible sur la carte.\n\nhttps://app-accessmap.netlify.app/community\n\n- L'equipe AccessMap");
    }

    public void sendReportRejectedToContributor(String toEmail, String authorName, String reportTitle) {
        send(toEmail,
            "Votre signalement n'a pas ete retenu - AccessMap",
            "Bonjour " + authorName + ",\n\nVotre signalement \"" + reportTitle + "\" n'a pas pu etre valide.\n\nVous pouvez soumettre un nouveau signalement :\nhttps://app-accessmap.netlify.app/report/new\n\n- L'equipe AccessMap");
    }

    // Anciennes methodes pour compatibilite
    public void sendEmail(String to, String subject, String body) { send(to, subject, body); }
    public void sendWelcomeEmail(String to, String name) {
        send(to, "Bienvenue sur AccessMap", "Bonjour " + name + ",\n\nBienvenue sur AccessMap !\n\nhttps://app-accessmap.netlify.app");
    }
    public void sendReportValidatedEmail(String to, String category) {
        send(to, "Signalement valide - AccessMap", "Votre signalement " + category + " a ete valide.");
    }
    public void sendReportRejectedEmail(String to, String category) {
        send(to, "Signalement rejete - AccessMap", "Votre signalement " + category + " n'a pas ete retenu.");
    }
    public void sendVoteNotificationEmail(String to, String category, int up, int down) {
        send(to, "Votes sur votre signalement", "Votes : " + up + " positifs, " + down + " negatifs.");
    }
    public void sendWeeklyRecapEmail(String to, String name, int total, int validated, int up) {
        send(to, "Recap AccessMap", "Bonjour " + name + ",\nSignalements : " + total + ", Valides : " + validated);
    }
}
