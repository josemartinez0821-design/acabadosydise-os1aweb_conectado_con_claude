package com.acabados1a.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "cotizacion_servicios")
@Getter
@Setter
@NoArgsConstructor
public class CotizacionServicio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_detalle")
    private Integer idDetalle;

    @ManyToOne
    @JoinColumn(name = "id_cotizacion", nullable = false)
    private Cotizacion cotizacion;

    @ManyToOne
    @JoinColumn(name = "id_servicio", nullable = false)
    private Servicio servicio;

    @Column(name = "cantidad", nullable = false)
    private BigDecimal cantidad;

    @Column(name = "precio_estimado", nullable = false)
    private BigDecimal precioEstimado;

    // GENERATED ALWAYS AS (precio_estimado) STORED en la BD.
    @Column(name = "subtotal", insertable = false, updatable = false)
    private BigDecimal subtotal;
}
