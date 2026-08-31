package io.semantic.openscore.core.email;

import java.util.Map;

public class MailTemplate {

    private final String to;
    private final String subject;
    private final String templateName;
    private final Map<String, Object> params;

    public MailTemplate(String to,
                        String subject,
                        String templateName,
                        Map<String, Object> params) {

        this.to = to;
        this.subject = subject;
        this.templateName = templateName;
        this.params = params;
    }

    public String getTo() {
        return to;
    }

    public String getSubject() {
        return subject;
    }

    public String getTemplateName() {
        return templateName;
    }

    public Map<String, Object> getParams() {
        return params;
    }
}
