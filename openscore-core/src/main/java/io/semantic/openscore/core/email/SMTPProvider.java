package io.semantic.openscore.core.email;

import javax.annotation.Resource;
import javax.enterprise.context.ApplicationScoped;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.util.Date;

@ApplicationScoped
public class SMTPProvider implements MailProvider {

    @Resource(lookup = "EMailME")
    private Session mailSession;

    @Override
    public void send(String to, String subject, String email) {
        MimeMessage message = new MimeMessage(mailSession);
        try {
            message.setFrom(new InternetAddress(mailSession.getProperty("mail.from")));
            InternetAddress[] address = {new InternetAddress(to)};
            message.setRecipients(Message.RecipientType.TO, address);
            message.setSubject(subject);
            message.setSentDate(new Date());
            message.setText(email);
            Transport.send(message);
        } catch (MessagingException ex) {
            ex.printStackTrace();
        }
    }
}
