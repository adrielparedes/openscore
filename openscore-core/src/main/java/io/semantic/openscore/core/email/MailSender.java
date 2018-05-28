package io.semantic.openscore.core.email;

import java.util.Map;

public interface MailSender {

    void send(String to, String subject, String template, Map<String, Object> params);
}
