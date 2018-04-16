package io.semantic.openscore.core.services;

import io.semantic.openscore.core.model.Usuario;

import javax.enterprise.context.RequestScoped;
import java.util.Optional;

@RequestScoped
public class UserInfo {

    private Optional<Usuario> usuario;

    public UserInfo() {
        usuario = Optional.empty();
    }

    public Optional<Usuario> getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = Optional.of(usuario);
    }

    public long getUserId() {
//        return this.usuario.orElseThrow(() -> new IllegalArgumentException("Se necesita un usuario en la sesion para poder obtener el id")).getId();
        return 0l;
    }
}
