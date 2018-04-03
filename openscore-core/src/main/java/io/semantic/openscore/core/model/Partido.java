package io.semantic.openscore.core.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import java.util.Date;
import java.util.Optional;

@Entity
public class Partido extends Storable {

    @OneToOne
    private Equipo local;

    @OneToOne
    private Equipo visitante;
    private Date fecha;
    private String lugar;

    @ManyToOne
    private Grupo grupo;

    @ManyToOne
    private Fase fase;

    @OneToOne
    private Resultado resultado;


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

    public Grupo getGrupo() {
        return grupo;
    }

    public void setGrupo(Grupo grupo) {
        this.grupo = grupo;
    }

    public Fase getFase() {
        return fase;
    }

    public void setFase(Fase fase) {
        this.fase = fase;
    }

    public Resultado getResultado() {
        return resultado;
    }

    public void setResultado(Resultado resultado) {
        this.resultado = resultado;
    }

    public int getPuntos(Pronostico pronostico) {

        if (this.getResultado() == null) {
            return 0;
        }

        int puntosAsignables = calcularPuntos();
        Ganador ganador = this.getResultado().getGanador();
        if (isSumaPuntos(pronostico, ganador)) {
            return puntosAsignables;
        } else {
            return 0;
        }
    }

    private boolean isSumaPuntos(Pronostico pronostico, Ganador ganador) {
        return pronostico.isLocal() && Ganador.LOCAL.equals(ganador) ||
                pronostico.isVisitante() && Ganador.VISITANTE.equals(ganador) ||
                pronostico.isEmpate() && Ganador.EMPATE.equals(ganador);
    }


    private int calcularPuntos() {
        return this.getFase().getPuntos();
    }
}
