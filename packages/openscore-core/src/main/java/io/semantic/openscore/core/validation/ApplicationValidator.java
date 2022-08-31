package io.semantic.openscore.core.validation;

import io.semantic.openscore.core.exceptions.ValidationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.validation.ConstraintViolation;
import javax.validation.Validator;
import java.util.Set;

@ApplicationScoped
public class ApplicationValidator {

    private Logger logger = LoggerFactory.getLogger(ApplicationValidator.class);

    private Validator validator;

    public ApplicationValidator() {
    }

    @Inject
    public ApplicationValidator(Validator validator) {
        this.validator = validator;
    }

    public void validate(Object object) {
        try {
            Set<ConstraintViolation<Object>> errors = validator.validate(object);
            if (!errors.isEmpty()) {
                String message = ValidationException.generateMessage(errors);
                logger.error(message);
                throw new ValidationException(message, ValidationException.generateErrorsList(errors));
            }
        } catch (javax.validation.ValidationException e) {
            logger.error(e.getLocalizedMessage(), e);
            throw new ValidationException(e.getMessage(), e);
        }
    }
}
