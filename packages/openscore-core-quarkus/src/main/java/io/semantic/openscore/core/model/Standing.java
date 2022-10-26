package io.semantic.openscore.core.model;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;

@Entity
public class Standing extends Storable {

    @OneToOne
    private Equipo equipo;

    @ManyToOne
    private Grupo grupo;
    private int puntos;
    private int ganados;
    private int perdidos;
    private int empatados;
    private int diferenciaGol;

    public int getDiferenciaGol() {
        return diferenciaGol;
    }

    public void setDiferenciaGol(int diferenciaGol) {
        this.diferenciaGol = diferenciaGol;
    }

    public Equipo getEquipo() {
        return equipo;
    }

    public void setEquipo(Equipo equipo) {
        this.equipo = equipo;
    }

    public Grupo getGrupo() {
        return grupo;
    }

    public void setGrupo(Grupo grupo) {
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

}
