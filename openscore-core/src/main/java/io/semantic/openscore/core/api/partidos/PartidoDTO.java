package io.semantic.openscore.core.api.partidos;

import io.semantic.openscore.core.api.equipos.EquipoDTO;

import java.util.Date;

public class PartidoDTO {

    private long id;
    private EquipoDTO local;
    private EquipoDTO visitante;
    private Date fecha;
    private String lugar;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public EquipoDTO getLocal() {
        return local;
    }

    public void setLocal(EquipoDTO local) {
        this.local = local;
    }

    public EquipoDTO getVisitante() {
        return visitante;
    }

    public void setVisitante(EquipoDTO visitante) {
        this.visitante = visitante;
    }

    public Date getFecha() {
        return fecha;
    }

    public void setFecha(Date fecha) {
        this.fecha = fecha;
    }

    public String getLugar() {
        return lugar;
    }

    public void setLugar(String lugar) {
        this.lugar = lugar;
    }
}
