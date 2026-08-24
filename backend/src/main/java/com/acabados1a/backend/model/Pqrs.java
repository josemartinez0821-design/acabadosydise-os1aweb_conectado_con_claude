package com.acabados1a.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "pqrs")
@Getter
@Setter
@NoArgsConstructor
public class Pqrs {

    public enum Tipo { peticion, queja, reclamo, sugerencia, garantia }
    public enum Estado { abierto, en_proceso, resuelto, cerrado }
    public enum Prioridad { baja, media, alta, urgente }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_pqrs")
    private Integer idPqrs;

    @Column(name = "numero_pqrs", nullable = false, unique = true, length = 50)
    private String numeroPqrs;

    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo", nullable = false)
    private Tipo tipo;

    @Column(name = "asunto", nullable = false, length = 200)
    private String asunto;

    @Column(name = "descripcion", nullable = false)
    private String descripcion;

    // Ubicación de la solicitud - puede diferir de la del perfil del usuario (proyecto/dirección
    // distinta). No existía como columna real hasta hoy, ver nota en stores/pqrs.js del mock.
    @Column(name = "departamento", length = 100)
    private String departamento;

    @Column(name = "ciudad", length = 100)
    private String ciudad;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado")
    private Estado estado;

    @Enumerated(EnumType.STRING)
    @Column(name = "prioridad")
    private Prioridad prioridad;

    @Column(name = "fecha_creacion", insertable = false, updatable = false)
    private LocalDateTime fechaCreacion;

    @Column(name = "fecha_resolucion")
    private LocalDateTime fechaResolucion;

    @Column(name = "respuesta")
    private String respuesta;

    @ManyToOne
    @JoinColumn(name = "id_responsable")
    private Usuario responsable;

    // Solo el nombre del archivo (no hay almacenamiento real de archivos todavía) - mismo gap ya
    // documentado en el mock, ahora al menos persiste en vez de perderse al recargar.
    @Column(name = "evidencia_nombre", length = 255)
    private String evidenciaNombre;
}
