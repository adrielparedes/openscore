package io.semantic.openscore.core.services.impl;

import java.text.MessageFormat;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.ws.rs.QueryParam;

import io.semantic.openscore.core.api.ApiResponse;
import io.semantic.openscore.core.api.competiciones.CompeticionApi;
import io.semantic.openscore.core.api.competiciones.CrearCompeticionApi;
import io.semantic.openscore.core.exceptions.EntityNotFoundException;
import io.semantic.openscore.core.model.Competicion;
import io.semantic.openscore.core.repository.CompeticionesRepository;
import io.semantic.openscore.core.repository.Page;
import io.semantic.openscore.core.services.CompeticionesService;
import org.dozer.DozerBeanMapper;

import static io.semantic.openscore.core.services.RestUtil.ok;

@RequestScoped
public class CompeticionesServiceImpl implements CompeticionesService {

    private DozerBeanMapper dozerMapper;
    private CompeticionesRepository competicionesRepository;

    public CompeticionesServiceImpl() {
    }

    @Inject
    public CompeticionesServiceImpl(CompeticionesRepository competicionesRepository) {
        this.competicionesRepository = competicionesRepository;
        this.dozerMapper = new DozerBeanMapper();
    }

    @Override
    public ApiResponse<List<CompeticionApi>> getCompeticiones(@QueryParam("page") int page,
                                                              @QueryParam("pageSize") int pageSize) {
        return ok(this.competicionesRepository.findAll(new Page(page,
                                                                pageSize))
                          .stream()
                          .map(competicion -> dozerMapper.map(competicion,
                                                              CompeticionApi.class))
                          .collect(Collectors.toList()));
    }

    @Override
    public ApiResponse<CompeticionApi> getCompeticion(Long id) {
        Optional<Competicion> found = this.competicionesRepository.findById(id);
        return ok(found.map(competicion -> dozerMapper.map(competicion,
                                                           CompeticionApi.class))
                          .orElseThrow(() -> new EntityNotFoundException(MessageFormat.format("La competicion con el id <{0}> no fue encontrada",
                                                                                              id))));
    }

    @Override
    public ApiResponse<CompeticionApi> addCompeticion(CrearCompeticionApi crearCompeticionApi) {

        Competicion competicion = dozerMapper.map(crearCompeticionApi,
                                                  Competicion.class);
        this.competicionesRepository.save(competicion);
        return ok(dozerMapper.map(competicion,
                                  CompeticionApi.class));
    }
}
