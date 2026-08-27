package com.acabados1a.backend.controller;

import com.acabados1a.backend.dto.ErrorResponse;
import com.acabados1a.backend.dto.ProductoRequest;
import com.acabados1a.backend.dto.ProductoResponse;
import com.acabados1a.backend.repository.ProductoRepository;
import com.acabados1a.backend.service.ProductoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

// RF05/RF06 - catálogo de productos. listar() sigue sin pasar por ProductoService (un findAll()
// no tiene lógica que orquestar); crear/actualizar/eliminar sí, por eso delegan.
@RestController
@RequestMapping("/api/productos")
@RequiredArgsConstructor
public class ProductoController {

    private final ProductoRepository productoRepository;
    private final ProductoService productoService;

    @GetMapping
    public List<ProductoResponse> listar() {
        return productoRepository.findAll().stream().map(ProductoResponse::new).toList();
    }

    @PostMapping
    public ResponseEntity<?> crear(@Valid @RequestBody ProductoRequest request) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(new ProductoResponse(productoService.crear(request)));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Integer id, @Valid @RequestBody ProductoRequest request) {
        try {
            return ResponseEntity.ok(new ProductoResponse(productoService.actualizar(id, request)));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Integer id) {
        try {
            productoService.eliminar(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @PostMapping("/{id}/imagen")
    public ResponseEntity<?> subirImagen(@PathVariable Integer id, @RequestParam("archivo") MultipartFile archivo) {
        try {
            return ResponseEntity.ok(new ProductoResponse(productoService.subirImagen(id, archivo)));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }
}
