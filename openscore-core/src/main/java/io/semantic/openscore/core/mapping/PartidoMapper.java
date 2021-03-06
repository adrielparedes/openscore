package io.semantic.openscore.core.mapping;

import io.semantic.openscore.core.api.partidos.CrearOUpdatePartidoDTO;
import io.semantic.openscore.core.api.partidos.PartidoDTO;
import io.semantic.openscore.core.api.partidos.ResultadoDTO;
import io.semantic.openscore.core.model.Partido;
import io.semantic.openscore.core.model.Resultado;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "cdi")
public interface PartidoMapper {

    PartidoDTO asApi(Partido partido);

    List<PartidoDTO> asApi(List<Partido> partido);

    Resultado asResultado(ResultadoDTO resultado);
}
