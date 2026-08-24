package com.acabados1a.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "promociones")
@Getter
@Setter
@NoArgsConstructor
public class Promocion {

    public enum Tipo { descuento, combo, servicio }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_promocion")
    private Integer idPromocion;

    @Column(name = "titulo", nullable = false, length = 150)
    private String titulo;

    @Column(name = "descripcion")
    private String descripcion;

    @Column(name = "imagen_url")
    private String imagenUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo", nullable = false)
    private Tipo tipo;

    @Column(name = "descuento_porcentaje")
    private BigDecimal descuentoPorcentaje;

    @Column(name = "precio_especial")
    private BigDecimal precioEspecial;

    @Column(name = "fecha_inicio")
    private LocalDate fechaInicio;

    @Column(name = "fecha_fin")
    private LocalDate fechaFin;

    @Column(name = "activo", nullable = false)
    private Boolean activo;

    // Sin entidad Servicio todavía (servicios sigue en MockData) - se guarda como id plano, mismo
    // criterio que id_categoria/id_impuesto aplanados en ProductoResponse.
    @Column(name = "id_servicio")
    private Integer idServicio;

    // Uno o varios productos por promo - un descuento normal tiene uno solo, un combo puede tener
    // varios (ej. Estuco + Rodillo + Brocha). Antes esto no se podía modelar (no había tabla real);
    // ahora que sí se puede tocar el esquema, `promocion_productos` lo soporta de verdad.
    @ManyToMany
    @JoinTable(
        name = "promocion_productos",
        joinColumns = @JoinColumn(name = "id_promocion"),
        inverseJoinColumns = @JoinColumn(name = "id_producto")
    )
    private List<Producto> productos;
}
