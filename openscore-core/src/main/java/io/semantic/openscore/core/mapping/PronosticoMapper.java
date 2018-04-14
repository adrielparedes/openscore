package io.semantic.openscore.core.mapping;

import io.semantic.openscore.core.api.pronosticos.CrearPronosticoDTO;
import io.semantic.openscore.core.api.pronosticos.PronosticoDTO;
import io.semantic.openscore.core.model.Pronostico;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Mappings;

import java.util.List;

@Mapper(componentModel = "cdi")
public interface PronosticoMapper {


    @Mappings({
            @Mapping(source = "partido.id", target = "partido.id")
    })
    PronosticoDTO asApi(Pronostico pronostico);

    List<PronosticoDTO> asApi(List<Pronostico> pronosticos);

    @Mappings({
            @Mapping(source = "partido", target = "partido", ignore = true)
    })
    Pronostico asPronostico(CrearPronosticoDTO crearPronostico);

    @Mappings({
            @Mapping(source = "partido", target = "partido", ignore = true)
    })
    void updatePronostico(CrearPronosticoDTO crearPronostico, @MappingTarget Pronostico pronostico);
}
