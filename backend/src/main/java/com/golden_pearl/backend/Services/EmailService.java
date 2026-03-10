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
        String body = String.format("""
            Hello %s,

            Congratulations! Your registration for "%s" has been successfully processed.

            --- TOURNAMENT DETAILS ---
            Tournament: %s
            Plateform: %s
            Given GameId: %s
            Transaction ID: %s
            Prize Pool: %s
            Status: Submit for Admin Approval
            Date: %s
            --------------------------

            What's next?
            1. Check the tournament bracket on our website.
            2. Ensure your equipment/software is updated.
            3. Join our Discord server for live updates.

            If you have any questions or need to withdraw, please contact support or reply to this email.

            Best regards,
            The Tournament Administration Team""",
            u.getUsername(), t.getTournamentName(), t.getTournamentName(),t.getPlatform(),l.getGameId(), l.getTransactionId(), t.getPrizePool(), t.getDateTime()
        );

        sendEmailSafely(to, subject, body);
    }

    @Async
    public void sendApprovalEmail(String to, User u, Tournament t) {
        String subject = "Application Approved: " + t.getTournamentName();
        String body = String.format("""
            Dear %s,

            We are pleased to inform you that your application for the "%s" has been APPROVED.
            You Transaction Id is verified successfully...
            --- PARTICIPATION SUMMARY ---
            Tournament: %s
            Admission Status: Official Participant
            Check-in Time: 5 minutes before start
            ------------------------------

            IMPORTANT NEXT STEPS:
            • Review the official rules and code of conduct.
            • Ensure your profile information is up to date.
            • Watch your inbox for the final bracket and schedule announcement.

            We are excited to have you with us. If you can no longer attend, please update your status in the dashboard as soon as possible to allow waitlisted players to join.

            Good luck and have fun!

            Best regards,
            Tournament Operations Team""",
            u.getUsername(), t.getTournamentName(), t.getTournamentName()
        );

        sendEmailSafely(to, subject, body);
    }

    @Async
    public void sendForgetPasswordEmailOTP(String to, String username,int otp) {
        String subject = "Your Password Reset Code";
        String body = String.format("""
            Dear %s,

            We have received a request to reset the password for your account.

            Please use the following One-Time Password (OTP) to proceed. This code is valid for 10 minutes.

            Your OTP: %d

            If you did not initiate this request, please disregard this email. For your security, never share this code with anyone.

            Sincerely,
            The Golden Pearl Security Team""",
            username,
            otp
        );

        sendEmailSafely(to, subject, body);
    }

    @Async
    public void sendPasswordResetEmail(String to, String username) {
        String subject = "Security Notification: Password Changed Successfully";
        String body = String.format("""
            Dear comrade🥷, %s,

            This is an automated notification to confirm that the password for your account has been successfully changed.

            If you initiated this change, no further action is required.

            However, if you did not perform this action, please contact our support team immediately to secure your account.

            Thank you,
            Golden Pearl Security Team""",
            username
        );

        sendEmailSafely(to, subject, body);
    }

    //send registeration email
    public void sendSignupSuccessEmail(String to, String username) {
        String subject = "Welcome to Golden Pearl!";
        String body = String.format("""
            Dear %s,

            Welcome to the Golden Pearl community! We're thrilled to have you on board.

            Get ready to dive into an exciting world of tournaments, challenges, and camaraderie with fellow gamers. Whether you're here to compete, connect, or just have fun, there's something for everyone.

            Don't forget to complete your profile and explore our upcoming events. If you have any questions or need assistance, our support team is here to help.

            contact on : anandorbique5a@gmail.com

            Happy gaming!

            Best regards,
            The Golden Pearl Team""",
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