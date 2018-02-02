package io.semantic.openscore.core.api.usuarios;

import io.semantic.openscore.core.model.Pais;
import org.hibernate.validator.constraints.Email;
import org.hibernate.validator.constraints.Length;

import javax.persistence.ManyToOne;
import javax.validation.constraints.NotNull;

public class CrearUsuarioApi {

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
    private String email;

    @NotNull
    @Email
    private String confirmacionEmail;

    @NotNull
    @Length(min = 3)
    private String username;

    @NotNull
    private String password;

    @NotNull
    private String confirmacionPassword;


}
