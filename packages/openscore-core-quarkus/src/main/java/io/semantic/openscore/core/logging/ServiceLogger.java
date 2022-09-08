package io.semantic.openscore.core.logging;

import java.text.MessageFormat;

import javax.enterprise.context.RequestScoped;

@RequestScoped
public class ServiceLogger {

    public String emailInvalido(String email) {
        return MessageFormat.format("El email <{0}> es inválido", email);
    }

}
