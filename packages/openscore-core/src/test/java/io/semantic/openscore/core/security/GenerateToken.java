package io.semantic.openscore.core.security;

import io.semantic.openscore.core.model.Rol;
import io.semantic.openscore.core.model.Usuario;

import java.util.Arrays;
import java.util.HashSet;

public class GenerateToken {

    public static void main(String[] args) {
        TokenGenerator tokenGenerator = new TokenGenerator();
        Usuario usuario = crearUsuario(tokenGenerator);
        String token = tokenGenerator.generarToken(usuario);
        System.out.println(token);
    }

    public static Usuario crearUsuario(TokenGenerator tokenGenerator) {
        Usuario usuario = new Usuario();
        usuario.setRoles(new HashSet<>(Arrays.asList(Rol.ADMIN, Rol.USUARIO)));
        usuario.setEmail("admin@admin.com");
        usuario.setApellido("Admin");
        usuario.setNombre("Admin");
        usuario.setPassword(tokenGenerator.generarPassword("admin"));
        return usuario;
    }
}
