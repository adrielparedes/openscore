package io.semantic.openscore.core.services.impl;

import io.semantic.openscore.core.annotations.Mapper;
import io.semantic.openscore.core.api.ApiResponse;
import io.semantic.openscore.core.api.competiciones.CrearDefinicionCompeticionApi;
import io.semantic.openscore.core.api.competiciones.DefinicionCompeticionApi;
import io.semantic.openscore.core.api.competiciones.UpdateDefinicionCompeticionApi;
import io.semantic.openscore.core.exceptions.EntityNotFoundException;
import io.semantic.openscore.core.model.DefinicionCompeticion;
import io.semantic.openscore.core.repository.CompeticionesRepository;
import io.semantic.openscore.core.repository.Page;
import io.semantic.openscore.core.services.api.DefinicionCompeticionesService;
import org.dozer.DozerBeanMapper;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.ws.rs.QueryParam;
import java.text.MessageFormat;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static io.semantic.openscore.core.services.RestUtil.ok;

@RequestScoped
public class DefinicionCompeticionServiceImpl implements DefinicionCompeticionesService {

    private DozerBeanMapper dozerMapper;
    private CompeticionesRepository competicionesRepository;

    public DefinicionCompeticionServiceImpl() {
    }

    @Inject
    public DefinicionCompeticionServiceImpl(CompeticionesRepository competicionesRepository,
                                            @Mapper DozerBeanMapper dozerMapper) {
        this.competicionesRepository = competicionesRepository;
        this.dozerMapper = dozerMapper;
    }

    @Override
    public ApiResponse<List<DefinicionCompeticionApi>> getAll(@QueryParam("page") int page,
                                                              @QueryParam("pageSize") int pageSize) {
        return ok(this.competicionesRepository.findAll(new Page(page,
                pageSize)).stream().map(competicion -> map(competicion))
                .collect(Collectors.toList()));
    }

    @Override
    public ApiResponse<DefinicionCompeticionApi> get(long id) {
        Optional<DefinicionCompeticion> found = this.competicionesRepository.findByIdWithDeleted(id);
        return ok(map(found.orElseThrow(() -> new EntityNotFoundException(MessageFormat.format("La competicion con el id <{0}> no fue encontrada",
                id)))));
    }

    @Override
    public ApiResponse<Long> delete(long id) {
        this.competicionesRepository.deleteById(id);
        return ok(id);
    }

    @Override
    public ApiResponse<DefinicionCompeticionApi> add(CrearDefinicionCompeticionApi crearCrearDefinicionCompeticionApi) {

        DefinicionCompeticion definicionCompeticion = dozerMapper.map(crearCrearDefinicionCompeticionApi,
                DefinicionCompeticion.class);
        this.competicionesRepository.save(definicionCompeticion);
        return ok(map(definicionCompeticion));
    }

    @Override
    public ApiResponse<DefinicionCompeticionApi> update(long id, UpdateDefinicionCompeticionApi competicionApi) {

        Optional<DefinicionCompeticion> definicionCompeticion = this.competicionesRepository.findByIdWithDeleted(id);

        DefinicionCompeticion competicion = definicionCompeticion.orElseThrow(() -> new RuntimeException("Error al intentar hacer update de la competicion: " + id));

        competicion.setNombre(competicionApi.getNombre());
        competicion.setLogo(competicionApi.getLogo());
        competicion.setDescripcion(competicionApi.getDescripcion());
        this.competicionesRepository.save(competicion);

        return ok(map(competicion));
    }

    private DefinicionCompeticionApi map(DefinicionCompeticion competicion) {
        return this.dozerMapper.map(competicion, DefinicionCompeticionApi.class);
    }
}
