package io.semantic.openscore.core.repository.startup.builder;

import java.time.LocalDateTime;

public interface DiaBuilder {

    public static final String DATE_PATTERN = "dd-MM-yyyy'T'HH:mmZ";

    LocalDateTime getMatchDate(String fecha);

    LocalDateTime epochToDate(long date);
}
