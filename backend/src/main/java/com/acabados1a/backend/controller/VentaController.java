package com.acabados1a.backend.controller;

import com.acabados1a.backend.dto.ErrorResponse;
import com.acabados1a.backend.dto.VentaEstadoRequest;
import com.acabados1a.backend.dto.VentaNotasRequest;
import com.acabados1a.backend.dto.VentaRequest;
import com.acabados1a.backend.dto.VentaResponse;
import com.acabados1a.backend.model.Venta;
import com.acabados1a.backend.repository.DetalleVentaRepository;
import com.acabados1a.backend.repository.PagoRepository;
import com.acabados1a.backend.service.VentaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// Igual que cotizaciones: privado por usuario, no permitAll. Crear/listar los decide el service
// según ownership; estado/notas son solo-admin (forzado en SecurityConfig, por eso acá no hace
// falta revisar el rol para esos dos).
@RestController
@RequestMapping("/api/ventas")
@RequiredArgsConstructor
public class VentaController {

    private final VentaService ventaService;
    private final DetalleVentaRepository detalleVentaRepository;
    private final PagoRepository pagoRepository;

    @GetMapping
    public List<VentaResponse> listar(Authentication authentication) {
        return ventaService.listarParaUsuario(authentication.getName(), esAdmin(authentication))
            .stream().map(this::toResponse).toList();
    }

    @PostMapping
    public ResponseEntity<?> crear(Authentication authentication, @Valid @RequestBody VentaRequest request) {
        try {
            Venta creada = ventaService.crear(authentication.getName(), esAdmin(authentication), request);
            return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(creada));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @PatchMapping("/{id}/estado")
    public ResponseEntity<?> actualizarEstado(Authentication authentication, @PathVariable Integer id,
                                               @Valid @RequestBody VentaEstadoRequest request) {
        try {
            Venta actualizada = ventaService.actualizarEstado(authentication.getName(), id, request);
            return ResponseEntity.ok(toResponse(actualizada));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @PutMapping("/{id}/notas")
    public ResponseEntity<?> actualizarNotas(@PathVariable Integer id, @RequestBody VentaNotasRequest request) {
        try {
            Venta actualizada = ventaService.actualizarNotas(id, request);
            return ResponseEntity.ok(toResponse(actualizada));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    private boolean esAdmin(Authentication authentication) {
        return authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
    }

    private VentaResponse toResponse(Venta v) {
        return new VentaResponse(v,
            detalleVentaRepository.findByVentaIdVenta(v.getIdVenta()),
            pagoRepository.findByVentaIdVenta(v.getIdVenta()));
    }
}
