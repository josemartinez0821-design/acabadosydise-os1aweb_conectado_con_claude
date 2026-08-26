package com.acabados1a.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "resenas_productos")
@Getter
@Setter
@NoArgsConstructor
public class Resena {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_resena")
    private Integer idResena;

    @ManyToOne
    @JoinColumn(name = "id_producto", nullable = false)
    private Producto producto;

    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @Column(name = "calificacion", nullable = false)
    private Integer calificacion;

    @Column(name = "comentario")
    private String comentario;

    // Default de BD (CURRENT_DATE) - mismo patrón que Cotizacion.fecha.
    @Column(name = "fecha", insertable = false, updatable = false)
    private LocalDate fecha;
}
