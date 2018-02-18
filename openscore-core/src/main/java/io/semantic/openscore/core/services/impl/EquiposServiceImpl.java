package io.semantic.openscore.core.services.impl;

import io.semantic.openscore.core.annotations.Mapper;
import io.semantic.openscore.core.api.ApiResponse;
import io.semantic.openscore.core.api.equipos.CrearEquipoApi;
import io.semantic.openscore.core.api.equipos.EquipoApi;
import io.semantic.openscore.core.api.equipos.UpdateEquipoApi;
import io.semantic.openscore.core.repository.EquiposRepository;
import io.semantic.openscore.core.services.api.EquiposService;
import org.dozer.DozerBeanMapper;

import javax.inject.Inject;
import javax.ws.rs.Path;
import java.util.List;

@Path("equipos")
public class EquiposServiceImpl implements EquiposService {


    private EquiposRepository equiposRepository;
    private DozerBeanMapper mapper;

    public EquiposServiceImpl() {
    }

    @Inject
    public EquiposServiceImpl(EquiposRepository equiposRepository, @Mapper DozerBeanMapper mapper) {
        this.equiposRepository = equiposRepository;
        this.mapper = mapper;
    }

    @Override
    public ApiResponse<List<EquipoApi>> getAll(int page, int pageSize) {
        return null;
    }

    @Override
    public ApiResponse<EquipoApi> get(long id) {
        return null;
    }

    @Override
    public ApiResponse<Long> delete(long id) {
        return null;
    }

    @Override
    public ApiResponse<EquipoApi> add(CrearEquipoApi entity) {
        return null;
    }

    @Override
    public ApiResponse<EquipoApi> update(long id, UpdateEquipoApi entity) {
        return null;
    }
}
