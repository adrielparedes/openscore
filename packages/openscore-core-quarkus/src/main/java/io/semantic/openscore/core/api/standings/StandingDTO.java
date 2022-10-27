package io.semantic.openscore.core.api.standings;

import io.semantic.openscore.core.api.equipos.EquipoDTO;
import io.semantic.openscore.core.api.grupos.GrupoDTO;

public class StandingDTO {

    private EquipoDTO equipo;
    private GrupoDTO grupo;
    private int partidos;

    private int puntos;
    private int ganados;
    private int perdidos;
    private int empatados;
    private int diferenciaGol;

    public EquipoDTO getEquipo() {
        return equipo;
    }

    public void setEquipo(EquipoDTO equipo) {
        this.equipo = equipo;
    }

    public GrupoDTO getGrupo() {
        return grupo;
    }

    public void setGrupo(GrupoDTO grupo) {
        this.grupo = grupo;
    }

    public int getPuntos() {
        return puntos;
    }

    public void setPuntos(int puntos) {
        this.puntos = puntos;
    }

    public int getGanados() {
        return ganados;
    }

    public void setGanados(int ganados) {
        this.ganados = ganados;
    }

    public int getPerdidos() {
        return perdidos;
    }

    public void setPerdidos(int perdidos) {
        this.perdidos = perdidos;
    }

    public int getEmpatados() {
        return empatados;
    }

    public void setEmpatados(int empatados) {
        this.empatados = empatados;
    }

    public int getDiferenciaGol() {
        return diferenciaGol;
    }

    public void setDiferenciaGol(int diferenciaGol) {
        this.diferenciaGol = diferenciaGol;
    }

    public int getPartidos() {
        return partidos;
    }

    public void setPartidos(int partidos) {
        this.partidos = partidos;
    }

}
