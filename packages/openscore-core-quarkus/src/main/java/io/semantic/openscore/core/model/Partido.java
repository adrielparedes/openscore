package io.semantic.openscore.core.model;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

import javax.persistence.Embedded;
import javax.persistence.Entity;
import javax.persistence.ManyToOne;

@Entity
public class Partido extends Storable {

    @ManyToOne
    private Equipo local;

    @ManyToOne
    private Equipo visitante;
    private LocalDateTime dia;
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

    public LocalDateTime getDia() {
        return dia;
    }

    public void setDia(LocalDateTime dia) {
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
        System.out.println(this.getDia().toInstant(ZoneOffset.UTC).toEpochMilli());
        return this.getDia().toInstant(ZoneOffset.UTC).toEpochMilli() <= Instant.now().toEpochMilli() + 900000;
    }

    public PartidoStatus getStatus() {
        if (this.getResultado() != null) {
            return PartidoStatus.FINISHED;
        } else if (this.isBloqueado()) {
            return PartidoStatus.BLOCKED;
        } else {
            return PartidoStatus.PENDING;
        }
    }

    public int getFecha() {
        return fecha;
    }

    public void setFecha(int fecha) {
        this.fecha = fecha;
    }
}
