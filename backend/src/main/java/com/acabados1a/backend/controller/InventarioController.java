package com.acabados1a.backend.controller;

import com.acabados1a.backend.dto.ErrorResponse;
import com.acabados1a.backend.dto.UmbralesRequest;
import com.acabados1a.backend.model.Inventario;
import com.acabados1a.backend.repository.InventarioRepository;
import com.acabados1a.backend.service.InventarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventario")
@RequiredArgsConstructor
public class InventarioController {

    private final InventarioRepository inventarioRepository;
    private final InventarioService inventarioService;

    @GetMapping
    public List<Inventario> listar() {
        return inventarioRepository.findAll();
    }

    @PutMapping("/{idProducto}/umbrales")
    public ResponseEntity<?> actualizarUmbrales(@PathVariable Integer idProducto, @RequestBody UmbralesRequest request) {
        try {
            return ResponseEntity.ok(inventarioService.actualizarUmbrales(idProducto, request));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }
}
