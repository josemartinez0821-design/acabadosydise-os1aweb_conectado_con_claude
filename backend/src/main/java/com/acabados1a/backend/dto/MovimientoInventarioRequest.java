package com.acabados1a.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MovimientoInventarioRequest {

    @NotNull(message = "El producto es obligatorio.")
    private Integer idProducto;

    @NotBlank(message = "El tipo de movimiento es obligatorio.")
    private String tipoMovimiento;

    // Para 'ajuste' viene con el signo del cambio (+3/-2); para el resto la dirección la
    // determina el tipo, no este valor - ver MovimientoInventarioService.registrar().
    @NotNull(message = "La cantidad es obligatoria.")
    private Integer cantidad;

    private String descripcion;
}
