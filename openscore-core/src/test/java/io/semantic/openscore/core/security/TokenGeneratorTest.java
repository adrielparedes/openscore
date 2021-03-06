package io.semantic.openscore.core.security;

import java.text.ParseException;

import com.google.common.collect.Sets;
import com.nimbusds.jwt.SignedJWT;
import io.semantic.openscore.core.model.Rol;
import io.semantic.openscore.core.model.Usuario;
import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.*;

public class TokenGeneratorTest {

    private TokenGenerator tokenGenerator;

    @Before
    public void setUp() {
        this.tokenGenerator = new TokenGenerator();
    }

    @Test
    public void testCrearToken() throws ParseException {
        String nombre = "Lionel";
        String apellido = "Messi";
        String email = "lionel.messi@gmail.com";
        String username = "lmessi";

        Usuario usuario = new Usuario();
        usuario.setNombre(nombre);
        usuario.setApellido(apellido);
        usuario.setEmail(email);
        usuario.setRoles(Sets.newHashSet(Rol.ADMIN,
                                         Rol.USUARIO));
        String token = this.tokenGenerator.generarToken(usuario);

        SignedJWT signedJWT = SignedJWT.parse(token);

        assertEquals(nombre,
                     signedJWT.getJWTClaimsSet().getStringClaim(TokenGenerator.NOMBRE));
        assertEquals(apellido,
                     signedJWT.getJWTClaimsSet().getStringClaim(TokenGenerator.APELLIDO));
        assertEquals(email,
                     signedJWT.getJWTClaimsSet().getStringClaim(TokenGenerator.EMAIL));
        assertNotNull(signedJWT.getJWTClaimsSet().getExpirationTime().getTime());
        assertTrue(signedJWT.getJWTClaimsSet().getStringListClaim(TokenGenerator.ROLES).contains(Rol.ADMIN.toString()));
    }

    @Test
    public void testCrearPassword() {

        String password = this.tokenGenerator.generarPassword("123");
        assertEquals(64,
                     password.length());
    }
}