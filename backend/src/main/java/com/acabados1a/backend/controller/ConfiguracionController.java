package com.acabados1a.backend.controller;

import com.acabados1a.backend.model.Configuracion;
import com.acabados1a.backend.repository.ConfiguracionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

// Genérico — cualquier fila de `configuracion` por su clave. El frontend decide qué hacer con
// `valor` según `tipo` (ej. JSON.parse si tipo === 'json').
@RestController
@RequestMapping("/api/configuracion")
@RequiredArgsConstructor
public class ConfiguracionController {

    private final ConfiguracionRepository configuracionRepository;

    @GetMapping("/{clave}")
    public ResponseEntity<Configuracion> obtener(@PathVariable String clave) {
        return configuracionRepository.findByClave(clave)
            .map(ResponseEntity::ok)
            .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
