package io.semantic.openscore.core.mapping;

import io.semantic.openscore.core.annotations.Mapper;
import org.dozer.DozerBeanMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.enterprise.inject.Produces;
import java.util.Arrays;
import java.util.List;

public class DozerProducer {

    private Logger logger = LoggerFactory.getLogger(DozerProducer.class);

    private static final String MAPPINGS = "io/semantic/openscore/core/mappings/";


    @Produces
    @Mapper
    public DozerBeanMapper produceDozer() {

        List<String> mappingFiles = Arrays.asList(MAPPINGS + "UsuarioMapping.xml");
        return new DozerBeanMapper(mappingFiles);

    }

}
