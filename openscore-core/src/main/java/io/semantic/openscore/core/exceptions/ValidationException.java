package io.semantic.openscore.core.exceptions;

import javax.validation.ConstraintViolation;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import static java.util.stream.Collectors.joining;
import static java.util.stream.Collectors.toList;

public class ValidationException extends ApplicationException {

    private final List<String> data;

    public ValidationException(String message, List<String> data) {
        super(message);
        this.data = data;
    }

    public static String generateMessage(Set<ConstraintViolation<Object>> errors) {
        return ValidationException.generateErrorsList(errors).stream().collect(joining("\n"));
    }

    private static String processErrorMessage(ConstraintViolation<Object> objectConstraintViolation) {
        return objectConstraintViolation.getPropertyPath().toString() + ": "
                + objectConstraintViolation.getMessage();
    }

    public static List<String> generateErrorsList(Set<ConstraintViolation<Object>> errors) {
        return errors.stream()
                .map(objectConstraintViolation -> processErrorMessage(objectConstraintViolation))
                .collect(toList());
    }

    public List<String> getData() {
        return data;
    }
}
