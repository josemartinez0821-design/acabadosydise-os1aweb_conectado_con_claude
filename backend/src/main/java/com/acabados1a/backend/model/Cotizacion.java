package com.acabados1a.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "cotizaciones")
@Getter
@Setter
@NoArgsConstructor
public class Cotizacion {

    public enum Estado { pendiente, en_revision, aprobada, rechazada, convertida_venta }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_cotizacion")
    private Integer idCotizacion;

    @Column(name = "numero_cotizacion", nullable = false, unique = true, length = 50)
    private String numeroCotizacion;

    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @Column(name = "fecha", insertable = false, updatable = false)
    private LocalDateTime fecha;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado")
    private Estado estado;

    @Column(name = "total_estimado")
    private BigDecimal totalEstimado;

    @Column(name = "observaciones")
    private String observaciones;

    @Column(name = "respuesta")
    private String respuesta;

    @Column(name = "validez_dias")
    private Integer validezDias;

    @Column(name = "fecha_aprobacion")
    private LocalDate fechaAprobacion;

    // Evita que CotizacionService.enviarRecordatoriosVencimiento() mande el mismo correo dos
    // veces si el job corre más de una vez el mismo día (reinicio del server, etc.).
    @Column(name = "recordatorio_enviado", nullable = false)
    private Boolean recordatorioEnviado = false;

    // Ubicación de ESTA solicitud, no necesariamente la del perfil del cliente (puede pedir un
    // servicio en un lugar distinto a su dirección registrada) - nullable porque las cotizaciones
    // creadas antes de este campo no lo tienen. Mismo patrón que Pqrs.departamento/ciudad.
    @Column(name = "departamento", length = 100)
    private String departamento;

    @Column(name = "ciudad", length = 100)
    private String ciudad;
}
