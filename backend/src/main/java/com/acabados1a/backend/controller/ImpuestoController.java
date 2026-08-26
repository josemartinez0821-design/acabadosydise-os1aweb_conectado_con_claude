package com.acabados1a.backend.controller;

import com.acabados1a.backend.model.Impuesto;
import com.acabados1a.backend.repository.ImpuestoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

// Tabla real sin datos sensibles - se sirve la entidad directamente, mismo criterio que
// CategoriaController. Antes el frontend resolvía el detalle de un impuesto (nombre/valor) contra
// MockData.impuestos, que ya no coincide con los ids reales (mock: 1=19%/2=5%/3=Exento; real:
// 1=19%/2=Exento/4=5%) - por ejemplo un producto realmente exento (id_impuesto=2) se mostraba
// como si tuviera 5% de IVA.
@RestController
@RequestMapping("/api/impuestos")
@RequiredArgsConstructor
public class ImpuestoController {

    private final ImpuestoRepository impuestoRepository;

    @GetMapping
    public List<Impuesto> listar() {
        return impuestoRepository.findAll();
    }
}
