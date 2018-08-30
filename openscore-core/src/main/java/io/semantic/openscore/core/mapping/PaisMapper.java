package io.semantic.openscore.core.mapping;

import io.semantic.openscore.core.api.paises.PaisDTO;
import io.semantic.openscore.core.model.Pais;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "cdi")
public interface PaisMapper {

    Pais asPais(PaisDTO paisDTO);

    PaisDTO asApi(Pais pais);

    List<PaisDTO> asApi(List<Pais> pais);

}
