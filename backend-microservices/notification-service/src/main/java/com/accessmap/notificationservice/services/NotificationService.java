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
            log.info("Email envoyé à {} : {}", to, subject);
        } catch (Exception e) {
            log.error("Échec envoi email à {} : {}", to, e.getMessage());
        }
    }

    public void sendReportSubmittedToContributor(String toEmail, String authorName, String reportTitle) {
        send(toEmail,
            "Votre signalement a bien été reçu — AccessMap",
            "Bonjour " + authorName + ",\n\n" +
            "Merci pour votre contribution !\n\n" +
            "Votre signalement « " + reportTitle + " » a bien été reçu\n" +
            "et est en cours d'examen par notre équipe de modération.\n\n" +
            "Vous recevrez un email dès qu'il aura été traité.\n\n" +
            "À bientôt sur AccessMap,\n" +
            "L'équipe AccessMap\n" +
            "https://app-accessmap.netlify.app");
    }

    public void sendNewReportToAdmin(String authorName, String reportTitle, String category, String reportId) {
        send(adminEmail,
            "Nouveau signalement à modérer — AccessMap",
            "Bonjour,\n\n" +
            "Un nouveau signalement est en attente de modération.\n\n" +
            "-----------------------------------\n" +
            "Contributeur : " + authorName + "\n" +
            "Titre        : " + reportTitle + "\n" +
            "Catégorie    : " + category + "\n" +
            "-----------------------------------\n\n" +
            "Rendez-vous sur le panneau d'administration :\n" +
            "https://app-accessmap.netlify.app/admin\n\n" +
            "— AccessMap");
    }

    public void sendReportValidatedToContributor(String toEmail, String authorName, String reportTitle) {
        send(toEmail,
            "Votre signalement a été validé — AccessMap",
            "Bonjour " + authorName + ",\n\n" +
            "Bonne nouvelle !\n\n" +
            "Votre signalement « " + reportTitle + " » a été validé par notre équipe.\n" +
            "Il est désormais visible sur la carte et dans l'espace communautaire.\n\n" +
            "Merci de contribuer à rendre la ville plus accessible pour tous.\n\n" +
            "Voir la communauté :\n" +
            "https://app-accessmap.netlify.app/community\n\n" +
            "— L'équipe AccessMap");
    }

    public void sendReportRejectedToContributor(String toEmail, String authorName, String reportTitle) {
        send(toEmail,
            "Votre signalement n'a pas été retenu — AccessMap",
            "Bonjour " + authorName + ",\n\n" +
            "Après examen, votre signalement « " + reportTitle + " » n'a pas pu être validé.\n\n" +
            "Cela peut être dû à un doublon, un manque d'informations,\n" +
            "ou un contenu ne correspondant pas aux critères d'AccessMap.\n\n" +
            "Vous pouvez soumettre un nouveau signalement à tout moment :\n" +
            "https://app-accessmap.netlify.app/report/new\n\n" +
            "Merci pour votre compréhension.\n\n" +
            "— L'équipe AccessMap");
    }

    public void sendEmail(String to, String subject, String body) { send(to, subject, body); }

    public void sendWelcomeEmail(String to, String name) {
        send(to,
            "Bienvenue sur AccessMap !",
            "Bonjour " + name + ",\n\n" +
            "Bienvenue sur AccessMap !\n\n" +
            "Ensemble, améliorons l'accessibilité urbaine.\n\n" +
            "— L'équipe AccessMap\n" +
            "https://app-accessmap.netlify.app");
    }

    public void sendReportValidatedEmail(String to, String category) {
        send(to,
            "Votre signalement a été validé — AccessMap",
            "Votre signalement « " + category + " » a été validé par notre équipe.\n\n" +
            "— L'équipe AccessMap");
    }

    public void sendReportRejectedEmail(String to, String category) {
        send(to,
            "Votre signalement n'a pas été retenu — AccessMap",
            "Votre signalement « " + category + " » n'a pas pu être validé.\n\n" +
            "— L'équipe AccessMap");
    }

    public void sendVoteNotificationEmail(String to, String category, int up, int down) {
        send(to,
            "Votre signalement a reçu des votes — AccessMap",
            "Votre signalement « " + category + " » a reçu :\n" +
            "- " + up + " vote(s) positif(s)\n" +
            "- " + down + " vote(s) négatif(s)\n\n" +
            "— L'équipe AccessMap");
    }

    public void sendWeeklyRecapEmail(String to, String name, int total, int validated, int up) {
        send(to,
            "Votre récapitulatif hebdomadaire — AccessMap",
            "Bonjour " + name + ",\n\n" +
            "Voici votre résumé :\n\n" +
            "Signalements créés   : " + total + "\n" +
            "Signalements validés : " + validated + "\n" +
            "Votes positifs reçus : " + up + "\n\n" +
            "Merci pour vos contributions !\n\n" +
            "— L'équipe AccessMap\n" +
            "https://app-accessmap.netlify.app");
    }
}
