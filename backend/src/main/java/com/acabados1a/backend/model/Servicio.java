package com.acabados1a.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "servicios")
@Getter
@Setter
@NoArgsConstructor
public class Servicio {

    public enum TipoServicio {
        diseño_interiores, diseño_exteriores, asesoria, instalacion, aplicacion_pintura,
        drywall, pvc, mantenimiento, consultoria
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_servicio")
    private Integer idServicio;

    @Column(name = "codigo_servicio", nullable = false, unique = true, length = 50)
    private String codigoServicio;

    @Column(name = "nombre_servicio", nullable = false, length = 150)
    private String nombreServicio;

    @Column(name = "descripcion")
    private String descripcion;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_servicio", nullable = false)
    private TipoServicio tipoServicio;

    @Column(name = "incluye_materiales")
    private Boolean incluyeMateriales;

    @Column(name = "precio_hora")
    private BigDecimal precioHora;

    @Column(name = "precio_proyecto")
    private BigDecimal precioProyecto;

    @Column(name = "precio_dia")
    private BigDecimal precioDia;

    @Column(name = "duracion_estimada_horas")
    private Integer duracionEstimadaHoras;

    @Column(name = "imagen_url")
    private String imagenUrl;

    @ManyToOne
    @JoinColumn(name = "id_impuesto")
    private Impuesto impuesto;

    @Column(name = "activo")
    private Boolean activo;

    @Column(name = "destacado")
    private Boolean destacado;
}
