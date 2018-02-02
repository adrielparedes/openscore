package io.semantic.openscore.core.model;

import javax.persistence.Entity;
import java.util.Date;

@Entity
public class Partido extends Storable {

    private Equipo local;
    private Equipo visitante;
    private Date fecha;
    private String lugar;

    public Date getFecha() {
        return fecha;
    }

    public void setFecha(Date fecha) {
        this.fecha = fecha;
    }

    public Equipo getLocal() {
        return local;
    }

    public void setLocal(Equipo local) {
        this.local = local;
    }

    public Equipo getVisitante() {
        return visitante;
    }

    public void setVisitante(Equipo visitante) {
        this.visitante = visitante;
    }

    public String getLugar() {
        return lugar;
    }

    public void setLugar(String lugar) {
        this.lugar = lugar;
    }
}
