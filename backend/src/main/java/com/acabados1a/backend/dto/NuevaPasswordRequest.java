package com.acabados1a.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NuevaPasswordRequest {

    @NotBlank(message = "El correo es obligatorio.")
    private String email;

    @NotBlank(message = "El código es obligatorio.")
    private String codigo;

    @NotBlank(message = "La contraseña es obligatoria.")
    @Size(min = 8, message = "La contraseña debe tener al menos 8 caracteres.")
    private String password;
}
