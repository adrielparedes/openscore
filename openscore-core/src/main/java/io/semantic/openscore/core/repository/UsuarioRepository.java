package io.semantic.openscore.core.repository;

import io.semantic.openscore.core.model.Usuario;

import javax.ejb.Stateless;

@Stateless
public class UsuarioRepository extends Repository<Usuario> {

    public UsuarioRepository() {
        super(Usuario.class);
    }
}
