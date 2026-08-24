package com.acabados1a.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VerificarCodigoRequest {

    @NotBlank(message = "El correo es obligatorio.")
    private String email;

    @NotBlank(message = "El código es obligatorio.")
    private String codigo;
}
