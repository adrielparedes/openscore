package io.semantic.openscore.core.template;

import io.semantic.openscore.core.exceptions.ApplicationException;

public class TemplateEngineException extends ApplicationException {
    public TemplateEngineException(String message, Throwable throwable) {
        super(message, throwable);
    }
}
