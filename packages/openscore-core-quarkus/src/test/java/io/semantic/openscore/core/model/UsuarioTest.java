package io.semantic.openscore.core.model;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.MockitoJUnitRunner;

import java.util.Arrays;
import java.util.HashSet;

import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.spy;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class UsuarioTest {

    @Spy
    private Usuario usuarioSinPronosticos;


    @Spy
    private Usuario usuario;

    @Mock
    private Fase faseDeGrupos;


    @Before
    public void setUp() {

        when(faseDeGrupos.getPuntos()).thenReturn(1);

        Pronostico p1 = spy(new Pronostico());
        when(p1.isLocal()).thenReturn(true);

        Resultado resultado = new Resultado();

        Partido partido = new Partido();
        partido.setFase(faseDeGrupos);

        resultado.setPartido(partido);
        partido.setResultado(resultado);

        resultado.setLocal(1);
        resultado.setVisitante(0);

        when(p1.getPartido()).thenReturn(partido);

        when(usuario.getPronosticos()).thenReturn(new HashSet<>(Arrays.asList(p1)));

    }


    @Test
    public void testCalcularPuntosSinPronostico() {
        int puntos = usuarioSinPronosticos.getPuntos();
        assertEquals(0, puntos);
    }

    @Test
    public void testCalcularPuntosUnPartidoGanado() {
        int puntos = usuario.getPuntos();
        assertEquals(1, puntos);
    }

}