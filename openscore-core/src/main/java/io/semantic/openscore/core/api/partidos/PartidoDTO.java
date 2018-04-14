package io.semantic.openscore.core.api.partidos;

import io.semantic.openscore.core.api.equipos.EquipoDTO;
import io.semantic.openscore.core.api.grupos.FaseDTO;
import io.semantic.openscore.core.api.grupos.GrupoDTO;
import io.semantic.openscore.core.model.Fase;

import java.util.Date;

public class PartidoDTO {

    private long id;
    private EquipoDTO local;
    private EquipoDTO visitante;
    private Date fecha;
    private GrupoDTO grupo;
    private FaseDTO fase;
    private String lugar;
    private String status;

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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public GrupoDTO getGrupo() {
        return grupo;
    }

    public void setGrupo(GrupoDTO grupo) {
        this.grupo = grupo;
    }

    public FaseDTO getFase() {
        return fase;
    }

    public void setFase(FaseDTO fase) {
        this.fase = fase;
    }
}
