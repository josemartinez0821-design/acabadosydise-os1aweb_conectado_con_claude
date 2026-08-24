package com.acabados1a.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class CotizacionEstadoRequest {

    @NotBlank(message = "El estado es obligatorio.")
    private String estado;

    private String respuesta;

    // Solo lo aplica el admin al aprobar - ver CotizacionService.actualizarEstado().
    private BigDecimal totalEstimado;
}
