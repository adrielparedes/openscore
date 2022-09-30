package io.semantic.openscore.core.mapping;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

import org.mapstruct.Mapper;

@Mapper(componentModel = "cdi")
public class DateMapper {

    public Long asNumber(LocalDateTime date) {
        return date.toInstant(ZoneOffset.UTC).toEpochMilli();
    }

    public LocalDateTime asDate(Long date) {
        return Instant.ofEpochMilli(date).atZone(ZoneOffset.systemDefault()).toLocalDateTime();
    }
}