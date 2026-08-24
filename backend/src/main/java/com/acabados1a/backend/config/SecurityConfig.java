package com.acabados1a.backend.config;

import com.acabados1a.backend.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // Primer grupo de endpoints protegidos por rol: escritura de /api/productos, solo ROLE_ADMIN
    // (id_rol=1, igual que auth.isAdmin en el frontend). JwtAuthenticationFilter puebla el
    // contexto de seguridad si viene un token válido; todo lo demás sigue permitAll() como antes.
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, JwtAuthenticationFilter jwtAuthenticationFilter) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.POST, "/api/productos").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/productos/*").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/productos/*").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/servicios").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/servicios/*").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/servicios/*").hasRole("ADMIN")
                // Cotizaciones no es catálogo público - cualquier usuario logueado puede crear/ver/
                // actuar sobre lo suyo, pero "esto es tuyo o eres admin" lo decide CotizacionService,
                // no esta regla (aquí solo se exige estar autenticado, sin importar el rol).
                .requestMatchers(HttpMethod.GET, "/api/cotizaciones").authenticated()
                .requestMatchers(HttpMethod.POST, "/api/cotizaciones").authenticated()
                .requestMatchers(HttpMethod.PATCH, "/api/cotizaciones/*/estado").authenticated()
                // Ventas: mismo patrón que cotizaciones para listar/crear (privado por usuario,
                // el ownership lo decide VentaService) - pero cambiar estado o notas internas es
                // una acción de operación interna, ahí sí basta con el rol.
                .requestMatchers(HttpMethod.GET, "/api/ventas").authenticated()
                .requestMatchers(HttpMethod.POST, "/api/ventas").authenticated()
                .requestMatchers(HttpMethod.PATCH, "/api/ventas/*/estado").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/ventas/*/notas").hasRole("ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/usuarios/clientes").hasRole("ADMIN")
                // PQRS: privado por usuario (radicar/listar), gestionar (cambiar estado/responder)
                // es solo-admin - mismo patrón que estado/notas de ventas.
                .requestMatchers(HttpMethod.GET, "/api/pqrs").authenticated()
                .requestMatchers(HttpMethod.POST, "/api/pqrs").authenticated()
                .requestMatchers(HttpMethod.PATCH, "/api/pqrs/*/estado").hasRole("ADMIN")
                // Inventario: GET sigue permitAll (catálogo público lo necesita para stock), pero
                // registrar movimientos manuales y tocar umbrales es solo-admin.
                .requestMatchers(HttpMethod.PUT, "/api/inventario/*/umbrales").hasRole("ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/movimientos-inventario").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/movimientos-inventario").hasRole("ADMIN")
                .anyRequest().permitAll()
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    // El frontend Vite corre en localhost:5173, pero sube de puerto (5174, 5175...) cada vez que
    // el anterior ya está ocupado por otra instancia - un patrón con comodín en el puerto evita
    // tener que actualizar esta lista cada vez que eso pasa. Solo para desarrollo local.
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOriginPatterns(List.of("http://localhost:*"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
