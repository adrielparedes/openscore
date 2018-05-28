package io.semantic.openscore.core.services.impl;

import io.semantic.openscore.core.api.ApiResponse;
import io.semantic.openscore.core.model.PreguntaSecreta;
import io.semantic.openscore.core.repository.PreguntaSecretaRepository;
import io.semantic.openscore.core.services.api.PreguntaSecretaService;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import java.util.List;

import static io.semantic.openscore.core.services.RestUtil.ok;

@RequestScoped
public class PreguntaSecretaServiceImpl implements PreguntaSecretaService {

    private PreguntaSecretaRepository preguntaSecretaRepository;

    public PreguntaSecretaServiceImpl() {
    }

    @Inject
    public PreguntaSecretaServiceImpl(PreguntaSecretaRepository preguntaSecretaRepository) {
        this.preguntaSecretaRepository = preguntaSecretaRepository;
    }

    @Override

    public ApiResponse<PreguntaSecreta> get(long id) {
        return ok(this.preguntaSecretaRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("")));
    }

    @Override
    public ApiResponse<List<PreguntaSecreta>> getAll(int page, int pageSize, String filter) {
        return ok(this.preguntaSecretaRepository.findAll());
    }
}
