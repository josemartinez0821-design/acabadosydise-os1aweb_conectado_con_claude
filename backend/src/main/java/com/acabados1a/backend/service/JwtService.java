package com.acabados1a.backend.service;

import com.acabados1a.backend.model.Usuario;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;

@Service
public class JwtService {

    private final SecretKey key;
    private final long expiracionMs;

    public JwtService(
        @Value("${jwt.secret}") String secret,
        @Value("${jwt.expiracion-horas:24}") long expiracionHoras
    ) {
        this.key = Keys.hmacShaKeyFor(java.util.Base64.getDecoder().decode(secret));
        this.expiracionMs = expiracionHoras * 60 * 60 * 1000;
    }

    public String generarToken(Usuario usuario) {
        Date ahora = new Date();
        Date expiracion = new Date(ahora.getTime() + expiracionMs);
        return Jwts.builder()
            .subject(usuario.getEmail())
            .claim("idUsuario", usuario.getIdUsuario())
            .claim("idRol", usuario.getRol().getIdRol())
            .issuedAt(ahora)
            .expiration(expiracion)
            .signWith(key)
            .compact();
    }

    public Claims validarYObtenerClaims(String token) {
        return Jwts.parser()
            .verifyWith(key)
            .build()
            .parseSignedClaims(token)
            .getPayload();
    }
}
