package io.semantic.openscore.core.api.usuarios;

import io.semantic.openscore.core.validation.annotations.Password;

import javax.validation.constraints.NotNull;

public class UpdateSecretQuestion {

    @NotNull
    private String preguntaSecreta;

    @NotNull
    private String respuestaPreguntaSecreta;

    @NotNull
    @Password
    private String password;

    public String getPreguntaSecreta() {
        return preguntaSecreta;
    }

    public void setPreguntaSecreta(String preguntaSecreta) {
        this.preguntaSecreta = preguntaSecreta;
    }

    public String getRespuestaPreguntaSecreta() {
        return respuestaPreguntaSecreta;
    }

    public void setRespuestaPreguntaSecreta(String respuestaPreguntaSecreta) {
        this.respuestaPreguntaSecreta = respuestaPreguntaSecreta;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
