package io.semantic.openscore.core.repository.startup.builder;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;

import javax.enterprise.context.ApplicationScoped;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@ApplicationScoped
public class DiaBuilderImpl implements DiaBuilder {

    private SimpleDateFormat simpleDateFormat;

    private Logger logger = LoggerFactory.getLogger(DiaBuilder.class);

    public DiaBuilderImpl() {
        simpleDateFormat = new SimpleDateFormat(DATE_PATTERN);
    }

    public LocalDateTime getMatchDate(String fecha) {

        try {
            LocalDateTime date = simpleDateFormat.parse(fecha).toInstant().atZone(ZoneId.systemDefault())
                    .toLocalDateTime();
            logger.info("{}", date);
            return date;
        } catch (ParseException e) {
            e.printStackTrace();
            return null;
        }

    }

    public LocalDateTime epochToDate(long date) {
        return Instant.ofEpochMilli(date).atOffset(ZoneOffset.UTC).toLocalDateTime();
    }
}
