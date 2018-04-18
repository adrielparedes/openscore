package io.semantic.openscore.core.repository.startup.builder;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

public class DiaBuilderImpl implements DiaBuilder {

    public Date getMatchDate(String fecha) {

        try {
            return new SimpleDateFormat().parse(fecha);
        } catch (ParseException e) {
            e.printStackTrace();
            return null;
        }

    }
}
