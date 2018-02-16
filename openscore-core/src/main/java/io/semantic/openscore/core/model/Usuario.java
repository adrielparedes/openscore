package io.semantic.openscore.core.model;

import org.hibernate.validator.constraints.Email;
import org.hibernate.validator.constraints.Length;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.Set;

@Entity
public class Usuario extends Storable {


    @NotNull
    @Length(min = 2)
    private String nombre;

    @NotNull
    @Length(min = 2)
    private String apellido;

    @NotNull
    @ManyToOne
    private Pais pais;

    @NotNull
    @Email
    @Column(unique = true)
    private String email;

    @NotNull
    private String password;

//    @ManyToMany
//    private Set<DefinicionCompeticion> competiciones;

    @ElementCollection
    @CollectionTable(name = "roles", joinColumns = @JoinColumn(name = "usuario_id"))
    @Enumerated(EnumType.STRING)
    private Set<Rol> roles;

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getApellido() {
        return apellido;
    }

    public void setApellido(String apellido) {
        this.apellido = apellido;
    }

    public Pais getPais() {
        return pais;
    }

    public void setPais(Pais pais) {
        this.pais = pais;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

//    public Set<DefinicionCompeticion> getCompeticiones() {
//        return competiciones;
//    }
//
//    public void setCompeticiones(Set<DefinicionCompeticion> competiciones) {
//        this.competiciones = competiciones;
//    }
//
//    public void addCompeticion(DefinicionCompeticion competicion) {
//        this.competiciones.add(competicion);
//    }

    public Set<Rol> getRoles() {
        return roles;
    }

    public void setRoles(Set<Rol> roles) {
        this.roles = roles;
    }
}
