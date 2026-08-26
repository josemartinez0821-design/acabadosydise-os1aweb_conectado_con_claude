package com.acabados1a.backend.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResenaRequest {

    @NotNull(message = "El producto es obligatorio.")
    private Integer idProducto;

    @NotNull(message = "La calificación es obligatoria.")
    @Min(value = 1, message = "La calificación debe ser entre 1 y 5.")
    @Max(value = 5, message = "La calificación debe ser entre 1 y 5.")
    private Integer calificacion;

    private String comentario;
}
