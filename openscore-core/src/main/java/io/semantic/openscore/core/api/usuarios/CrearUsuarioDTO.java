package io.semantic.openscore.core.api.usuarios;

import io.semantic.openscore.core.security.TokenGenerator;
import io.semantic.openscore.core.validation.annotations.Matches;
import io.semantic.openscore.core.validation.annotations.Password;
import jdk.nashorn.internal.parser.Token;
import org.hibernate.validator.constraints.Email;
import org.hibernate.validator.constraints.Length;
import org.hibernate.validator.constraints.NotEmpty;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;

@Matches.List({
        @Matches(first = "password", second = "confirmacionPassword"),
        @Matches(first = "email", second = "confirmacionEmail")})
public class CrearUsuarioDTO {

    @NotNull
    @Length(min = 2)
    private String nombre;

    @NotNull
    @Length(min = 2)
    private String apellido;

    @NotNull
    @NotEmpty
    private String pais;

    @NotNull
    @Email
    private String email;

    @NotNull
    @Email
    private String confirmacionEmail;

    @NotNull
    @Password
    private String password;

    @NotNull
    @Password
    private String confirmacionPassword;

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

    public String getPais() {
        return pais;
    }

    public void setPais(String pais) {
        this.pais = pais;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getConfirmacionEmail() {
        return confirmacionEmail;
    }

    public void setConfirmacionEmail(String confirmacionEmail) {
        this.confirmacionEmail = confirmacionEmail;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getConfirmacionPassword() {
        return confirmacionPassword;
    }

    public void setConfirmacionPassword(String confirmacionPassword) {
        this.confirmacionPassword = confirmacionPassword;
    }
}
