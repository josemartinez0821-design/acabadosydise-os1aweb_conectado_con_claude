package com.acabados1a.backend.dto;

import com.acabados1a.backend.model.Producto;
import lombok.Getter;

import java.math.BigDecimal;

// Aplana categoria/impuesto a id_categoria/id_impuesto — mismo formato que ya usa mockData.js,
// para que el frontend no tenga que cambiar cómo lee un producto.
@Getter
public class ProductoResponse {

    private final Integer idProducto;
    private final String codigoProducto;
    private final String nombre;
    private final String descripcion;
    private final String especificacionesTecnicas;
    private final String marca;
    private final String modelo;
    private final String unidadMedida;
    private final String presentacion;
    private final String color;
    private final String acabado;
    private final String material;
    private final String dimensiones;
    private final BigDecimal pesoKg;
    private final BigDecimal precioCompra;
    private final BigDecimal precioVenta;
    private final BigDecimal precioMayorista;
    private final String imagenUrl;
    private final Integer idImpuesto;
    private final BigDecimal descuentoMaximo;
    private final Integer idCategoria;
    private final Boolean destacado;
    private final Boolean activo;

    public ProductoResponse(Producto p) {
        this.idProducto = p.getIdProducto();
        this.codigoProducto = p.getCodigoProducto();
        this.nombre = p.getNombre();
        this.descripcion = p.getDescripcion();
        this.especificacionesTecnicas = p.getEspecificacionesTecnicas();
        this.marca = p.getMarca();
        this.modelo = p.getModelo();
        this.unidadMedida = p.getUnidadMedida() != null ? p.getUnidadMedida().name() : null;
        this.presentacion = p.getPresentacion();
        this.color = p.getColor();
        this.acabado = p.getAcabado();
        this.material = p.getMaterial();
        this.dimensiones = p.getDimensiones();
        this.pesoKg = p.getPesoKg();
        this.precioCompra = p.getPrecioCompra();
        this.precioVenta = p.getPrecioVenta();
        this.precioMayorista = p.getPrecioMayorista();
        this.imagenUrl = p.getImagenUrl();
        this.idImpuesto = p.getImpuesto() != null ? p.getImpuesto().getIdImpuesto() : null;
        this.descuentoMaximo = p.getDescuentoMaximo();
        this.idCategoria = p.getCategoria() != null ? p.getCategoria().getIdCategoria() : null;
        this.destacado = p.getDestacado();
        this.activo = p.getActivo();
    }
}
