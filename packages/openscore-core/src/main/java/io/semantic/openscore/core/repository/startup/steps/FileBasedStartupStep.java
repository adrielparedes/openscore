package io.semantic.openscore.core.repository.startup.steps;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;
import io.semantic.openscore.core.model.Storable;
import io.semantic.openscore.core.repository.Repository;
import io.semantic.openscore.core.repository.startup.StartupStep;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

public abstract class FileBasedStartupStep<D, T extends Storable> implements StartupStep {

    private final ObjectMapper objectMapper;
    private Logger logger = LoggerFactory.getLogger(FileBasedStartupStep.class);

    private Class<T> type;
    private TypeReference<List<D>> typeReference;
    private Repository<T> existService;

    public FileBasedStartupStep(Class<T> type, Repository<T> existsService, TypeReference<List<D>> typeReference) {
        this.type = type;
        this.typeReference = typeReference;
        this.objectMapper = new ObjectMapper(new YAMLFactory());
        this.existService = existsService;
    }

    public abstract String getFileName();

    @Override
    public void run() {
        List<D> entities = this.loadYaml(this.getFileName());

        entities.forEach(entity -> {
            logger.info("{}", entity.getClass().getSimpleName());
            this.saveIfNotExist(entity);
        });

    }

    private List<D> loadYaml(String fileName) {
        try {
            InputStream is = CrearPartidos.class.getClassLoader().getResourceAsStream(fileName);
            return this.objectMapper.readValue(is, typeReference);
        } catch (Exception e) {
            logger.error("Error", e);
            return new ArrayList<>();
        }
    }

    private void saveIfNotExist(D dataObject) {
        T entity = map(dataObject);
        if (!this.existService.exist(entity)) {
            logger.info("Creando {} = {}", this.type.getSimpleName(), entity);
            this.existService.save(entity);
        }
    }

    protected abstract T map(D dataObject);



}
