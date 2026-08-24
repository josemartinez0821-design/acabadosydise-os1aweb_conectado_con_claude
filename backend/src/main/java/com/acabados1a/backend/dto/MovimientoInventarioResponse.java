package com.acabados1a.backend.dto;

import com.acabados1a.backend.model.MovimientoInventario;
import lombok.Getter;

import java.time.LocalDateTime;

// Igual que Venta/PqrsResponse: id_usuario plano + usuario anidado (AdminInventarioView.vue
// resolvía el nombre de quien registró el movimiento vía MockData.usuarios, ahora ya no hace falta).
@Getter
public class MovimientoInventarioResponse {

    private final Integer idMovimiento;
    private final Integer idProducto;
    private final String tipoMovimiento;
    private final Integer cantidad;
    private final LocalDateTime fecha;
    private final Integer idUsuario;
    private final UsuarioResponse usuario;
    private final String descripcion;

    public MovimientoInventarioResponse(MovimientoInventario m) {
        this.idMovimiento = m.getIdMovimiento();
        this.idProducto = m.getProducto().getIdProducto();
        this.tipoMovimiento = m.getTipoMovimiento() != null ? m.getTipoMovimiento().name() : null;
        this.cantidad = m.getCantidad();
        this.fecha = m.getFecha();
        this.idUsuario = m.getUsuario().getIdUsuario();
        this.usuario = new UsuarioResponse(m.getUsuario());
        this.descripcion = m.getDescripcion();
    }
}
