package io.semantic.openscore.core.mapping;

import java.sql.Date;

import org.mapstruct.Mapper;

@Mapper(componentModel = "cdi")
public class DateMapper {

    public Long asNumber(Date date) {
        return date.getTime();
    }

    public Date asDate(Long date) {
        return new Date(date);
    }
}