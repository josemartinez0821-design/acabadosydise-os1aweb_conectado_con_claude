package com.acabados1a.backend.controller;

import com.acabados1a.backend.dto.CotizacionEstadoRequest;
import com.acabados1a.backend.dto.CotizacionRequest;
import com.acabados1a.backend.dto.CotizacionResponse;
import com.acabados1a.backend.dto.ErrorResponse;
import com.acabados1a.backend.model.Cotizacion;
import com.acabados1a.backend.repository.CotizacionProductoRepository;
import com.acabados1a.backend.repository.CotizacionServicioRepository;
import com.acabados1a.backend.service.CotizacionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// RF08 - cotizaciones. A diferencia de productos/servicios, no hay ningún GET permitAll aquí:
// es información privada por usuario (cliente ve solo las suyas, admin las ve todas) - por eso
// cada método recibe Authentication y resuelve el permiso puntual, no algo que SecurityConfig
// pueda decidir solo con el rol.
@RestController
@RequestMapping("/api/cotizaciones")
@RequiredArgsConstructor
public class CotizacionController {

    private final CotizacionService cotizacionService;
    private final CotizacionProductoRepository cotizacionProductoRepository;
    private final CotizacionServicioRepository cotizacionServicioRepository;

    @GetMapping
    public List<CotizacionResponse> listar(Authentication authentication) {
        return cotizacionService.listarParaUsuario(authentication.getName(), esAdmin(authentication))
            .stream().map(this::toResponse).toList();
    }

    @PostMapping
    public ResponseEntity<?> crear(Authentication authentication, @Valid @RequestBody CotizacionRequest request) {
        try {
            Cotizacion creada = cotizacionService.crear(authentication.getName(), request);
            return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(creada));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @PatchMapping("/{id}/estado")
    public ResponseEntity<?> actualizarEstado(Authentication authentication, @PathVariable Integer id,
                                               @Valid @RequestBody CotizacionEstadoRequest request) {
        try {
            Cotizacion actualizada = cotizacionService.actualizarEstado(authentication.getName(), esAdmin(authentication), id, request);
            return ResponseEntity.ok(toResponse(actualizada));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    private boolean esAdmin(Authentication authentication) {
        return authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
    }

    private CotizacionResponse toResponse(Cotizacion c) {
        return new CotizacionResponse(
            c,
            cotizacionProductoRepository.findByCotizacionIdCotizacion(c.getIdCotizacion()),
            cotizacionServicioRepository.findByCotizacionIdCotizacion(c.getIdCotizacion())
        );
    }
}
