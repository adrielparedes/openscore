package io.semantic.openscore.core.model;

import javax.persistence.Embedded;
import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import java.util.Date;

@Entity
public class Partido extends Storable {

    @OneToOne
    private Equipo local;

    @OneToOne
    private Equipo visitante;
    private Date dia;
    private String lugar;
    private int fecha;

    @ManyToOne
    private Grupo grupo;

    @ManyToOne
    private Fase fase;

    @Embedded
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

    public boolean isBloqueado() {
        return this.getDia().getTime() <= new Date().getTime() + 900000;
    }

    public PartidoStatus getStatus() {
        if (this.getResultado() != null) {
            return PartidoStatus.FINALIZADO;
        } else if (this.isBloqueado()) {
            return PartidoStatus.BLOQUEADO;
        } else {
            return PartidoStatus.PENDIENTE;
        }
    }

    public int getFecha() {
        return fecha;
    }

    public void setFecha(int fecha) {
        this.fecha = fecha;
    }
}
