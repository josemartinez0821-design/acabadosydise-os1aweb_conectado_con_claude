package com.acabados1a.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VentaEstadoRequest {

    @NotBlank(message = "El estado es obligatorio.")
    private String estado;
}
