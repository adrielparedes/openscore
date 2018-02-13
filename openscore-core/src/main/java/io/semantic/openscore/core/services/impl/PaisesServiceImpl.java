package io.semantic.openscore.core.services.impl;

import io.semantic.openscore.core.annotations.Mapper;
import io.semantic.openscore.core.api.ApiResponse;
import io.semantic.openscore.core.api.paises.PaisApi;
import io.semantic.openscore.core.model.Pais;
import io.semantic.openscore.core.repository.Page;
import io.semantic.openscore.core.repository.PaisRepository;
import io.semantic.openscore.core.services.api.PaisesService;
import org.dozer.DozerBeanMapper;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import java.util.List;
import java.util.stream.Collectors;

@RequestScoped
public class PaisesServiceImpl implements PaisesService {


    private PaisRepository repository;
    private DozerBeanMapper mapper;

    public PaisesServiceImpl() {

    }

    @Inject
    public PaisesServiceImpl(PaisRepository repository, @Mapper DozerBeanMapper mapper) {

        this.repository = repository;
        this.mapper = mapper;
    }


    @Override
    public ApiResponse<List<PaisApi>> getAll(int page, int pageSize, String filter) {
        List<Pais> paises = this.repository.findAll(new Page(page, pageSize));
        return new ApiResponse<>(paises.stream()
                .map(pais -> this.mapper.map(pais, PaisApi.class))
                .collect(Collectors.toList()));
    }
}
