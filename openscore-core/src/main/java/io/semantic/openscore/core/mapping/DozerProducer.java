package io.semantic.openscore.core.mapping;

import javax.enterprise.inject.Produces;

import io.semantic.openscore.core.annotations.Mapper;
import org.dozer.DozerBeanMapper;

public class DozerProducer {

    @Produces
    @Mapper
    public DozerBeanMapper produceDozer() {
        return new DozerBeanMapper();
    }
}
