package com.acabados1a.backend.dto;

import com.acabados1a.backend.model.Servicio;
import lombok.Getter;

import java.math.BigDecimal;

// Aplana impuesto a id_impuesto, mismo patrón que ProductoResponse.
@Getter
public class ServicioResponse {

    private final Integer idServicio;
    private final String codigoServicio;
    private final String nombreServicio;
    private final String descripcion;
    private final String tipoServicio;
    private final Boolean incluyeMateriales;
    private final BigDecimal precioHora;
    private final BigDecimal precioProyecto;
    private final BigDecimal precioDia;
    private final Integer duracionEstimadaHoras;
    private final String imagenUrl;
    private final Integer idImpuesto;
    private final Boolean activo;
    private final Boolean destacado;

    public ServicioResponse(Servicio s) {
        this.idServicio = s.getIdServicio();
        this.codigoServicio = s.getCodigoServicio();
        this.nombreServicio = s.getNombreServicio();
        this.descripcion = s.getDescripcion();
        this.tipoServicio = s.getTipoServicio() != null ? s.getTipoServicio().name() : null;
        this.incluyeMateriales = s.getIncluyeMateriales();
        this.precioHora = s.getPrecioHora();
        this.precioProyecto = s.getPrecioProyecto();
        this.precioDia = s.getPrecioDia();
        this.duracionEstimadaHoras = s.getDuracionEstimadaHoras();
        this.imagenUrl = s.getImagenUrl();
        this.idImpuesto = s.getImpuesto() != null ? s.getImpuesto().getIdImpuesto() : null;
        this.activo = s.getActivo();
        this.destacado = s.getDestacado();
    }
}
