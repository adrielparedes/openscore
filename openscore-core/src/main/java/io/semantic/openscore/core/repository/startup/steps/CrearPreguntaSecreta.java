package io.semantic.openscore.core.repository.startup.steps;

import com.fasterxml.jackson.core.type.TypeReference;
import io.semantic.openscore.core.model.PreguntaSecreta;
import io.semantic.openscore.core.repository.PreguntaSecretaRepository;

import javax.inject.Inject;
import java.util.List;

public class CrearPreguntaSecreta extends FileBasedStartupStep<PreguntaSecretaData, PreguntaSecreta> {

    private static final String FILENAME = "data/preguntas.yml";

    public CrearPreguntaSecreta() {
        super(PreguntaSecreta.class, null, new TypeReference<List<PreguntaSecretaData>>() {
        });
    }

    @Inject
    public CrearPreguntaSecreta(PreguntaSecretaRepository preguntaSecretaService) {
        super(PreguntaSecreta.class, preguntaSecretaService, new TypeReference<List<PreguntaSecretaData>>() {
        });
    }

    @Override
    public int priority() {
        return 1000;
    }

    @Override
    public String getFileName() {
        return FILENAME;
    }

    @Override
    protected PreguntaSecreta map(PreguntaSecretaData dataObject) {
        PreguntaSecreta preguntaSecreta = new PreguntaSecreta();
        preguntaSecreta.setCodigo(dataObject.getCodigo());
        preguntaSecreta.setPregunta(dataObject.getPregunta());
        return preguntaSecreta;
    }

    @Override
    public boolean enabled() {
        return false;
    }
}
