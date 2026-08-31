package io.semantic.openscore.core.model;

import javax.persistence.Entity;

@Entity
public class Fase extends Storable {

    public static final String GRUPO = "GRUPO";
    public static final String OCTAVOS = "OCTAVOS";
    public static final String CUARTOS = "CUARTOS";
    public static final String SEMI = "SEMI";
    public static final String FINAL = "FINAL";
    public static final String TERCER = "TERCER";

    private String codigo;
    private String nombre;
    private Integer puntos;

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public Integer getPuntos() {
        return puntos;
    }

    public void setPuntos(Integer puntos) {
        this.puntos = puntos;
    }
}
