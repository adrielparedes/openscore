package io.semantic.openscore.core.mapping;

import io.semantic.openscore.core.api.grupos.FaseDTO;
import io.semantic.openscore.core.model.Fase;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "cdi")
public interface FaseMapper {


    FaseDTO asApi(Fase fase);

    List<FaseDTO> asApi(List<Fase> fase);
}
