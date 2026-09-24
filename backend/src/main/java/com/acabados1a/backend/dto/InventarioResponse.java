package com.acabados1a.backend.dto;

import com.acabados1a.backend.model.Inventario;
import lombok.Getter;

import java.time.LocalDateTime;

// Vista completa del inventario, solo para el admin (panel de Inventario, Dashboard, campana de
// stock bajo). Extiende la pública para que ambas compartan los mismos nombres de campo.
@Getter
public class InventarioResponse extends InventarioPublicoResponse {

    private final Integer idInventario;
    private final Integer cantidadReservada;
    private final Integer stockMinimo;
    private final Integer stockMaximo;
    private final String ubicacionBodega;
    private final LocalDateTime fechaUltimaEntrada;
    private final LocalDateTime fechaUltimaSalida;
    private final LocalDateTime fechaUltimaActualizacion;

    public InventarioResponse(Inventario inventario) {
        super(inventario);
        this.idInventario = inventario.getIdInventario();
        this.cantidadReservada = inventario.getCantidadReservada();
        this.stockMinimo = inventario.getStockMinimo();
        this.stockMaximo = inventario.getStockMaximo();
        this.ubicacionBodega = inventario.getUbicacionBodega();
        this.fechaUltimaEntrada = inventario.getFechaUltimaEntrada();
        this.fechaUltimaSalida = inventario.getFechaUltimaSalida();
        this.fechaUltimaActualizacion = inventario.getFechaUltimaActualizacion();
    }
}
