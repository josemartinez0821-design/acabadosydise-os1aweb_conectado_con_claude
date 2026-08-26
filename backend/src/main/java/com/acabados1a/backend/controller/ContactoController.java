package com.acabados1a.backend.controller;

import com.acabados1a.backend.dto.ContactoRequest;
import com.acabados1a.backend.dto.ErrorResponse;
import com.acabados1a.backend.service.ContactoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

// permitAll (sin regla propia en SecurityConfig, cae en anyRequest().permitAll()) - un visitante
// no logueado también puede escribir desde el formulario público de Contacto.
@RestController
@RequestMapping("/api/contacto")
@RequiredArgsConstructor
public class ContactoController {

    private final ContactoService contactoService;

    @PostMapping
    public ResponseEntity<?> enviar(@Valid @RequestBody ContactoRequest request) {
        try {
            contactoService.enviar(request);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(new ErrorResponse("No se pudo enviar el mensaje. Intenta de nuevo o escríbenos por WhatsApp."));
        }
    }
}
