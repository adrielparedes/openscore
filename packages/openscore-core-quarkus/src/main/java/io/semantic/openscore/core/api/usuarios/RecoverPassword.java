package io.semantic.openscore.core.api.usuarios;

import io.semantic.openscore.core.validation.annotations.Matches;
import io.semantic.openscore.core.validation.annotations.Password;
import org.hibernate.validator.constraints.Email;

import javax.validation.constraints.NotNull;

@Matches.List({
        @Matches(first = "password", second = "confirmacionPassword")})
public class RecoverPassword {


    @NotNull
    @Email(regexp = ".*@redhat\\.com")
    private String email;

    @NotNull
    private String token;

    @NotNull
    @Password
    private String password;

    @NotNull
    @Password
    private String confirmacionPassword;

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

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
