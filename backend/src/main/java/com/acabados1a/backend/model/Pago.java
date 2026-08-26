package com.acabados1a.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "pagos")
@Getter
@Setter
@NoArgsConstructor
public class Pago {

    // 'pendiente' es real desde que existe contraentrega: ese pago no se recibe en el momento de
    // crear la venta (el simulador de pago solo aplica a los métodos que sí se cobran en línea),
    // se completa cuando el admin marca el pedido de recogida como entregado (ver VentaService).
    public enum Estado { pendiente, completado, fallido, reversado }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_pago")
    private Integer idPago;

    @ManyToOne
    @JoinColumn(name = "id_venta", nullable = false)
    private Venta venta;

    @Enumerated(EnumType.STRING)
    @Column(name = "metodo_pago", nullable = false)
    private Venta.MetodoPago metodoPago;

    @Column(name = "valor", nullable = false)
    private BigDecimal valor;

    @Column(name = "fecha", insertable = false, updatable = false)
    private LocalDateTime fecha;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado")
    private Estado estado;

    @Column(name = "transaccion_id", length = 100)
    private String transaccionId;
}
