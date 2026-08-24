package com.acabados1a.backend.controller;

import com.acabados1a.backend.dto.*;
import com.acabados1a.backend.model.Usuario;
import com.acabados1a.backend.service.AuthService;
import com.acabados1a.backend.service.JwtService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final JwtService jwtService;

    // Ya no entrega token aquí - la cuenta queda sin verificar hasta que se confirme el código
    // (ver /verificar-email), así que RegistroView.vue ya no puede autologuear apenas se crea.
    @PostMapping("/registro")
    public ResponseEntity<?> registrar(@Valid @RequestBody RegistroRequest request) {
        try {
            Usuario usuario = authService.registrar(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(new UsuarioResponse(usuario));
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            Usuario usuario = authService.login(request);
            String token = jwtService.generarToken(usuario);
            return ResponseEntity.ok(new LoginResponse(token, usuario));
        } catch (IllegalArgumentException e) {
            // codigo va aparte del mensaje para que el frontend (LoginView.vue) pueda ofrecer el
            // acceso directo a "reenviar código" sin depender de comparar el texto exacto del
            // mensaje, que podría cambiar de redacción sin que nadie actualice ambos lados.
            String codigo = AuthService.MSG_CUENTA_NO_VERIFICADA.equals(e.getMessage()) ? "CUENTA_NO_VERIFICADA" : null;
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorResponse(e.getMessage(), codigo));
        }
    }

    // El token real de sesión se entrega aquí - el auto-login que antes pasaba en /registro ahora
    // pasa una vez confirmado el código.
    @PostMapping("/verificar-email")
    public ResponseEntity<?> verificarEmail(@Valid @RequestBody VerificarEmailRequest request) {
        try {
            Usuario usuario = authService.verificarEmail(request.getEmail(), request.getCodigo());
            String token = jwtService.generarToken(usuario);
            return ResponseEntity.ok(new LoginResponse(token, usuario));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @PostMapping("/reenviar-codigo")
    public ResponseEntity<?> reenviarCodigo(@Valid @RequestBody ReenviarCodigoRequest request) {
        try {
            authService.reenviarCodigoVerificacion(request.getEmail());
            return ResponseEntity.ok(new MensajeResponse("Código reenviado, revisa tu correo."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @PostMapping("/recuperar-password")
    public ResponseEntity<?> recuperarPassword(@Valid @RequestBody RecuperarPasswordRequest request) {
        try {
            authService.solicitarRecuperacion(request.getEmail());
            return ResponseEntity.ok(new MensajeResponse("Código enviado, revisa tu correo."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @PostMapping("/verificar-codigo")
    public ResponseEntity<?> verificarCodigo(@Valid @RequestBody VerificarCodigoRequest request) {
        try {
            authService.verificarCodigoRecuperacion(request.getEmail(), request.getCodigo());
            return ResponseEntity.ok(new MensajeResponse("Código válido."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @PostMapping("/nueva-password")
    public ResponseEntity<?> nuevaPassword(@Valid @RequestBody NuevaPasswordRequest request) {
        try {
            authService.nuevaPassword(request);
            return ResponseEntity.ok(new MensajeResponse("Contraseña actualizada correctamente."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    private record MensajeResponse(String mensaje) {
    }
}
