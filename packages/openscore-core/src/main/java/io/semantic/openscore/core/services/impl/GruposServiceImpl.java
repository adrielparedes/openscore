package io.semantic.openscore.core.services.impl;

import io.semantic.openscore.core.api.ApiResponse;
import io.semantic.openscore.core.model.Grupo;
import io.semantic.openscore.core.repository.GrupoRepository;
import io.semantic.openscore.core.repository.Page;
import io.semantic.openscore.core.services.api.GruposService;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import java.text.MessageFormat;
import java.util.List;

import static io.semantic.openscore.core.services.RestUtil.ok;

@RequestScoped
public class GruposServiceImpl implements GruposService {


    private GrupoRepository grupoRepository;

    public GruposServiceImpl() {
    }

    @Inject
    public GruposServiceImpl(GrupoRepository grupoRepository) {
        this.grupoRepository = grupoRepository;
    }

    @Override
    public ApiResponse<List<Grupo>> getAll(int page, int pageSize, String filter) {
        return ok(this.grupoRepository.findAll(new Page(page, pageSize)));
    }

    @Override
    public ApiResponse<Grupo> get(long id) {
        return ok(this.grupoRepository
                .findById(id)
                .orElseThrow(() -> new IllegalArgumentException(
                        MessageFormat
                                .format("El Grupo con el ID {0} no fue encontrado", id))));
    }
}
