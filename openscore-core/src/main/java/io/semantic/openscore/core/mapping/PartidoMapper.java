package io.semantic.openscore.core.mapping;

import java.util.List;

import org.mapstruct.Mapper;

import io.semantic.openscore.core.api.partidos.PartidoDTO;
import io.semantic.openscore.core.api.partidos.ResultadoDTO;
import io.semantic.openscore.core.model.Partido;
import io.semantic.openscore.core.model.Resultado;

@Mapper(componentModel = "cdi", uses = DateMapper.class)
public interface PartidoMapper {

    PartidoDTO asApi(Partido partido);

    List<PartidoDTO> asApi(List<Partido> partido);

    Resultado asResultado(ResultadoDTO resultado);
}
