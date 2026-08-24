package com.acabados1a.backend.dto;

import com.acabados1a.backend.model.Usuario;
import lombok.Getter;

// Forma exacta que ya espera frontend/src/stores/auth.js: setSession(token, usuario).
@Getter
public class LoginResponse {

    private final String token;
    private final UsuarioResponse usuario;

    public LoginResponse(String token, Usuario usuario) {
        this.token = token;
        this.usuario = new UsuarioResponse(usuario);
    }
}
