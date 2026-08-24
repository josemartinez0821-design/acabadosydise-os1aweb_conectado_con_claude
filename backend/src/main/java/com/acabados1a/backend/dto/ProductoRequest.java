package com.acabados1a.backend.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

// Un solo DTO para crear y editar - ProductoFormModal.vue manda la misma forma en los dos casos.
// Los campos que la BD exige (precio_compra/precio_mayorista/descuento_maximo/id_impuesto) pero
// el formulario no pide quedan opcionales aquí a propósito: ProductoService decide su default en
// creación, o los deja intactos en edición si el request no los manda.
@Getter
@Setter
public class ProductoRequest {

    private String codigoProducto;

    @NotBlank(message = "El nombre del producto es obligatorio.")
    private String nombre;

    private String descripcion;
    private String especificacionesTecnicas;
    private String marca;
    private String modelo;
    private String unidadMedida;
    private String presentacion;
    private String color;
    private String acabado;
    private String material;
    private String dimensiones;
    private BigDecimal pesoKg;

    private BigDecimal precioCompra;

    @NotNull(message = "El precio de venta es obligatorio.")
    @DecimalMin(value = "0.0", inclusive = false, message = "El precio de venta debe ser mayor a 0.")
    private BigDecimal precioVenta;

    private BigDecimal precioMayorista;
    private String imagenUrl;
    private Integer idImpuesto;
    private BigDecimal descuentoMaximo;

    @NotNull(message = "La categoría del producto es obligatoria.")
    private Integer idCategoria;

    private Boolean destacado;
    private Boolean activo;
    private Integer stockInicial;
}
