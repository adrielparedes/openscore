package io.semantic.openscore.core.repository.startup.steps;

import io.semantic.openscore.core.model.PreguntaSecreta;
import io.semantic.openscore.core.repository.PreguntaSecretaRepository;
import io.semantic.openscore.core.repository.startup.StartupStep;

import javax.inject.Inject;

public class CrearPreguntasSecretas implements StartupStep {


    private PreguntaSecretaRepository preguntaSecretaRepository;

    public CrearPreguntasSecretas() {
    }

    @Inject
    public CrearPreguntasSecretas(PreguntaSecretaRepository preguntaSecretaRepository) {
        this.preguntaSecretaRepository = preguntaSecretaRepository;
    }

    @Override
    public void run() {

        this.createIfNotExist(this.buildPregunta(PreguntaSecreta.PRODUCTO_REDHAT_FAVORITO, "What is your favorite Red Hat Product?"));
        this.createIfNotExist(this.buildPregunta(PreguntaSecreta.MOMBRE_MASCOTA, "What is your pet's name?"));
        this.createIfNotExist(this.buildPregunta(PreguntaSecreta.SEGUNDO_NOMBRE_PADRE, "What is you father's second name?"));
        this.createIfNotExist(this.buildPregunta(PreguntaSecreta.SEGUNDO_NOMBRE_MADRE, "What is you mother's second name?"));
        this.createIfNotExist(this.buildPregunta(PreguntaSecreta.EQUIPO_FAVORITO, "Which is your favorite team?"));
        this.createIfNotExist(this.buildPregunta(PreguntaSecreta.LENGUAJE_PROGRAMACION_FAVORITO, "What is your favorite programming language?"));
        this.createIfNotExist(this.buildPregunta(PreguntaSecreta.PELICULA_FAVORITA, "What is your favorite movie?"));
        this.createIfNotExist(this.buildPregunta(PreguntaSecreta.BANDA_FAVORITA, "Which is your favorite band?"));

    }

    private PreguntaSecreta buildPregunta(String codigo, String pregunta) {
        PreguntaSecreta preguntaSecreta = new PreguntaSecreta();
        preguntaSecreta.setCodigo(codigo);
        preguntaSecreta.setPregunta(pregunta);
        return preguntaSecreta;
    }

    public void createIfNotExist(PreguntaSecreta preguntaSecreta) {
        if (!this.preguntaSecretaRepository.exist(preguntaSecreta.getCodigo())) {
            this.preguntaSecretaRepository.save(preguntaSecreta);
        }
    }

    @Override
    public int priority() {
        return 0;
    }
}
