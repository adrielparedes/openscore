package io.semantic.openscore.core.api.usuarios;

import org.hibernate.validator.constraints.NotEmpty;

import io.semantic.openscore.core.validation.annotations.Matches;
import io.semantic.openscore.core.validation.annotations.Password;

@Matches.List({
        @Matches(first = "password", second = "confirmacionPassword") })
public class UpdatePassword {

    @NotEmpty
    private String oldPassword;

    @NotEmpty
    @Password
    private String password;

    @NotEmpty
    @Password
    private String confirmacionPassword;

    public String getOldPassword() {
        return oldPassword;
    }

    public void setOldPassword(String oldPassword) {
        this.oldPassword = oldPassword;
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
