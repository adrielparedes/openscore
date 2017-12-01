package io.semantic.openscore.core.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Lob;

@Entity
public class Competicion extends Storable {

    @Column(name = "NOMBRE")
    private String nombre;

    @Lob
    @Column(name = "LOGO ")
    private byte[] logo;

    @Lob
    @Column(name = "COPA")
    private byte[] copa;

    @Column(name = "DESCRIPCION")
    private String descripcion;

    @Column(name = "UBICACION")
    private String ubicacion;

    @Column(name = "REGISTRADO")
    private boolean registrado;

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

    public String getUbicacion() {
        return ubicacion;
    }

    public void setUbicacion(String ubicacion) {
        this.ubicacion = ubicacion;
    }

    public boolean getRegistrado() {
        return registrado;
    }

    public void setRegistrado(boolean registrado) {
        this.registrado = registrado;
    }

    public byte[] getLogo() {
        return logo;
    }

    public void setLogo(byte[] logo) {
        this.logo = logo;
    }

    public byte[] getCopa() {
        return copa;
    }

    public void setCopa(byte[] copa) {
        this.copa = copa;
    }
}
