package com.acabados1a.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "ventas")
@Getter
@Setter
@NoArgsConstructor
public class Venta {

    public enum Estado { pendiente, confirmado, preparando, despacho, enviado, entregado, cancelado, devuelto, garantia }

    // El ENUM real de `ventas.metodo_pago` también admite 'pendiente', pero la app nunca lo
    // escribe (siempre manda un método real desde el formulario) - se omite aquí a propósito
    // para poder compartir este mismo enum con `pagos.metodo_pago`, que no tiene ese valor.
    public enum MetodoPago { efectivo, transferencia, tarjeta, nequi, daviplata }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_venta")
    private Integer idVenta;

    @Column(name = "numero_venta", nullable = false, unique = true, length = 50)
    private String numeroVenta;

    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "id_cotizacion")
    private Cotizacion cotizacion;

    @Column(name = "fecha", insertable = false, updatable = false)
    private LocalDateTime fecha;

    @Column(name = "subtotal")
    private BigDecimal subtotal;

    @Column(name = "descuento")
    private BigDecimal descuento;

    @Column(name = "iva_total")
    private BigDecimal ivaTotal;

    @Column(name = "total", nullable = false)
    private BigDecimal total;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado")
    private Estado estado;

    @Enumerated(EnumType.STRING)
    @Column(name = "metodo_pago")
    private MetodoPago metodoPago;

    @Column(name = "notas_cliente")
    private String notasCliente;

    @Column(name = "notas_internas")
    private String notasInternas;

    @Column(name = "fecha_entrega_estimada")
    private LocalDate fechaEntregaEstimada;

    @Column(name = "fecha_entrega_real")
    private LocalDate fechaEntregaReal;
}
