package io.semantic.openscore.core.services.impl;

import io.semantic.openscore.core.api.ApiResponse;
import io.semantic.openscore.core.api.equipos.CrearEquipoDTO;
import io.semantic.openscore.core.api.equipos.EquipoDTO;
import io.semantic.openscore.core.mapping.EquipoMapper;
import io.semantic.openscore.core.model.Equipo;
import io.semantic.openscore.core.model.Pais;
import io.semantic.openscore.core.repository.EquiposRepository;
import io.semantic.openscore.core.repository.Page;
import io.semantic.openscore.core.repository.PaisRepository;
import io.semantic.openscore.core.services.api.EquiposService;
import io.semantic.openscore.core.validation.ApplicationValidator;

import javax.inject.Inject;
import javax.ws.rs.Path;
import javax.ws.rs.core.UriInfo;
import java.text.MessageFormat;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static io.semantic.openscore.core.services.RestUtil.ok;

@Path("equipos")
public class EquiposServiceImpl implements EquiposService {


    private PaisRepository paisRepository;
    private EquiposRepository equiposRepository;
    private ApplicationValidator validator;
    private EquipoMapper mapper;

    public EquiposServiceImpl() {
    }

    @Inject
    public EquiposServiceImpl(EquiposRepository equiposRepository,
                              PaisRepository paisRepository,
                              ApplicationValidator validator,
                              EquipoMapper mapper) {
        this.equiposRepository = equiposRepository;
        this.paisRepository = paisRepository;
        this.validator = validator;
        this.mapper = mapper;
    }

    @Override
    public ApiResponse<List<EquipoDTO>> getAll(int page, int pageSize, UriInfo uriInfo) {
        List<EquipoDTO> equipos = this.equiposRepository
                .findAll(new Page(page, pageSize))
                .stream()
                .map(equipo -> map(equipo))
                .collect(Collectors.toList());
        return ok(equipos);
    }

    @Override
    public ApiResponse<EquipoDTO> get(long id) {
        Equipo equipo = this.equiposRepository
                .findById(id).orElseThrow(() ->
                        new RuntimeException(MessageFormat.format("El equipo con el ID: {0} no fue encontrado", id)));
        return ok(map(equipo));
    }

    @Override
    public ApiResponse<Long> delete(long id) {
        this.equiposRepository.deleteById(id);
        return ok(id);
    }

    @Override
    public ApiResponse<EquipoDTO> add(CrearEquipoDTO entity) {
        validator.validate(entity);
        Pais pais = this.paisRepository.findByCodigo(entity.getCodigoPais());
        Equipo equipo = this.mapper.asEquipo(entity);
        this.equiposRepository.save(equipo);
        return ok(map(equipo));
    }

    @Override
    public ApiResponse<EquipoDTO> update(long id, CrearEquipoDTO entity) {
        validator.validate(entity);
        Optional<Equipo> equipoOptional = this.equiposRepository.findById(id);
        if (equipoOptional.isPresent()) {
            Equipo equipo = equipoOptional.get();
            equipo.setCodigo(entity.getCodigo());
            equipo.setLogo(entity.getLogo());
            equipo.setNombre(entity.getNombre());
            this.equiposRepository.save(equipo);
            return ok(map(equipo));
        } else {
            throw new RuntimeException(MessageFormat.format("No se pudo actualizar el equipo con ID {0}", id));
        }

    }

    private EquipoDTO map(Equipo equipo) {
        return this.mapper.asApi(equipo);
    }
}
