package com.acabados1a.backend.controller;

import com.acabados1a.backend.dto.AvatarRequest;
import com.acabados1a.backend.dto.CambiarPasswordRequest;
import com.acabados1a.backend.dto.ErrorResponse;
import com.acabados1a.backend.dto.UsuarioResponse;
import com.acabados1a.backend.dto.UsuarioUpdateRequest;
import com.acabados1a.backend.repository.UsuarioRepository;
import com.acabados1a.backend.service.UsuarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// GET /clientes: único uso hoy es el selector de cliente en "Nueva venta" (AdminVentasView) - no
// es la página admin de "Clientes" que el usuario declinó explícitamente (ver memoria del
// proyecto), solo una lista corta para elegir a quién se le registra un pedido manual.
// PUT/*: Perfil del usuario logueado (datos personales, foto, contraseña) - ownership (uno mismo
// o admin, salvo contraseña) lo decide UsuarioService, no esta clase.
@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
public class UsuarioController {

    private static final int ID_ROL_CLIENTE = 2;

    private final UsuarioRepository usuarioRepository;
    private final UsuarioService usuarioService;

    @GetMapping("/clientes")
    public List<UsuarioResponse> listarClientes() {
        return usuarioRepository.findByRolIdRol(ID_ROL_CLIENTE).stream().map(UsuarioResponse::new).toList();
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(Authentication authentication, @PathVariable Integer id, @Valid @RequestBody UsuarioUpdateRequest request) {
        try {
            return ResponseEntity.ok(new UsuarioResponse(usuarioService.actualizar(authentication.getName(), esAdmin(authentication), id, request)));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @PutMapping("/{id}/avatar")
    public ResponseEntity<?> actualizarAvatar(Authentication authentication, @PathVariable Integer id, @Valid @RequestBody AvatarRequest request) {
        try {
            return ResponseEntity.ok(new UsuarioResponse(usuarioService.actualizarAvatar(authentication.getName(), esAdmin(authentication), id, request)));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @PutMapping("/{id}/password")
    public ResponseEntity<?> cambiarPassword(Authentication authentication, @PathVariable Integer id, @Valid @RequestBody CambiarPasswordRequest request) {
        try {
            usuarioService.cambiarPassword(authentication.getName(), id, request);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    private boolean esAdmin(Authentication authentication) {
        return authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
    }
}
