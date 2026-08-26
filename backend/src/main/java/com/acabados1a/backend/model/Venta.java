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
    // 'contraentrega' sí es real en los dos (agregado junto con metodo_envio) - solo se usa cuando
    // metodoEnvio=envio (el cliente paga al recoger en el local de la transportadora, no en
    // nuestra tienda), ver VentaService.
    public enum MetodoPago { efectivo, transferencia, tarjeta, nequi, daviplata, contraentrega }

    // Qué elige el cliente en el checkout - antes se calculaba el costo con esto pero no quedaba
    // guardado en ningún lado, así que un pedido ya hecho no se podía distinguir de otro (RF de
    // seguimiento de pedidos). 'envio' es la única compatible con MetodoPago.contraentrega.
    public enum MetodoEnvio { envio, recogida }

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

    @Enumerated(EnumType.STRING)
    @Column(name = "metodo_envio", nullable = false)
    private MetodoEnvio metodoEnvio;

    // Los llena el admin al despachar un pedido de envío (ver VentaService.actualizarEstado) - se
    // guardan tal cual los entrega la transportadora en papel/PDF, no hay integración con ninguna
    // API de transportadora.
    @Column(name = "numero_guia", length = 100)
    private String numeroGuia;

    @Column(name = "transportadora", length = 100)
    private String transportadora;

    @Column(name = "notas_cliente")
    private String notasCliente;

    @Column(name = "notas_internas")
    private String notasInternas;

    @Column(name = "fecha_entrega_estimada")
    private LocalDate fechaEntregaEstimada;

    @Column(name = "fecha_entrega_real")
    private LocalDate fechaEntregaReal;
}
