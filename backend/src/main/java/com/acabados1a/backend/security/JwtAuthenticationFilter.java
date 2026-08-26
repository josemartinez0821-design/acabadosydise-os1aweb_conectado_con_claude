package com.acabados1a.backend.security;

import com.acabados1a.backend.service.JwtService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.Map;

// No decide por sí mismo si una ruta requiere autenticación - eso lo sigue haciendo
// authorizeHttpRequests en SecurityConfig. Este filtro solo intenta poblar el contexto de
// seguridad si viene un token; si no viene, o es inválido/expirado, la request sigue anónima y
// las rutas permitAll() no se ven afectadas.
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final String PREFIJO_BEARER = "Bearer ";

    // Mismo orden de roles que ya asumen JwtService/AuthService/frontend/src/stores/auth.js
    // (1 Administrador, 2 Cliente) - el id_rol=3 "Vendedor" se quitó de la BD el 25/08/2026, sin
    // requisito funcional real detrás y sin ningún usuario que lo tuviera asignado.
    private static final Map<Integer, String> AUTORIDAD_POR_ROL = Map.of(
        1, "ROLE_ADMIN",
        2, "ROLE_CLIENTE"
    );

    private final JwtService jwtService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                     FilterChain filterChain) throws ServletException, IOException {
        String header = request.getHeader(HttpHeaders.AUTHORIZATION);

        if (header != null && header.startsWith(PREFIJO_BEARER)) {
            try {
                Claims claims = jwtService.validarYObtenerClaims(header.substring(PREFIJO_BEARER.length()));
                // Number, no Integer: el claim numérico puede volver como Long según el caso,
                // y pedirlo directo como Integer.class puede lanzar ClassCastException.
                Integer idRol = claims.get("idRol", Number.class).intValue();
                String autoridad = AUTORIDAD_POR_ROL.get(idRol);
                List<SimpleGrantedAuthority> autoridades =
                    autoridad != null ? List.of(new SimpleGrantedAuthority(autoridad)) : List.of();

                Authentication authentication =
                    new UsernamePasswordAuthenticationToken(claims.getSubject(), null, autoridades);
                SecurityContextHolder.getContext().setAuthentication(authentication);
            } catch (JwtException | IllegalArgumentException e) {
                SecurityContextHolder.clearContext();
            }
        }

        filterChain.doFilter(request, response);
    }
}
