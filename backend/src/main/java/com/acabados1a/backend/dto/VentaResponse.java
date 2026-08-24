package com.acabados1a.backend.dto;

import com.acabados1a.backend.model.DetalleVenta;
import com.acabados1a.backend.model.Pago;
import com.acabados1a.backend.model.Venta;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

// Trae el usuario anidado (igual que CotizacionResponse) y además un id_usuario plano - a
// diferencia de cotizaciones, ventas se filtra/agrupa por cliente en varios sitios del admin
// (búsqueda, "clientes frecuentes", exportar CSV), así que tener el id suelto evita reconstruirlo
// desde el objeto anidado en cada uno de esos puntos.
@Getter
public class VentaResponse {

    private final Integer idVenta;
    private final String numeroVenta;
    private final Integer idUsuario;
    private final UsuarioResponse usuario;
    private final Integer idCotizacion;
    private final LocalDateTime fecha;
    private final BigDecimal subtotal;
    private final BigDecimal descuento;
    private final BigDecimal ivaTotal;
    private final BigDecimal total;
    private final String estado;
    private final String metodoPago;
    private final String notasCliente;
    private final String notasInternas;
    private final LocalDate fechaEntregaEstimada;
    private final LocalDate fechaEntregaReal;
    private final List<ItemResponse> items;
    private final List<PagoResponse> pagos;

    public VentaResponse(Venta v, List<DetalleVenta> items, List<Pago> pagos) {
        this.idVenta = v.getIdVenta();
        this.numeroVenta = v.getNumeroVenta();
        this.idUsuario = v.getUsuario().getIdUsuario();
        this.usuario = new UsuarioResponse(v.getUsuario());
        this.idCotizacion = v.getCotizacion() != null ? v.getCotizacion().getIdCotizacion() : null;
        this.fecha = v.getFecha();
        this.subtotal = v.getSubtotal();
        this.descuento = v.getDescuento();
        this.ivaTotal = v.getIvaTotal();
        this.total = v.getTotal();
        this.estado = v.getEstado() != null ? v.getEstado().name() : null;
        this.metodoPago = v.getMetodoPago() != null ? v.getMetodoPago().name() : null;
        this.notasCliente = v.getNotasCliente();
        this.notasInternas = v.getNotasInternas();
        this.fechaEntregaEstimada = v.getFechaEntregaEstimada();
        this.fechaEntregaReal = v.getFechaEntregaReal();
        this.items = items.stream().map(ItemResponse::new).toList();
        this.pagos = pagos.stream().map(PagoResponse::new).toList();
    }

    @Getter
    public static class ItemResponse {
        private final Integer idDetalle;
        private final Integer idProducto;
        private final Integer cantidad;
        private final BigDecimal precioUnitario;
        private final BigDecimal subtotal;

        public ItemResponse(DetalleVenta d) {
            this.idDetalle = d.getIdDetalle();
            this.idProducto = d.getProducto().getIdProducto();
            this.cantidad = d.getCantidad();
            this.precioUnitario = d.getPrecioUnitario();
            this.subtotal = d.getSubtotal();
        }
    }

    @Getter
    public static class PagoResponse {
        private final Integer idPago;
        private final String metodoPago;
        private final BigDecimal valor;
        private final LocalDateTime fecha;
        private final String estado;
        private final String transaccionId;

        public PagoResponse(Pago p) {
            this.idPago = p.getIdPago();
            this.metodoPago = p.getMetodoPago() != null ? p.getMetodoPago().name() : null;
            this.valor = p.getValor();
            this.fecha = p.getFecha();
            this.estado = p.getEstado() != null ? p.getEstado().name() : null;
            this.transaccionId = p.getTransaccionId();
        }
    }
}
