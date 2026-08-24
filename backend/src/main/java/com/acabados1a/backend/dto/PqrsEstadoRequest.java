package com.acabados1a.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PqrsEstadoRequest {

    @NotBlank(message = "El estado es obligatorio.")
    private String estado;

    private String respuesta;

    @NotBlank(message = "La prioridad es obligatoria.")
    private String prioridad;
}
