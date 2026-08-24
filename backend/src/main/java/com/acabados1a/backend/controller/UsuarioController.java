package com.acabados1a.backend.controller;

import com.acabados1a.backend.dto.UsuarioResponse;
import com.acabados1a.backend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

// Único uso hoy: el selector de cliente en "Nueva venta" (AdminVentasView) - no es la página
// admin de "Clientes" que el usuario declinó explícitamente (ver memoria del proyecto), solo una
// lista corta para elegir a quién se le registra un pedido manual por teléfono/WhatsApp.
@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
public class UsuarioController {

    private static final int ID_ROL_CLIENTE = 2;

    private final UsuarioRepository usuarioRepository;

    @GetMapping("/clientes")
    public List<UsuarioResponse> listarClientes() {
        return usuarioRepository.findByRolIdRol(ID_ROL_CLIENTE).stream().map(UsuarioResponse::new).toList();
    }
}
