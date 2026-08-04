package io.semantic.openscore.core.email;

import io.semantic.openscore.core.template.TemplateEngine;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

@ApplicationScoped
public class MailServer {

    private MailProvider provider;
    private TemplateEngine templateEngine;


    public MailServer() {
    }

    @Inject
    public MailServer(MailProvider provider,
                      TemplateEngine templateEngine) {

        this.provider = provider;
        this.templateEngine = templateEngine;
    }

    public void send(MailTemplate template) {
        String email = this.templateEngine.evaluate(template.getTemplateName(), template.getParams());
        this.provider.send(template.getTo(), template.getSubject(), email);
    }
}
