package io.semantic.openscore.core.services.impl;

import java.util.List;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

import io.semantic.openscore.core.api.ApiResponse;
import io.semantic.openscore.core.api.paises.PaisDTO;
import io.semantic.openscore.core.mapping.PaisMapper;
import io.semantic.openscore.core.model.Pais;
import io.semantic.openscore.core.repository.Page;
import io.semantic.openscore.core.repository.PaisRepository;
import io.semantic.openscore.core.services.api.PaisesService;

@ApplicationScoped
public class PaisesServiceImpl implements PaisesService {


    private PaisMapper mapper;
    private PaisRepository repository;

    public PaisesServiceImpl() {

    }

    @Inject
    public PaisesServiceImpl(PaisRepository repository, PaisMapper mapper) {

        this.repository = repository;
        this.mapper = mapper;
    }


    @Override
    public ApiResponse<List<PaisDTO>> getAll(int page, int pageSize, String filter) {
        List<Pais> paises = this.repository.findAll(new Page(page, pageSize));
        return new ApiResponse<>(this.mapper.asApi(paises));
    }
}
