package io.semantic.openscore.core.api.partidos;

import java.util.Date;

public class CrearOUpdatePartidoDTO {

    private long idLocal;
    private long idVisitante;
    private Date dia;
    private int fecha;
    private String lugar;

    public long getIdLocal() {
        return idLocal;
    }

    public void setIdLocal(long idLocal) {
        this.idLocal = idLocal;
    }

    public long getIdVisitante() {
        return idVisitante;
    }

    public void setIdVisitante(long idVisitante) {
        this.idVisitante = idVisitante;
    }

    public Date getDia() {
        return dia;
    }

    public void setDia(Date dia) {
        this.dia = dia;
    }

    public String getLugar() {
        return lugar;
    }

    public void setLugar(String lugar) {
        this.lugar = lugar;
    }

    public int getFecha() {
        return fecha;
    }

    public void setFecha(int fecha) {
        this.fecha = fecha;
    }
}
