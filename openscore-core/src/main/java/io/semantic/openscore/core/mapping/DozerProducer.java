package io.semantic.openscore.core.mapping;

import com.google.common.io.Resources;
import io.semantic.openscore.core.annotations.Mapper;
import org.dozer.DozerBeanMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.enterprise.inject.Produces;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.stream.Collectors;

public class DozerProducer {

    private Logger logger = LoggerFactory.getLogger(DozerProducer.class);

    private static final String MAPPINGS = "io/semantic/openscore/core/mappings";

    @Produces
    @Mapper
    public DozerBeanMapper produceDozer() {


        String mappingRoot = Resources.getResource(MAPPINGS).getPath();
        logger.info(mappingRoot);
        Path mappingRootPath = Paths.get(mappingRoot);
        List<String> mappingFiles = getMappingFiles(mappingRootPath);
        return new DozerBeanMapper(mappingFiles);

    }

    private List<String> getMappingFiles(Path rootPath) {
        try {
            return Files.walk(rootPath)
                    .filter(Files::isRegularFile)
                    .map(path -> MAPPINGS + File.separator + rootPath.relativize(path).toString())
                    .collect(Collectors.toList());
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
