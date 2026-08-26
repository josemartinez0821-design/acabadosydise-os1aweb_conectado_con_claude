package com.acabados1a.backend.controller;

import com.acabados1a.backend.dto.ErrorResponse;
import com.acabados1a.backend.dto.PromocionRequest;
import com.acabados1a.backend.dto.PromocionResponse;
import com.acabados1a.backend.repository.PromocionRepository;
import com.acabados1a.backend.service.PromocionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// RF18/RF22 - promociones del mes en la home y badges de descuento en el catálogo. listar() sigue
// sin pasar por PromocionService (un findAll() no tiene lógica que orquestar), igual que Producto.
@RestController
@RequestMapping("/api/promociones")
@RequiredArgsConstructor
public class PromocionController {

    private final PromocionRepository promocionRepository;
    private final PromocionService promocionService;

    @GetMapping
    public List<PromocionResponse> listar() {
        return promocionRepository.findAll().stream().map(PromocionResponse::new).toList();
    }

    @PostMapping
    public ResponseEntity<?> crear(@Valid @RequestBody PromocionRequest request) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(new PromocionResponse(promocionService.crear(request)));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Integer id, @Valid @RequestBody PromocionRequest request) {
        try {
            return ResponseEntity.ok(new PromocionResponse(promocionService.actualizar(id, request)));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Integer id) {
        try {
            promocionService.eliminar(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }
}
