package com.acabados1a.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PqrsRequest {

    @NotBlank(message = "El tipo es obligatorio.")
    private String tipo;

    @NotBlank(message = "El asunto es obligatorio.")
    private String asunto;

    @NotBlank(message = "La descripción es obligatoria.")
    private String descripcion;

    private String departamento;
    private String ciudad;
    private String evidenciaNombre;
}
