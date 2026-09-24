package com.acabados1a.backend.controller;

import com.acabados1a.backend.dto.ErrorResponse;
import com.acabados1a.backend.dto.ServicioRequest;
import com.acabados1a.backend.dto.ServicioResponse;
import com.acabados1a.backend.repository.ServicioRepository;
import com.acabados1a.backend.service.ServicioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// Sin RF oficial (ampliación del alcance, ver docs/MATRIZ_TRAZABILIDAD.md) - catálogo de servicios. listar() no pasa por ServicioService (un findAll() no tiene
// lógica que orquestar); crear/actualizar/eliminar sí, por eso delegan.
@RestController
@RequestMapping("/api/servicios")
@RequiredArgsConstructor
public class ServicioController {

    private final ServicioRepository servicioRepository;
    private final ServicioService servicioService;

    @GetMapping
    public List<ServicioResponse> listar() {
        return servicioRepository.findAll().stream().map(ServicioResponse::new).toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ServicioResponse> obtener(@PathVariable Integer id) {
        return servicioRepository.findById(id)
            .map(servicio -> ResponseEntity.ok(new ServicioResponse(servicio)))
            .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> crear(@Valid @RequestBody ServicioRequest request) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(new ServicioResponse(servicioService.crear(request)));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Integer id, @Valid @RequestBody ServicioRequest request) {
        try {
            return ResponseEntity.ok(new ServicioResponse(servicioService.actualizar(id, request)));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Integer id) {
        try {
            servicioService.eliminar(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }
}
