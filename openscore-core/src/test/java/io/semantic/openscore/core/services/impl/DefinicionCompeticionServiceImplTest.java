package io.semantic.openscore.core.services.impl;

import io.semantic.openscore.core.api.competiciones.CrearDefinicionCompeticionDTO;
import io.semantic.openscore.core.mapping.DefinicionCompeticionMapper;
import io.semantic.openscore.core.mapping.PartidoMapper;
import io.semantic.openscore.core.model.DefinicionCompeticion;
import io.semantic.openscore.core.repository.CompeticionesRepository;
import io.semantic.openscore.core.repository.EquiposRepository;
import io.semantic.openscore.core.repository.PartidoRepository;
import io.semantic.openscore.core.services.api.DefinicionCompeticionesService;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mapstruct.factory.Mappers;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;

import java.util.Optional;

import static org.junit.Assert.assertEquals;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class DefinicionCompeticionServiceImplTest {


    @Mock
    private CompeticionesRepository competicionesRepository;

    @Mock
    private PartidoRepository partidoRepository;

    @Mock
    private EquiposRepository equiposRepository;

    @Captor
    private ArgumentCaptor<DefinicionCompeticion> definicionCompeticionArgumentCaptor;

    private DefinicionCompeticionesService service;

    @Before
    public void setUp() {
        service = new DefinicionCompeticionServiceImpl(competicionesRepository,
                partidoRepository,
                equiposRepository,
                Mappers.getMapper(PartidoMapper.class),
                Mappers.getMapper(DefinicionCompeticionMapper.class));
        DefinicionCompeticion competicion = new DefinicionCompeticion();
        competicion.setNombre("nombre");
        competicion.setDescripcion("desc");
        competicion.setId(1);
        competicion.setLogo("logo");
        when(this.competicionesRepository.findByIdWithDeleted(anyLong())).thenReturn(Optional.of(competicion));
    }

    @Test
    public void testAddCompeticion() {
        CrearDefinicionCompeticionDTO competicion = new CrearDefinicionCompeticionDTO();
        String nombre = "nombre";
        String desc = "desc";
        String logo = "logo";
        competicion.setDescripcion(desc);
        competicion.setLogo(logo);
        competicion.setNombre(nombre);
        this.service.add(competicion);
        verify(this.competicionesRepository, times(1))
                .save(definicionCompeticionArgumentCaptor.capture());

        assertEquals(nombre, definicionCompeticionArgumentCaptor.getValue().getNombre());
    }

    @Test
    public void testUpdateCompeticion() {
        CrearDefinicionCompeticionDTO competicion = new CrearDefinicionCompeticionDTO();
        String nombre = "n";
        String desc = "d";
        String logo = "l";
        competicion.setDescripcion(desc);
        competicion.setLogo(logo);
        competicion.setNombre(nombre);
        this.service.update(1, competicion);
        verify(this.competicionesRepository, times(1))
                .save(definicionCompeticionArgumentCaptor.capture());

        assertEquals(nombre, definicionCompeticionArgumentCaptor.getValue().getNombre());
    }

}