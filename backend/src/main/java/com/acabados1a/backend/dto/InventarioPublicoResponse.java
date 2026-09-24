package com.acabados1a.backend.dto;

import com.acabados1a.backend.model.Inventario;
import lombok.Getter;

// Hallazgo A-2 (auditoría cruzada): GET /api/inventario es público porque el catálogo lo necesita
// para mostrar "Disponible / Stock bajo / Agotado", pero devolvía la entidad JPA completa - con
// datos internos de bodega (stock mínimo/máximo, ubicación, cantidad reservada, fechas de entrada y
// salida) - a cualquier visitante sin sesión. Esta es la versión pública: solo lo que el catálogo
// muestra. El admin recibe InventarioResponse, que la extiende con el resto de columnas.
@Getter
public class InventarioPublicoResponse {

    private final Integer idProducto;
    private final Integer cantidadDisponible;
    // Se calcula aquí para que el catálogo pueda marcar "Stock bajo" sin conocer el umbral real.
    private final boolean stockBajo;

    public InventarioPublicoResponse(Inventario inventario) {
        this.idProducto = inventario.getIdProducto();
        this.cantidadDisponible = inventario.getCantidadDisponible();
        this.stockBajo = inventario.getStockMinimo() != null
            && inventario.getCantidadDisponible() <= inventario.getStockMinimo();
    }
}
