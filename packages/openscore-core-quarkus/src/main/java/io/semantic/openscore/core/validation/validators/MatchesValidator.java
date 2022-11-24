package io.semantic.openscore.core.validation.validators;

import io.semantic.openscore.core.validation.annotations.Matches;
import org.apache.commons.beanutils.BeanUtils;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import java.util.Objects;

public class MatchesValidator implements ConstraintValidator<Matches, Object> {
    private String first;
    private String second;

    @Override
    public void initialize(Matches matches) {
        first = matches.first();
        second = matches.second();
    }

    @Override
    public boolean isValid(Object object, ConstraintValidatorContext constraintValidatorContext) {

        boolean isValid = false;

        try {
            String propert1 = BeanUtils.getProperty(object, first);
            String propert2 = BeanUtils.getProperty(object, second);

            isValid = Objects.equals(propert1, propert2);
        } catch (Exception e) {
            isValid = false;
        } finally {

            if (!isValid) {
                constraintValidatorContext.disableDefaultConstraintViolation();
                constraintValidatorContext.buildConstraintViolationWithTemplate(
                        "{io.semantic.openscore.core.validation.Matches.message}"
                ).addConstraintViolation();
            }


            return isValid;
        }


    }
}
