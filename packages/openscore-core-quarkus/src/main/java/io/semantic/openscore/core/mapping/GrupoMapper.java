package io.semantic.openscore.core.mapping;

import io.semantic.openscore.core.api.grupos.GrupoDTO;
import io.semantic.openscore.core.model.Grupo;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "cdi")
public interface GrupoMapper {

    GrupoDTO asApi(Grupo partido);

    List<GrupoDTO> asApi(List<Grupo> partido);
}
