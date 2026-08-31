package io.semantic.openscore.core.mapping;

import io.semantic.openscore.core.api.equipos.CrearEquipoDTO;
import io.semantic.openscore.core.api.equipos.EquipoDTO;
import io.semantic.openscore.core.model.Equipo;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "cdi")
public interface EquipoMapper {

    Equipo asEquipo(EquipoDTO equipoDTO);

    Equipo asEquipo(CrearEquipoDTO crearEquipoDTO);

    EquipoDTO asApi(Equipo equipo);

    List<EquipoDTO> asApi(List<Equipo> equipos);

}
