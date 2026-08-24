package com.acabados1a.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// Escape hatch genérico del esquema congelado — usado hoy para la agrupación de tamaños de
// producto (`grupos_variante_productos`), pensado también para promociones/combos más adelante
// (ver memoria del proyecto: no existe tabla `promociones` real).
@Entity
@Table(name = "configuracion")
@Getter
@Setter
@NoArgsConstructor
public class Configuracion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_config")
    private Integer idConfig;

    @Column(name = "clave", nullable = false, unique = true, length = 50)
    private String clave;

    @Column(name = "valor", nullable = false, columnDefinition = "TEXT")
    private String valor;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo")
    private Tipo tipo;

    @Column(name = "descripcion")
    private String descripcion;

    public enum Tipo { texto, numero, json, imagen, booleano }
}
