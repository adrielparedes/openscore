package io.semantic.openscore.core.mapping;

import io.semantic.openscore.core.api.competiciones.CrearDefinicionCompeticionDTO;
import io.semantic.openscore.core.api.competiciones.DefinicionCompeticionDTO;
import io.semantic.openscore.core.model.DefinicionCompeticion;
import org.mapstruct.Mapper;

@Mapper(componentModel = "cdi")
public interface DefinicionCompeticionMapper {

    DefinicionCompeticion asDefinicion(CrearDefinicionCompeticionDTO crearCrearDefinicionCompeticionDTO);

    DefinicionCompeticionDTO asApi(DefinicionCompeticion definicionCompeticion);
}
