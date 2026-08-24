package com.acabados1a.backend.dto;

// `codigo` es opcional (null en casi todos los casos) - solo se usa cuando el frontend necesita
// distinguir programáticamente una causa de error específica sin comparar el texto de `mensaje`,
// que puede cambiar de redacción en cualquier momento (ver AuthController.login()).
public record ErrorResponse(String mensaje, String codigo) {
    public ErrorResponse(String mensaje) {
        this(mensaje, null);
    }
}
