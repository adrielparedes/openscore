package io.semantic.openscore.core.exceptions;

import javax.validation.ConstraintViolation;
import java.util.Set;
import java.util.stream.Collectors;

public class ValidationException extends ApplicationException {

    public ValidationException(String message) {
        super(message);
    }

    public static String generateMessage(Set<ConstraintViolation<Object>> errors) {
        return errors.stream()
                .map(objectConstraintViolation -> processErrorMessage(objectConstraintViolation))
                .collect(Collectors.joining("\n"));
    }

    private static String processErrorMessage(ConstraintViolation<Object> objectConstraintViolation) {
        return objectConstraintViolation.getPropertyPath().toString() + ": "
                + objectConstraintViolation.getMessage();
    }
}
