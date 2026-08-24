package com.acabados1a.backend.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
public class VentaRequest {

    // Solo lo usa un admin para registrar una venta manual a nombre de otro cliente - si quien
    // llama no es admin, el service ignora este campo y usa siempre el usuario del token (ver
    // VentaService.crear, mismo principio de "nunca del body" que ya usa CotizacionService).
    private Integer idUsuario;

    // Puede venir vacío (ej. el anticipo de una cotización, que no tiene ítems propios, solo un
    // pago contra el total de la cotización). @Valid para que si vienen ítems, sus campos también
    // se validen - sin esto un ítem con un campo null llegaba intacto hasta el service y explotaba
    // con NullPointerException en vez de devolver un 400 claro.
    @Valid
    private List<Item> items;

    private BigDecimal subtotal;
    private BigDecimal total;

    @NotBlank(message = "El método de pago es obligatorio.")
    private String metodoPago;

    private Integer idCotizacion;
    private String notasCliente;

    @Getter
    @Setter
    public static class Item {
        @NotNull(message = "El producto del ítem es obligatorio.")
        private Integer idProducto;

        @NotNull(message = "La cantidad del ítem es obligatoria.")
        private Integer cantidad;

        @NotNull(message = "El precio del ítem es obligatorio.")
        private BigDecimal precioVenta;
    }
}
