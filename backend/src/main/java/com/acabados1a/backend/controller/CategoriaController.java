package com.acabados1a.backend.controller;

import com.acabados1a.backend.model.CategoriaProducto;
import com.acabados1a.backend.repository.CategoriaProductoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

// RF05 - catálogo organizado por categoría. Tabla real sin datos sensibles - se sirve la entidad
// directamente, sin necesidad de un DTO aparte.
@RestController
@RequestMapping("/api/categorias")
@RequiredArgsConstructor
public class CategoriaController {

    private final CategoriaProductoRepository categoriaProductoRepository;

    @GetMapping
    public List<CategoriaProducto> listar() {
        return categoriaProductoRepository.findAll();
    }
}
