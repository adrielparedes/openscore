package io.semantic.openscore.core.mapping;

import io.semantic.openscore.core.api.partidos.CrearOUpdatePartidoDTO;
import io.semantic.openscore.core.api.partidos.PartidoDTO;
import io.semantic.openscore.core.model.Partido;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "cdi")
public interface PartidoMapper {

    PartidoDTO asApi(Partido partido);

    List<PartidoDTO> asApi(List<Partido> partido);

    Partido asPartido(CrearOUpdatePartidoDTO crearPartido);
}
