package io.semantic.openscore.core.repository.startup.builder;

import java.util.Date;

public interface DiaBuilder {

    public static final String DATE_PATTERN = "dd-MM-yyyy'T'HH:mmZ";

    Date getMatchDate(String fecha);
}
