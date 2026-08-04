package io.semantic.openscore.core.email;

public interface MailProvider {

    void send(String to, String subject, String email);
}
