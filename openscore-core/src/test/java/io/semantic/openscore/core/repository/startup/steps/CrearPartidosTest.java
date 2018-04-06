package io.semantic.openscore.core.repository.startup.steps;

import org.junit.Before;
import org.junit.Test;

import java.util.Date;

public class CrearPartidosTest {

    private CrearPartidos crearPartidos;

    @Before
    public void setUp() {
        this.crearPartidos = new CrearPartidos();
    }

    @Test
    public void testFecha() {
        Date fecha = this.crearPartidos.getMatchDate("14-06-2018T18:00+0300");
        System.out.println(fecha);

    }

}