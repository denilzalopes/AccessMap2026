package com.accessmap.notificationservice.services;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
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
        sendEmail(to,
            "✅ Votre signalement AccessMap a été validé",
            "Bonjour,\n\n" +
            "Bonne nouvelle ! Votre signalement de type \"" + category + "\" a été validé par notre équipe.\n" +
            "Il est maintenant visible sur la carte AccessMap et aidera d'autres personnes.\n\n" +
            "Merci pour votre contribution à l'accessibilité urbaine !\n\n" +
            "L'équipe AccessMap\nhttps://app-accessmap.netlify.app"
        );
    }

    public void sendReportRejectedEmail(String to, String category) {
        sendEmail(to,
            "❌ Votre signalement AccessMap n'a pas été retenu",
            "Bonjour,\n\n" +
            "Votre signalement de type \"" + category + "\" n'a pas pu être validé.\n" +
            "Il ne correspond peut-être pas aux critères d'accessibilité de la plateforme.\n\n" +
            "N'hésitez pas à soumettre d'autres signalements !\n\n" +
            "L'équipe AccessMap\nhttps://app-accessmap.netlify.app"
        );
    }

    public void sendVoteNotificationEmail(String to, String category, int votesUp, int votesDown) {
        sendEmail(to,
            "👍 Votre signalement AccessMap a reçu des votes",
            "Bonjour,\n\n" +
            "Votre signalement de type \"" + category + "\" a reçu de nouveaux votes :\n" +
            "👍 " + votesUp + " vote(s) positif(s)\n" +
            "👎 " + votesDown + " vote(s) négatif(s)\n\n" +
            "Merci de contribuer à AccessMap !\n\n" +
            "L'équipe AccessMap\nhttps://app-accessmap.netlify.app"
        );
    }

    public void sendWeeklyRecapEmail(String to, String displayName, int totalReports, int validated, int votesUp) {
        sendEmail(to,
            "📊 Votre récapitulatif hebdomadaire AccessMap",
            "Bonjour " + displayName + ",\n\n" +
            "Voici votre résumé de la semaine :\n\n" +
            "📍 Signalements créés (total) : " + totalReports + "\n" +
            "✅ Signalements validés (total) : " + validated + "\n" +
            "👍 Votes positifs reçus (total) : " + votesUp + "\n\n" +
            "Continuez comme ça, vous aidez des milliers de personnes !\n\n" +
            "L'équipe AccessMap\nhttps://app-accessmap.netlify.app"
        );
    }
}
