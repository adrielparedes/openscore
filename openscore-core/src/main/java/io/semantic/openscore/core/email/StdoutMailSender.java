package io.semantic.openscore.core.email;

import io.semantic.openscore.core.template.TemplateEngine;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.inject.Alternative;
import javax.inject.Inject;
import java.util.Map;

@Alternative
@ApplicationScoped
public class StdoutMailSender implements MailSender {

    private Logger logger = LoggerFactory.getLogger(StdoutMailSender.class);
    private TemplateEngine templateEngine;

    public StdoutMailSender() {
    }

    @Inject
    public StdoutMailSender(TemplateEngine templateEngine) {

        this.templateEngine = templateEngine;
    }

    @Override
    public void send(String to, String subject, String template, Map<String, Object> params) {
        String email = this.templateEngine.evaluate(template, params);

        logger.info(email);
    }
}
