package com.acabados1a.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

// Un solo DTO para crear y editar, mismo patrón que ProductoRequest.
@Getter
@Setter
public class ServicioRequest {

    private String codigoServicio;

    @NotBlank(message = "El nombre del servicio es obligatorio.")
    private String nombreServicio;

    private String descripcion;

    @NotNull(message = "El tipo de servicio es obligatorio.")
    private String tipoServicio;

    private Boolean incluyeMateriales;
    private BigDecimal precioHora;
    private BigDecimal precioProyecto;
    private BigDecimal precioDia;
    private Integer duracionEstimadaHoras;
    private String imagenUrl;
    private Integer idImpuesto;
    private Boolean activo;
    private Boolean destacado;
}
