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
import io.semantic.openscore.core.model.Usuario;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Date;

public class TokenGenerator {

    public static final String SECRET = "7ZXjPiKE2dUYL9ENu3zcZESUM2dyOoVa";
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
    }

    public String generarToken(Usuario usuario) {

        JWTClaimsSet claimsSet = new JWTClaimsSet.Builder()
                .subject(SUBJECT)
                .issuer(ISSUER)
                .expirationTime(EXPIRACION_TOKEN)
                .claim(USERNAME, usuario.getUsername())
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

    public boolean verify(String token) {
        try {
            SignedJWT signedJWT = SignedJWT.parse(token);
            JWSVerifier verifier = new MACVerifier(SECRET);
            return signedJWT.verify(verifier);
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
}
