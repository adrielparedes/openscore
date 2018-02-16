package io.semantic.openscore.core.services.impl;

import io.semantic.openscore.core.api.competiciones.CrearDefinicionCompeticionApi;
import io.semantic.openscore.core.api.competiciones.UpdateDefinicionCompeticionApi;
import io.semantic.openscore.core.mapping.DozerProducer;
import io.semantic.openscore.core.model.DefinicionCompeticion;
import io.semantic.openscore.core.repository.CompeticionesRepository;
import io.semantic.openscore.core.services.api.DefinicionCompeticionesService;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
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

    @Captor
    private ArgumentCaptor<DefinicionCompeticion> definicionCompeticionArgumentCaptor;

    private DefinicionCompeticionesService service;

    @Before
    public void setUp() {
        service = new DefinicionCompeticionServiceImpl(competicionesRepository, new DozerProducer().produceDozer());
        DefinicionCompeticion competicion = new DefinicionCompeticion();
        competicion.setNombre("nombre");
        competicion.setDescripcion("desc");
        competicion.setId(1);
        competicion.setLogo("logo");
        when(this.competicionesRepository.findByIdWithDeleted(anyLong())).thenReturn(Optional.of(competicion));
    }

    @Test
    public void testAddCompeticion() {
        CrearDefinicionCompeticionApi competicion = new CrearDefinicionCompeticionApi();
        String nombre = "nombre";
        String desc = "desc";
        String logo = "logo";
        competicion.setDescripcion(desc);
        competicion.setLogo(logo);
        competicion.setNombre(nombre);
        this.service.addCompeticion(competicion);
        verify(this.competicionesRepository, times(1))
                .save(definicionCompeticionArgumentCaptor.capture());

        assertEquals(nombre, definicionCompeticionArgumentCaptor.getValue().getNombre());
    }

    @Test
    public void testUpdateCompeticion() {
        UpdateDefinicionCompeticionApi competicion = new UpdateDefinicionCompeticionApi();
        String nombre = "n";
        String desc = "d";
        String logo = "l";
        competicion.setDescripcion(desc);
        competicion.setLogo(logo);
        competicion.setNombre(nombre);
        this.service.updateCompeticion(1, competicion);
        verify(this.competicionesRepository, times(1))
                .save(definicionCompeticionArgumentCaptor.capture());

        assertEquals(nombre, definicionCompeticionArgumentCaptor.getValue().getNombre());
    }

}