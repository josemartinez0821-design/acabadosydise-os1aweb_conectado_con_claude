package com.acabados1a.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "impuestos")
@Getter
@Setter
@NoArgsConstructor
public class Impuesto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_impuesto")
    private Integer idImpuesto;

    @Column(name = "nombre", nullable = false, unique = true, length = 50)
    private String nombre;

    @Column(name = "valor", nullable = false)
    private java.math.BigDecimal valor;

    @Column(name = "descripcion")
    private String descripcion;

    @Column(name = "aplica_productos")
    private Boolean aplicaProductos;

    @Column(name = "aplica_servicios")
    private Boolean aplicaServicios;

    @Column(name = "estado")
    private Boolean estado;
}
