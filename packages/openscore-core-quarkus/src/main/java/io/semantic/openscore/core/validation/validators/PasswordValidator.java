package io.semantic.openscore.core.validation.validators;

import io.semantic.openscore.core.validation.annotations.Password;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class PasswordValidator implements ConstraintValidator<Password, String> {


    private static final String PASSWORD_PATTERN = "[\\w\\S]{6,30}";
    private Pattern pattern;

    @Override
    public void initialize(Password password) {
        pattern = Pattern.compile(PASSWORD_PATTERN);
    }

    @Override
    public boolean isValid(String passw, ConstraintValidatorContext constraintValidatorContext) {


        Matcher matcher = pattern.matcher(passw);
        boolean isValid = matcher.matches();

        if (!isValid) {
            constraintValidatorContext.disableDefaultConstraintViolation();
            constraintValidatorContext.buildConstraintViolationWithTemplate(
                    "{io.semantic.openscore.core.validation.Password.message}"
            ).addConstraintViolation();
        }

        return isValid;
    }
}
