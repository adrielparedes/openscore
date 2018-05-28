package io.semantic.openscore.core.email;

import io.semantic.openscore.core.template.TemplateEngine;

import javax.annotation.Resource;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.util.Date;
import java.util.Map;

@ApplicationScoped
public class SMTPMailSender implements MailSender {

    @Resource(lookup = "EMailME")
    private Session mailSession;
    private TemplateEngine templateEngine;

    public SMTPMailSender() {
    }

    @Inject
    public SMTPMailSender(TemplateEngine templateEngine) {

        this.templateEngine = templateEngine;
    }

    public void send(String to, String subject, String template, Map<String, Object> params) {
        MimeMessage message = new MimeMessage(mailSession);
        try {
            message.setFrom(new InternetAddress(mailSession.getProperty("mail.from")));
            InternetAddress[] address = {new InternetAddress(to)};
            message.setRecipients(Message.RecipientType.TO, address);
            message.setSubject(subject);
            message.setSentDate(new Date());
            message.setText(this.templateEngine.evaluate(
                    template, params
            ));
            Transport.send(message);
        } catch (MessagingException ex) {
            ex.printStackTrace();
        }
    }

}
