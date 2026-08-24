package com.acabados1a.backend.controller;

import com.acabados1a.backend.dto.ErrorResponse;
import com.acabados1a.backend.dto.PqrsEstadoRequest;
import com.acabados1a.backend.dto.PqrsRequest;
import com.acabados1a.backend.dto.PqrsResponse;
import com.acabados1a.backend.model.Pqrs;
import com.acabados1a.backend.service.PqrsService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// Igual que cotizaciones/ventas: privado por usuario, no permitAll.
@RestController
@RequestMapping("/api/pqrs")
@RequiredArgsConstructor
public class PqrsController {

    private final PqrsService pqrsService;

    @GetMapping
    public List<PqrsResponse> listar(Authentication authentication) {
        return pqrsService.listarParaUsuario(authentication.getName(), esAdmin(authentication))
            .stream().map(PqrsResponse::new).toList();
    }

    @PostMapping
    public ResponseEntity<?> crear(Authentication authentication, @Valid @RequestBody PqrsRequest request) {
        try {
            Pqrs creada = pqrsService.crear(authentication.getName(), request);
            return ResponseEntity.status(HttpStatus.CREATED).body(new PqrsResponse(creada));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @PatchMapping("/{id}/estado")
    public ResponseEntity<?> actualizar(Authentication authentication, @PathVariable Integer id,
                                         @Valid @RequestBody PqrsEstadoRequest request) {
        try {
            Pqrs actualizada = pqrsService.actualizar(authentication.getName(), id, request);
            return ResponseEntity.ok(new PqrsResponse(actualizada));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    private boolean esAdmin(Authentication authentication) {
        return authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
    }
}
