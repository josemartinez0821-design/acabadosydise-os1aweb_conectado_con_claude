package com.acabados1a.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "productos")
@Getter
@Setter
@NoArgsConstructor
public class Producto {

    public enum UnidadMedida { unidad, metro2, metro, litro, galon, kilogramo, caja, rollo, bulto }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_producto")
    private Integer idProducto;

    @Column(name = "codigo_producto", nullable = false, unique = true, length = 50)
    private String codigoProducto;

    @Column(name = "nombre", nullable = false, length = 150)
    private String nombre;

    @Column(name = "descripcion")
    private String descripcion;

    @Column(name = "especificaciones_tecnicas")
    private String especificacionesTecnicas;

    @Column(name = "marca", length = 100)
    private String marca;

    @Column(name = "modelo", length = 100)
    private String modelo;

    @Enumerated(EnumType.STRING)
    @Column(name = "unidad_medida")
    private UnidadMedida unidadMedida;

    @Column(name = "presentacion", length = 50)
    private String presentacion;

    @Column(name = "color", length = 50)
    private String color;

    @Column(name = "acabado", length = 50)
    private String acabado;

    @Column(name = "material", length = 100)
    private String material;

    @Column(name = "dimensiones", length = 100)
    private String dimensiones;

    @Column(name = "peso_kg")
    private BigDecimal pesoKg;

    @Column(name = "precio_compra", nullable = false)
    private BigDecimal precioCompra;

    @Column(name = "precio_venta", nullable = false)
    private BigDecimal precioVenta;

    @Column(name = "precio_mayorista", nullable = false)
    private BigDecimal precioMayorista;

    @Column(name = "imagen_url")
    private String imagenUrl;

    @ManyToOne
    @JoinColumn(name = "id_impuesto")
    private Impuesto impuesto;

    @Column(name = "descuento_maximo", nullable = false)
    private BigDecimal descuentoMaximo;

    @ManyToOne
    @JoinColumn(name = "id_categoria")
    private CategoriaProducto categoria;

    @Column(name = "destacado")
    private Boolean destacado;

    @Column(name = "activo")
    private Boolean activo;

    @Column(name = "fecha_creacion", insertable = false, updatable = false)
    private LocalDateTime fechaCreacion;
}
