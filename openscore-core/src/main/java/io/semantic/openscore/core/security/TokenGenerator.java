package io.semantic.openscore.core.security;


import com.google.common.base.Charsets;
import com.google.common.hash.Hashing;
import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.JWSHeader;
import com.nimbusds.jose.JWSVerifier;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import io.semantic.openscore.core.model.Rol;
import io.semantic.openscore.core.model.Usuario;
import org.apache.commons.lang3.RandomStringUtils;

import java.util.Date;
import java.util.Set;

public class TokenGenerator {

    private static final String OPENSCORE_JWT_SECRET = "OPENSCORE_JWT_SECRET";
    private final String SECRET;
    public static final String SUBJECT = "openscore";
    public static final String ISSUER = "openscore";
    public static final String USERNAME = "username";
    public static final String EMAIL = "email";
    public static final String NOMBRE = "nombre";
    public static final String APELLIDO = "apellido";
    public static final String ROLES = "roles";
    public static final JWSAlgorithm ALGORITMO = JWSAlgorithm.HS256;
    public static final Date EXPIRACION_TOKEN = new Date(new Date().getTime() + 60 * 1000);

    public TokenGenerator() {
        this.SECRET = System.getenv(OPENSCORE_JWT_SECRET);
    }

    public String generarToken(Usuario usuario) {

        JWTClaimsSet claimsSet = new JWTClaimsSet.Builder()
                .subject(SUBJECT)
                .issuer(ISSUER)
                .expirationTime(EXPIRACION_TOKEN)
                .claim(EMAIL, usuario.getEmail())
                .claim(NOMBRE, usuario.getNombre())
                .claim(APELLIDO, usuario.getApellido())
                .claim(ROLES, usuario.getRoles())
                .build();

        SignedJWT signedJWT = new SignedJWT(new JWSHeader(ALGORITMO), claimsSet);
        sign(signedJWT);
        return signedJWT.serialize();
    }

    public String generarPassword(String password) {
        return Hashing.sha256().hashString(password, Charsets.UTF_8).toString();
    }

    public String getTokenFromAuthHeader(String authHeader) {
        try {
            String[] authorizationParts = authHeader.split(" ");

            return authorizationParts[1];
        } catch (Exception e) {
            throw new IllegalArgumentException("token vacio o invalido");

        }
    }

    public boolean verify(String token) {
        try {
            SignedJWT signedJWT = SignedJWT.parse(token);
            JWSVerifier verifier = new MACVerifier(SECRET);
            return signedJWT.verify(verifier);
        } catch (Exception e) {
            return false;
        }
    }

    public String getMail(String token) {
        try {
            SignedJWT signedJWT = SignedJWT.parse(token);
            return (String) signedJWT.getJWTClaimsSet().getClaim(EMAIL);
        } catch (Exception e) {
            throw new RuntimeException("Error al firmar el token", e);
        }
    }

    public Set<Rol> getRoles(String token) {
        try {
            SignedJWT signedJWT = SignedJWT.parse(token);
            return (Set<Rol>) signedJWT.getJWTClaimsSet().getClaim(ROLES);
        } catch (Exception e) {
            throw new RuntimeException("Error al firmar el token", e);
        }
    }

    private void sign(SignedJWT signedJWT) {
        try {

            MACSigner signer = new MACSigner(SECRET);
            signedJWT.sign(signer);
        } catch (Exception e) {
            throw new RuntimeException("Error al firmar el token", e);
        }
    }

    public static String passwordRegex() {
        return null;
    }

    public String generateRandomToken() {
        int length = 10;
        boolean useLetters = true;
        boolean useNumbers = false;
        return RandomStringUtils.random(length, useLetters, useNumbers);
    }
}
