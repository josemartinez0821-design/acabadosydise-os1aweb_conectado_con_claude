package com.acabados1a.backend.controller;

import com.acabados1a.backend.dto.ErrorResponse;
import com.acabados1a.backend.dto.MovimientoInventarioRequest;
import com.acabados1a.backend.dto.MovimientoInventarioResponse;
import com.acabados1a.backend.service.MovimientoInventarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/movimientos-inventario")
@RequiredArgsConstructor
public class MovimientoInventarioController {

    private final MovimientoInventarioService movimientoInventarioService;

    @GetMapping
    public List<MovimientoInventarioResponse> listar() {
        return movimientoInventarioService.listar().stream().map(MovimientoInventarioResponse::new).toList();
    }

    @PostMapping
    public ResponseEntity<?> registrar(Authentication authentication, @Valid @RequestBody MovimientoInventarioRequest request) {
        try {
            var creado = movimientoInventarioService.registrar(authentication.getName(), request);
            return ResponseEntity.status(HttpStatus.CREATED).body(new MovimientoInventarioResponse(creado));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }
}
