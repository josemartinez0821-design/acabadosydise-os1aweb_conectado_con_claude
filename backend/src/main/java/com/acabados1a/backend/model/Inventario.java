package com.acabados1a.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "inventario")
@Getter
@Setter
@NoArgsConstructor
public class Inventario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_inventario")
    private Integer idInventario;

    @Column(name = "id_producto", nullable = false, unique = true)
    private Integer idProducto;

    @Column(name = "cantidad_disponible", nullable = false)
    private Integer cantidadDisponible;

    @Column(name = "cantidad_reservada")
    private Integer cantidadReservada;

    @Column(name = "stock_minimo")
    private Integer stockMinimo;

    @Column(name = "stock_maximo")
    private Integer stockMaximo;

    @Column(name = "ubicacion_bodega", length = 100)
    private String ubicacionBodega;

    @Column(name = "fecha_ultima_entrada")
    private LocalDateTime fechaUltimaEntrada;

    @Column(name = "fecha_ultima_salida")
    private LocalDateTime fechaUltimaSalida;

    @Column(name = "fecha_ultima_actualizacion", insertable = false, updatable = false)
    private LocalDateTime fechaUltimaActualizacion;
}
