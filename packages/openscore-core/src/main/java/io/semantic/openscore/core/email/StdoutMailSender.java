package io.semantic.openscore.core.email;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.inject.Alternative;

@Alternative
@ApplicationScoped
public class StdoutMailSender implements MailProvider {

    private Logger logger = LoggerFactory.getLogger(StdoutMailSender.class);

    public StdoutMailSender() {
    }

    @Override
    public void send(String to, String subject, String email) {
        logger.info(email);
    }
}
