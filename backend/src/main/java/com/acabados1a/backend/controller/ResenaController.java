package com.acabados1a.backend.controller;

import com.acabados1a.backend.dto.ErrorResponse;
import com.acabados1a.backend.dto.ResenaRequest;
import com.acabados1a.backend.dto.ResenaResponse;
import com.acabados1a.backend.model.Resena;
import com.acabados1a.backend.service.ResenaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resenas")
@RequiredArgsConstructor
public class ResenaController {

    private final ResenaService resenaService;

    // permitAll (SecurityConfig no tiene regla propia para este GET) - dato público de catálogo.
    @GetMapping
    public List<ResenaResponse> listar() {
        return resenaService.listar().stream().map(ResenaResponse::new).toList();
    }

    // authenticated (ver SecurityConfig) - cualquier cliente logueado, no solo admin.
    @PostMapping
    public ResponseEntity<?> crear(Authentication authentication, @Valid @RequestBody ResenaRequest request) {
        try {
            Resena creada = resenaService.crear(authentication.getName(), request);
            return ResponseEntity.status(HttpStatus.CREATED).body(new ResenaResponse(creada));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }
}
