package io.semantic.openscore.core.api.pronosticos;

public class PronosticoDTO {

    private long id;
    private boolean local;
    private boolean visitante;
    private boolean empate;
    private long partido;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public boolean isLocal() {
        return local;
    }

    public void setLocal(boolean local) {
        this.local = local;
    }

    public boolean isVisitante() {
        return visitante;
    }

    public void setVisitante(boolean visitante) {
        this.visitante = visitante;
    }

    public boolean isEmpate() {
        return empate;
    }

    public void setEmpate(boolean empate) {
        this.empate = empate;
    }

    public long getPartido() {
        return partido;
    }

    public void setPartido(long partido) {
        this.partido = partido;
    }
}
