package com.acabados1a.backend.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

// "Al menos un ítem" se valida en el service, no aquí - es una regla cruzada entre dos listas,
// no de un solo campo.
@Getter
@Setter
public class CotizacionRequest {

    private String observaciones;
    private String departamento;
    private String ciudad;
    private List<ItemProducto> productos;
    private List<ItemServicio> servicios;

    @Getter
    @Setter
    public static class ItemProducto {
        private Integer idProducto;
        private Integer cantidad;
        private BigDecimal precioUnitario;
    }

    @Getter
    @Setter
    public static class ItemServicio {
        private Integer idServicio;
        private BigDecimal cantidad;
        private BigDecimal precioEstimado;
    }
}
