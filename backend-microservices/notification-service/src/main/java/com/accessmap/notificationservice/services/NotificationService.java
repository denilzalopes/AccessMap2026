package com.accessmap.notificationservice.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final JavaMailSender mailSender;

    @Value("${app.admin.email:azlinedlopes@gmail.com}")
    private String adminEmail;

    public void sendReportSubmittedToContributor(String toEmail, String authorName, String reportTitle) {
        String subject = "Votre signalement a bien ete recu - AccessMap";
        String body = String.format(
            "Bonjour %s,%n%n" +
            "Merci pour votre contribution !%n%n" +
            "Votre signalement \"%s\" a bien ete recu et est en cours d'examen par notre equipe de moderation.%n%n" +
            "Vous recevrez un email des qu'il aura ete traite.%n%n" +
            "A bientot sur AccessMap,%n" +
            "L'equipe AccessMap%n" +
            "https://app-accessmap.netlify.app",
            authorName, reportTitle);
        send(toEmail, subject, body);
    }

    public void sendNewReportToAdmin(String authorName, String reportTitle, String category, String reportId) {
        String subject = "Nouveau signalement a moderer - AccessMap";
        String body = String.format(
            "Bonjour,%n%n" +
            "Un nouveau signalement est en attente de moderation.%n%n" +
            "Contributeur : %s%n" +
            "Titre        : %s%n" +
            "Categorie    : %s%n%n" +
            "Rendez-vous sur le panneau d'administration :%n" +
            "https://app-accessmap.netlify.app/admin%n%n" +
            "- AccessMap",
            authorName, reportTitle, category);
        send(adminEmail, subject, body);
    }

    public void sendReportValidatedToContributor(String toEmail, String authorName, String reportTitle) {
        String subject = "Votre signalement a ete valide - AccessMap";
        String body = String.format(
            "Bonjour %s,%n%n" +
            "Bonne nouvelle !%n%n" +
            "Votre signalement \"%s\" a ete valide par notre equipe.%n" +
            "Il est desormais visible sur la carte et dans l'espace communautaire.%n%n" +
            "Merci de contribuer a rendre la ville plus accessible pour tous.%n%n" +
            "Voir la communaute : https://app-accessmap.netlify.app/community%n%n" +
            "- L'equipe AccessMap",
            authorName, reportTitle);
        send(toEmail, subject, body);
    }

    public void sendReportRejectedToContributor(String toEmail, String authorName, String reportTitle) {
        String subject = "Votre signalement n'a pas ete retenu - AccessMap";
        String body = String.format(
            "Bonjour %s,%n%n" +
            "Apres examen, votre signalement \"%s\" n'a pas pu etre valide.%n%n" +
            "Cela peut etre du a un doublon, un manque d'informations, ou un contenu ne correspondant pas aux criteres d'AccessMap.%n%n" +
            "Vous pouvez soumettre un nouveau signalement a tout moment :%n" +
            "https://app-accessmap.netlify.app/report/new%n%n" +
            "Merci pour votre comprehension.%n%n" +
            "- L'equipe AccessMap",
            authorName, reportTitle);
        send(toEmail, subject, body);
    }

    private void send(String to, String subject, String body) {
        try {
            SimpleMailMessage msg = new SimpleMailMessage();
            msg.setFrom("azlinedlopes@gmail.com");
            msg.setTo(to);
            msg.setSubject(subject);
            msg.setText(body);
            mailSender.send(msg);
            log.info("Email envoye a {} : {}", to, subject);
        } catch (Exception e) {
            log.error("Echec envoi email a {} : {}", to, e.getMessage());
        }
    }
}
