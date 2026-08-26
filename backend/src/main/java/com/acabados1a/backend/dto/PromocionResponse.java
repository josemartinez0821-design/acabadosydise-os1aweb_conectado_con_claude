package com.acabados1a.backend.dto;

import com.acabados1a.backend.model.Promocion;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Getter
public class PromocionResponse {

    private final Integer idPromocion;
    private final String titulo;
    private final String descripcion;
    private final String imagenUrl;
    private final String tipo;
    private final BigDecimal descuentoPorcentaje;
    private final BigDecimal precioEspecial;
    private final LocalDate fechaInicio;
    private final LocalDate fechaFin;
    private final Boolean activo;
    private final Boolean destacado;
    private final Integer idServicio;
    private final List<Integer> productos;

    public PromocionResponse(Promocion p) {
        this.idPromocion = p.getIdPromocion();
        this.titulo = p.getTitulo();
        this.descripcion = p.getDescripcion();
        this.imagenUrl = p.getImagenUrl();
        this.tipo = p.getTipo() != null ? p.getTipo().name() : null;
        this.descuentoPorcentaje = p.getDescuentoPorcentaje();
        this.precioEspecial = p.getPrecioEspecial();
        this.fechaInicio = p.getFechaInicio();
        this.fechaFin = p.getFechaFin();
        this.activo = p.getActivo();
        this.destacado = p.getDestacado();
        this.idServicio = p.getIdServicio();
        this.productos = p.getProductos() == null ? List.of() : p.getProductos().stream().map(pr -> pr.getIdProducto()).toList();
    }
}
