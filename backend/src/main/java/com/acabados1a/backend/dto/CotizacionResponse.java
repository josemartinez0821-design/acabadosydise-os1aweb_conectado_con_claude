package com.acabados1a.backend.dto;

import com.acabados1a.backend.model.Cotizacion;
import com.acabados1a.backend.model.CotizacionProducto;
import com.acabados1a.backend.model.CotizacionServicio;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

// Trae el usuario anidado (reusa UsuarioResponse - ya tiene todo lo que el admin necesita mostrar
// de contacto) y los ítems planos, igual de simple que el mock: el frontend ya sabe resolver
// nombre/imagen de cada ítem vía catalog.getProductById/getServiceById.
@Getter
public class CotizacionResponse {

    private final Integer idCotizacion;
    private final String numeroCotizacion;
    private final UsuarioResponse usuario;
    private final LocalDateTime fecha;
    private final String estado;
    private final BigDecimal totalEstimado;
    private final String observaciones;
    private final String departamento;
    private final String ciudad;
    private final String respuesta;
    private final Integer validezDias;
    private final LocalDate fechaAprobacion;
    private final List<ItemProductoResponse> productos;
    private final List<ItemServicioResponse> servicios;

    public CotizacionResponse(Cotizacion c, List<CotizacionProducto> productos, List<CotizacionServicio> servicios) {
        this.idCotizacion = c.getIdCotizacion();
        this.numeroCotizacion = c.getNumeroCotizacion();
        this.usuario = new UsuarioResponse(c.getUsuario());
        this.fecha = c.getFecha();
        this.estado = c.getEstado() != null ? c.getEstado().name() : null;
        this.totalEstimado = c.getTotalEstimado();
        this.observaciones = c.getObservaciones();
        this.departamento = c.getDepartamento();
        this.ciudad = c.getCiudad();
        this.respuesta = c.getRespuesta();
        this.validezDias = c.getValidezDias();
        this.fechaAprobacion = c.getFechaAprobacion();
        this.productos = productos.stream().map(ItemProductoResponse::new).toList();
        this.servicios = servicios.stream().map(ItemServicioResponse::new).toList();
    }

    @Getter
    public static class ItemProductoResponse {
        private final Integer idDetalle;
        private final Integer idProducto;
        private final Integer cantidad;
        private final BigDecimal precioUnitario;
        private final BigDecimal subtotal;

        public ItemProductoResponse(CotizacionProducto cp) {
            this.idDetalle = cp.getIdDetalle();
            this.idProducto = cp.getProducto().getIdProducto();
            this.cantidad = cp.getCantidad();
            this.precioUnitario = cp.getPrecioUnitario();
            this.subtotal = cp.getSubtotal();
        }
    }

    @Getter
    public static class ItemServicioResponse {
        private final Integer idDetalle;
        private final Integer idServicio;
        private final BigDecimal cantidad;
        private final BigDecimal precioEstimado;
        private final BigDecimal subtotal;

        public ItemServicioResponse(CotizacionServicio cs) {
            this.idDetalle = cs.getIdDetalle();
            this.idServicio = cs.getServicio().getIdServicio();
            this.cantidad = cs.getCantidad();
            this.precioEstimado = cs.getPrecioEstimado();
            this.subtotal = cs.getSubtotal();
        }
    }
}
