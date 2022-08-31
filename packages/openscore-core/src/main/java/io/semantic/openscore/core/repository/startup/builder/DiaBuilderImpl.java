package io.semantic.openscore.core.repository.startup.builder;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

public class DiaBuilderImpl implements DiaBuilder {

    private SimpleDateFormat simpleDateFormat;

    public DiaBuilderImpl() {
        simpleDateFormat = new SimpleDateFormat(DATE_PATTERN);
    }

    public Date getMatchDate(String fecha) {

        try {
            return simpleDateFormat.parse(fecha);
        } catch (ParseException e) {
            e.printStackTrace();
            return null;
        }

    }
}
