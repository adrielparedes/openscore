package io.semantic.openscore.core.validation.validators;

public class RedHatEmailValidator implements EmailValidator {

    @Override
    public boolean validate(String mail) {
        return mail.endsWith("@redhat.com");
    }
}
