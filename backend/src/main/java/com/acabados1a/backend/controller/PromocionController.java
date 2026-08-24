package com.acabados1a.backend.controller;

import com.acabados1a.backend.dto.PromocionResponse;
import com.acabados1a.backend.repository.PromocionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

// RF18/RF22 - promociones del mes en la home y badges de descuento en el catálogo.
@RestController
@RequestMapping("/api/promociones")
@RequiredArgsConstructor
public class PromocionController {

    private final PromocionRepository promocionRepository;

    @GetMapping
    public List<PromocionResponse> listar() {
        return promocionRepository.findAll().stream().map(PromocionResponse::new).toList();
    }
}
