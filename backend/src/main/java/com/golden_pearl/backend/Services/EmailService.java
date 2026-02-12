package com.golden_pearl.backend.Services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import com.golden_pearl.backend.Models.LeaderBoard;
import com.golden_pearl.backend.Models.Tournament;
import com.golden_pearl.backend.Models.User;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender emailSender;

    // @Value("${spring.mail.username:noreply@goldenpearl.com}")
    @Value("${spring.mail.username}")
    private String fromEmail;

    @Autowired
    public EmailService(JavaMailSender emailSender) {
        this.emailSender = emailSender;
    }

    @Async
    public void sendJoinEmail(String to, User u, Tournament t,LeaderBoard l) {
        
        String subject = "Registration Confirmed: " + t.getTournamentName();
        String body = String.format(
            "Hello %s,\n\n" +
            "Congratulations! Your registration for \"%s\" has been successfully processed.\n\n" +
            "--- TOURNAMENT DETAILS ---\n" +
            "Tournament: %s\n" +
            "Plateform: %s\n" +
            "Given GameId: %s\n  "+
            "Transaction ID: %s\n" +
            "Prize Pool: %s\n" +
            "Status: Submit for Admin Approval\n" +
            "Date: %s\n" +
            "--------------------------\n\n" +
            "What's next?\n" +
            "1. Check the tournament bracket on our website.\n" +
            "2. Ensure your equipment/software is updated.\n" +
            "3. Join our Discord server for live updates.\n\n" +
            "If you have any questions or need to withdraw, please contact support or reply to this email.\n\n" +
            "Best regards,\n" +
            "The Tournament Administration Team",
            u.getUsername(), t.getTournamentName(), t.getTournamentName(),t.getPlatform(),l.getGameId(), l.getTransactionId(), t.getPrizePool(), t.getDateTime()
        );

        sendEmailSafely(to, subject, body);
    }

    @Async
    public void sendApprovalEmail(String to, User u, Tournament t) {
        String subject = "Application Approved: " + t.getTournamentName();
        String body = String.format(
            "Dear %s,\n\n" +
            "We are pleased to inform you that your application for the \"%s\" has been APPROVED.\n"+
            "You Transaction Id is verified successfully...\n" +
            "--- PARTICIPATION SUMMARY ---\n" +
            "Tournament: %s\n" +
            "Admission Status: Official Participant\n" +
            "Check-in Time: 5 minutes before start\n" +
            "------------------------------\n\n" +
            "IMPORTANT NEXT STEPS:\n" +
            "• Review the official rules and code of conduct.\n" +
            "• Ensure your profile information is up to date.\n" +
            "• Watch your inbox for the final bracket and schedule announcement.\n\n" +
            "We are excited to have you with us. If you can no longer attend, please update your status in the dashboard as soon as possible to allow waitlisted players to join.\n\n" +
            "Good luck and have fun!\n\n" +
            "Best regards,\n" +
            "Tournament Operations Team",
            u.getUsername(), t.getTournamentName(), t.getTournamentName()
        );

        sendEmailSafely(to, subject, body);
    }

    @Async
    public void sendForgetPasswordEmailOTP(String to, String username,int otp) {
        String subject = "Your Password Reset Code";
        String body = String.format(
            "Dear %s,\n\n" +
            "We have received a request to reset the password for your account.\n\n" +
            "Please use the following One-Time Password (OTP) to proceed. This code is valid for 10 minutes.\n\n" +
            "Your OTP: %d\n\n" +
            "If you did not initiate this request, please disregard this email. For your security, never share this code with anyone.\n\n" +
            "Sincerely,\n" +
            "The Golden Pearl Security Team",
            username,
            otp
        );

        sendEmailSafely(to, subject, body);
    }

    @Async
    public void sendPasswordResetEmail(String to, String username) {
        String subject = "Security Notification: Password Changed Successfully";
        String body = String.format(
            "Dear comrade🥷, %s,\n\n" +
            "This is an automated notification to confirm that the password for your account has been successfully changed.\n\n" +
            "If you initiated this change, no further action is required.\n\n" +
            "However, if you did not perform this action, please contact our support team immediately to secure your account.\n\n" +
            "Thank you,\n" +
            "Golden Pearl Security Team",
           username
        );

        sendEmailSafely(to, subject, body);
    }
    
    private void sendEmailSafely(String to, String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            emailSender.send(message);
            logger.info("Email sent successfully to: {}", to);
        } catch (MailException e) {
            logger.error("Failed to send email to: {}. Error: {}", to, e.getMessage());
        }
    }
}