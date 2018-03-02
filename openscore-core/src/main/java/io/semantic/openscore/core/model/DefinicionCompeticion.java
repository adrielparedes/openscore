package io.semantic.openscore.core.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import java.util.Set;

@Entity
@Table(name = "DEFINICION_COMPETICION")
public class DefinicionCompeticion extends Storable {

    @Column(name = "NOMBRE")
    private String nombre;

    @Column(name = "LOGO")
    private String logo;

    @Column(name = "DESCRIPCION")
    private String descripcion;

    @OneToMany
    private Set<Partido> partidos;

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getLogo() {
        return logo;
    }

    public void setLogo(String logo) {
        this.logo = logo;
    }

    public Set<Partido> getPartidos() {
        return partidos;
    }

    public void setPartidos(Set<Partido> partidos) {
        this.partidos = partidos;
    }

    public void addPartido(Partido partido) {
        this.getPartidos().add(partido);
    }

}
