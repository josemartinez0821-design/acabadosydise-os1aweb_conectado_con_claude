package com.acabados1a.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

// Un solo DTO para crear y editar, igual que ProductoRequest/ServicioRequest. Qué campos son
// realmente obligatorios depende del `tipo` (descuento/combo/servicio) - esa validación vive en
// PromocionService, no aquí, porque las anotaciones @NotNull no pueden ser condicionales.
@Getter
@Setter
public class PromocionRequest {

    @NotBlank(message = "El título de la promoción es obligatorio.")
    private String titulo;

    private String descripcion;
    private String imagenUrl;

    @NotNull(message = "El tipo de promoción es obligatorio.")
    private String tipo;

    private BigDecimal descuentoPorcentaje;
    private BigDecimal precioEspecial;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
    private Boolean activo;
    private Boolean destacado;
    private Integer idServicio;
    private List<Integer> productos;
}
