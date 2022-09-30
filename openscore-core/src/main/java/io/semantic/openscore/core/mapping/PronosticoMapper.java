package io.semantic.openscore.core.mapping;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Mappings;

import io.semantic.openscore.core.api.pronosticos.CrearPronosticoDTO;
import io.semantic.openscore.core.api.pronosticos.PartidoPronosticoDTO;
import io.semantic.openscore.core.api.pronosticos.PronosticoDTO;
import io.semantic.openscore.core.model.Partido;
import io.semantic.openscore.core.model.Pronostico;

@Mapper(componentModel = "cdi", uses = DateMapper.class)
public interface PronosticoMapper {

        PronosticoDTO asApi(Pronostico pronostico);

        List<PronosticoDTO> asApi(List<Pronostico> pronosticos);

        @Mappings({
                        @Mapping(source = "partido", target = "partido", ignore = true)
        })
        Pronostico asPronostico(CrearPronosticoDTO crearPronostico);

        PartidoPronosticoDTO asApiPronostico(Partido partido);

        List<PartidoPronosticoDTO> asApiPronostico(List<Partido> partido);

        @Mappings({
                        @Mapping(source = "partido", target = "partido", ignore = true)
        })
        void updatePronostico(CrearPronosticoDTO crearPronostico, @MappingTarget Pronostico pronostico);
}
