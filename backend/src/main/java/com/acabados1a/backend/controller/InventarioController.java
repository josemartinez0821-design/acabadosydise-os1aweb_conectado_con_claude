package com.acabados1a.backend.controller;

import com.acabados1a.backend.dto.ErrorResponse;
import com.acabados1a.backend.dto.InventarioPublicoResponse;
import com.acabados1a.backend.dto.InventarioResponse;
import com.acabados1a.backend.dto.UmbralesRequest;
import com.acabados1a.backend.model.Inventario;
import com.acabados1a.backend.repository.InventarioRepository;
import com.acabados1a.backend.service.InventarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventario")
@RequiredArgsConstructor
public class InventarioController {

    private final InventarioRepository inventarioRepository;
    private final InventarioService inventarioService;

    // Hallazgo A-2: el GET sigue siendo público (el catálogo lo necesita), pero ya no devuelve la
    // entidad JPA cruda - un visitante o cliente recibe solo cantidad disponible + stock_bajo, y el
    // admin la vista completa con umbrales, ubicación y fechas.
    @GetMapping
    public List<InventarioPublicoResponse> listar(Authentication authentication) {
        boolean admin = esAdmin(authentication);
        return inventarioRepository.findAll().stream().map(inv -> aResponse(inv, admin)).toList();
    }

    // Faltaba del todo: no había forma de consultar el inventario de UN solo producto sin pedir
    // la lista completa (GET /api/inventario) y filtrar del lado del cliente. Mismo patrón de
    // manejo 404 ya usado en Productos/Servicios (findById + notFound) tras el hallazgo H-1.
    @GetMapping("/{idProducto}")
    public ResponseEntity<InventarioPublicoResponse> obtener(Authentication authentication, @PathVariable Integer idProducto) {
        boolean admin = esAdmin(authentication);
        return inventarioRepository.findByIdProducto(idProducto)
            .map(inv -> ResponseEntity.ok(aResponse(inv, admin)))
            .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{idProducto}/umbrales")
    public ResponseEntity<?> actualizarUmbrales(@PathVariable Integer idProducto, @RequestBody UmbralesRequest request) {
        try {
            return ResponseEntity.ok(new InventarioResponse(inventarioService.actualizarUmbrales(idProducto, request)));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    private InventarioPublicoResponse aResponse(Inventario inventario, boolean admin) {
        return admin ? new InventarioResponse(inventario) : new InventarioPublicoResponse(inventario);
    }

    // authentication llega null cuando el visitante no tiene sesión (el GET es permitAll).
    private boolean esAdmin(Authentication authentication) {
        return authentication != null
            && authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
    }
}
