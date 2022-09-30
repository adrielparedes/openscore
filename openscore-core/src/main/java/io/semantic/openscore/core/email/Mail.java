package io.semantic.openscore.core.email;

import javax.enterprise.context.ApplicationScoped;

import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import io.quarkus.mailer.MailTemplate.MailTemplateInstance;
import io.quarkus.qute.CheckedTemplate;
import io.semantic.openscore.core.api.usuarios.UsuarioDTO;
import io.semantic.openscore.core.model.Usuario;

@ApplicationScoped
public class Mail {

    private final Logger logger = LoggerFactory.getLogger(Mail.class);

    @ConfigProperty(name = "openscore.mail.recover.subject")
    private String RECOVER_PASSWORD_SUBJECT;

    @ConfigProperty(name = "openscore.mail.welcome.subject")
    private String WELCOME_SUBJECT;

    @ConfigProperty(name = "openscore.mail.recover.url")
    private String RECOVER_PASSWORD_URL;

    @ConfigProperty(name = "openscore.mail.welcome.url")
    private String WELCOME_URL;

    @CheckedTemplate
    static class Templates {
        public static native MailTemplateInstance recover(String url, String token);

        public static native MailTemplateInstance welcome(String url, String name);
    }

    public void sendRecoverEmail(Usuario usuario, String token) {

        Templates.recover(RECOVER_PASSWORD_URL, token)
                .subject(RECOVER_PASSWORD_SUBJECT)
                .to(usuario.getEmail())
                .send().subscribe().with((a) -> {
                }, (err) -> {
                    logger.error(err.getMessage());
                });

    }

    public void sendWelcomeEmail(UsuarioDTO usuario) {

        Templates.welcome(WELCOME_URL, usuario.getNombre())
                .subject(WELCOME_SUBJECT)
                .to(usuario.getEmail())
                .send().subscribe().with((a) -> {
                }, (err) -> {
                    logger.error(err.getMessage());
                });

    }
}
