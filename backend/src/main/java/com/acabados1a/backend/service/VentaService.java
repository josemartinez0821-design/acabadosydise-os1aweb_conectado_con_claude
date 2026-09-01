package com.acabados1a.backend.service;

import com.acabados1a.backend.dto.VentaEstadoRequest;
import com.acabados1a.backend.dto.VentaNotasRequest;
import com.acabados1a.backend.dto.VentaRequest;
import com.acabados1a.backend.model.*;
import com.acabados1a.backend.repository.*;
import com.acabados1a.backend.util.ObservacionesUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

// Cabecera + detalle + pago se crean juntos, y de paso hay que tocar Inventario (descuenta stock
// y registra el movimiento) - todo en una sola transacción, mismo motivo que CotizacionService: si
// algo falla a mitad de camino no debe quedar una venta a medias con el stock ya descontado.
@Service
@RequiredArgsConstructor
@Transactional
public class VentaService {

    private final VentaRepository ventaRepository;
    private final DetalleVentaRepository detalleVentaRepository;
    private final PagoRepository pagoRepository;
    private final MovimientoInventarioRepository movimientoInventarioRepository;
    private final InventarioRepository inventarioRepository;
    private final UsuarioRepository usuarioRepository;
    private final ProductoRepository productoRepository;
    private final CotizacionRepository cotizacionRepository;
    private final CotizacionServicioRepository cotizacionServicioRepository;
    private final EmailService emailService;

    public List<Venta> listarParaUsuario(String email, boolean esAdmin) {
        Usuario actor = resolverUsuario(email);
        return esAdmin ? ventaRepository.findAll() : ventaRepository.findByUsuarioIdUsuario(actor.getIdUsuario());
    }

    public Venta crear(String email, boolean esAdmin, VentaRequest request) {
        Usuario actor = resolverUsuario(email);

        // Solo un admin puede registrar la venta a nombre de otro cliente (pedido manual por
        // teléfono/WhatsApp) - cualquier otro usuario siempre compra a nombre de sí mismo, sin
        // importar qué id_usuario venga en el body.
        Usuario dueño = actor;
        if (esAdmin && request.getIdUsuario() != null) {
            dueño = usuarioRepository.findById(request.getIdUsuario())
                .orElseThrow(() -> new IllegalArgumentException("El cliente indicado no existe."));
        }

        Venta.MetodoPago metodoPago;
        try {
            metodoPago = Venta.MetodoPago.valueOf(request.getMetodoPago());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("El método de pago indicado no es válido.");
        }

        // metodoEnvio es opcional: el anticipo de una cotización de servicio no envía nada y el
        // frontend no lo manda. Si no viene, se asume 'recogida' (el valor del enum que representa
        // "sin envío"). El null se filtra aparte porque MetodoEnvio.valueOf(null) lanzaría
        // NullPointerException, no IllegalArgumentException, y se escaparía del catch.
        Venta.MetodoEnvio metodoEnvio;
        String metodoEnvioRaw = request.getMetodoEnvio();
        if (metodoEnvioRaw == null || metodoEnvioRaw.isBlank()) {
            metodoEnvio = Venta.MetodoEnvio.recogida;
        } else {
            try {
                metodoEnvio = Venta.MetodoEnvio.valueOf(metodoEnvioRaw);
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("El método de envío indicado no es válido.");
            }
        }

        // Contraentrega es para envío: el cliente paga al recoger el paquete en el local de la
        // transportadora, no en nuestra tienda (recogida en tienda ya es gratis y sin este paso).
        if (metodoPago == Venta.MetodoPago.contraentrega && metodoEnvio != Venta.MetodoEnvio.envio) {
            throw new IllegalArgumentException("Contraentrega solo está disponible para envío.");
        }

        List<VentaRequest.Item> items = request.getItems() != null ? request.getItems() : List.of();

        BigDecimal subtotalCalculado = items.stream()
            .map(i -> i.getPrecioVenta().multiply(BigDecimal.valueOf(i.getCantidad())))
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal subtotal = request.getSubtotal() != null ? request.getSubtotal() : subtotalCalculado;
        BigDecimal total = request.getTotal() != null ? request.getTotal() : subtotal;

        Venta venta = new Venta();
        venta.setUsuario(dueño);
        venta.setSubtotal(subtotal);
        venta.setDescuento(BigDecimal.ZERO);
        venta.setIvaTotal(BigDecimal.ZERO);
        venta.setTotal(total);
        venta.setEstado(Venta.Estado.pendiente);
        venta.setMetodoPago(metodoPago);
        venta.setMetodoEnvio(metodoEnvio);
        venta.setNotasCliente(request.getNotasCliente());

        if (request.getIdCotizacion() != null) {
            Cotizacion cotizacion = cotizacionRepository.findById(request.getIdCotizacion())
                .orElseThrow(() -> new IllegalArgumentException("La cotización indicada no existe."));
            // Un cliente no puede asociar su venta a una cotización ajena (solo la suya) - el
            // admin sí puede, para registrar el anticipo de cualquier cliente a mano.
            if (!esAdmin && !cotizacion.getUsuario().getIdUsuario().equals(actor.getIdUsuario())) {
                throw new IllegalArgumentException("No tienes permiso para asociar esa cotización a la venta.");
            }
            venta.setCotizacion(cotizacion);
        }

        // numero_venta depende del id real (IDENTITY) - mismo truco de placeholder temporal +
        // segundo save() que ya usan codigo_producto/numero_cotizacion.
        venta.setNumeroVenta("TMP-" + UUID.randomUUID());
        Venta guardada = ventaRepository.save(venta);
        guardada.setNumeroVenta("VEN-" + LocalDate.now().getYear() + "-" + String.format("%03d", guardada.getIdVenta()));
        guardada = ventaRepository.save(guardada);

        // Valida stock ANTES de insertar nada - acumulando por producto, porque el mismo producto
        // podría venir repartido en más de un ítem (un cliente API arbitrario podría mandar eso
        // aunque la UI ya los fusiona en uno solo antes de enviar).
        Map<Integer, Integer> cantidadPorProducto = new LinkedHashMap<>();
        for (VentaRequest.Item item : items) {
            cantidadPorProducto.merge(item.getIdProducto(), item.getCantidad(), Integer::sum);
        }
        Map<Integer, Producto> productosPorId = new LinkedHashMap<>();
        for (Map.Entry<Integer, Integer> entry : cantidadPorProducto.entrySet()) {
            Producto producto = productoRepository.findById(entry.getKey())
                .orElseThrow(() -> new IllegalArgumentException("Uno de los productos indicados no existe."));
            Inventario inventario = inventarioRepository.findByIdProducto(producto.getIdProducto())
                .orElseThrow(() -> new IllegalArgumentException("El producto \"" + producto.getNombre() + "\" no tiene inventario registrado."));
            if (inventario.getCantidadDisponible() < entry.getValue()) {
                throw new IllegalArgumentException("No hay suficiente stock de \"" + producto.getNombre()
                    + "\" (disponible: " + inventario.getCantidadDisponible() + ", solicitado: " + entry.getValue() + ").");
            }
            productosPorId.put(entry.getKey(), producto);
        }

        // El descuento de stock + el registro en movimientos_inventario NO se hacen aquí en Java -
        // ya existe un trigger real en la BD (`after_venta_detalle_insert`, ver el .sql de schema)
        // que se dispara solo con este INSERT y hace exactamente eso. Duplicarlo acá restaba el
        // stock dos veces (confirmado probando contra la BD real). Cancelar/devolver sí necesita
        // lógica en Java (reponerStock más abajo) porque no existe un trigger simétrico para eso.
        for (VentaRequest.Item item : items) {
            DetalleVenta detalle = new DetalleVenta();
            detalle.setVenta(guardada);
            detalle.setProducto(productosPorId.get(item.getIdProducto()));
            detalle.setCantidad(item.getCantidad());
            detalle.setPrecioUnitario(item.getPrecioVenta());
            detalleVentaRepository.save(detalle);
        }

        // Los métodos que sí se cobran "en línea" (simulados) quedan completado de una vez, como
        // siempre. Contraentrega no se cobra hasta que el cliente recoge el pedido y paga en
        // persona - queda pendiente hasta que VentaService.actualizarEstado() lo complete solo.
        Pago pago = new Pago();
        pago.setVenta(guardada);
        pago.setMetodoPago(metodoPago);
        pago.setValor(total);
        pago.setEstado(metodoPago == Venta.MetodoPago.contraentrega ? Pago.Estado.pendiente : Pago.Estado.completado);
        pago.setTransaccionId(metodoPago == Venta.MetodoPago.contraentrega ? null : "SIM-" + String.format("%06d", guardada.getIdVenta()));
        pagoRepository.save(pago);

        // Resumen para el correo de confirmación. Los productos salen de este pedido; los servicios,
        // de la cotización asociada (si la hay). El anticipo del 50% de una cotización de solo
        // servicios llega con items vacío -> el correo se arma en "modo anticipo" (encabezado y
        // desglose propios) en vez de mostrar "Productos:" sin nada debajo como antes.
        List<EmailService.LineaResumen> lineasProducto = new ArrayList<>();
        for (VentaRequest.Item item : items) {
            Producto producto = productosPorId.get(item.getIdProducto());
            BigDecimal montoLinea = item.getPrecioVenta().multiply(BigDecimal.valueOf(item.getCantidad()));
            lineasProducto.add(new EmailService.LineaResumen(producto.getNombre(), "x" + item.getCantidad(), montoLinea));
        }

        List<EmailService.LineaResumen> lineasServicio = new ArrayList<>();
        String numeroCotizacion = null;
        BigDecimal saldoPendiente = null;
        String fechaDeseada = null;
        boolean esAnticipoServicio = guardada.getCotizacion() != null && items.isEmpty();
        if (guardada.getCotizacion() != null) {
            Cotizacion cot = guardada.getCotizacion();
            numeroCotizacion = cot.getNumeroCotizacion();
            fechaDeseada = ObservacionesUtil.extraerFechaDeseada(cot.getObservaciones());
            for (CotizacionServicio cs : cotizacionServicioRepository.findByCotizacionIdCotizacion(cot.getIdCotizacion())) {
                Servicio s = cs.getServicio();
                String detalle = EmailService.descripcionCantidadServicio(cs.getCantidad(), s.getPrecioHora() != null, s.getPrecioDia() != null);
                lineasServicio.add(new EmailService.LineaResumen(s.getNombreServicio(), detalle, cs.getPrecioEstimado()));
            }
            if (esAnticipoServicio && cot.getTotalEstimado() != null) {
                saldoPendiente = cot.getTotalEstimado().subtract(total).max(BigDecimal.ZERO);
            }
        }

        emailService.enviarConfirmacionPedido(dueño.getEmail(), new EmailService.DatosConfirmacionPedido(
            guardada.getNumeroVenta(), lineasProducto, lineasServicio, total,
            metodoPago == Venta.MetodoPago.contraentrega, esAnticipoServicio,
            numeroCotizacion, saldoPendiente, fechaDeseada));

        return guardada;
    }

    // Solo lo llama un admin (forzado en SecurityConfig) - marcar despachado/entregado, o
    // cancelar/devolver, que es lo único que de verdad repone stock y reversa el pago.
    public Venta actualizarEstado(String email, Integer id, VentaEstadoRequest request) {
        Usuario actor = resolverUsuario(email);
        Venta venta = ventaRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("No existe una venta con id " + id + "."));

        Venta.Estado nuevoEstado;
        try {
            nuevoEstado = Venta.Estado.valueOf(request.getEstado());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("El estado indicado no es válido.");
        }

        Venta.Estado estadoAnterior = venta.getEstado();
        venta.setEstado(nuevoEstado);

        boolean recienEntregado = nuevoEstado == Venta.Estado.entregado && estadoAnterior != Venta.Estado.entregado;
        if (recienEntregado) {
            if (venta.getFechaEntregaReal() == null) venta.setFechaEntregaReal(LocalDate.now());

            // La guía solo aplica a envío (un pedido de recogida no pasa por transportadora) - si
            // el admin la manda igual para un pedido de recogida, se ignora a propósito.
            if (venta.getMetodoEnvio() == Venta.MetodoEnvio.envio) {
                if (request.getNumeroGuia() != null && !request.getNumeroGuia().isBlank()) venta.setNumeroGuia(request.getNumeroGuia());
                if (request.getTransportadora() != null && !request.getTransportadora().isBlank()) venta.setTransportadora(request.getTransportadora());
            }

            // Contraentrega (siempre de envío): el cliente paga al recoger en el local de la
            // transportadora, y el negocio no se conecta con ninguna API para saber el momento
            // exacto en que eso pasa - a propósito, se simplifica marcando el pago como recibido
            // en el mismo clic de "despachado", sin un paso aparte para confirmarlo después.
            for (Pago pago : pagoRepository.findByVentaIdVenta(id)) {
                if (pago.getMetodoPago() == Venta.MetodoPago.contraentrega && pago.getEstado() == Pago.Estado.pendiente) {
                    pago.setEstado(Pago.Estado.completado);
                    pagoRepository.save(pago);
                }
            }

            emailService.enviarNotificacionDespacho(venta.getUsuario().getEmail(), venta.getNumeroVenta(), venta.getNumeroGuia(), venta.getTransportadora());
        }

        boolean esCancelacion = nuevoEstado == Venta.Estado.cancelado || nuevoEstado == Venta.Estado.devuelto;
        boolean yaEstabaCancelada = estadoAnterior == Venta.Estado.cancelado || estadoAnterior == Venta.Estado.devuelto;
        if (esCancelacion && !yaEstabaCancelada) {
            String accion = nuevoEstado == Venta.Estado.cancelado ? "Cancelación" : "Devolución";
            String motivoCliente = request.getMotivo() != null && !request.getMotivo().isBlank() ? request.getMotivo().trim() : null;
            String descripcionMovimiento = accion + " del pedido " + venta.getNumeroVenta() + (motivoCliente != null ? ": " + motivoCliente : "");
            for (DetalleVenta detalle : detalleVentaRepository.findByVentaIdVenta(id)) {
                reponerStock(detalle.getProducto(), detalle.getCantidad(), actor, descripcionMovimiento);
            }
            // Queda también en las notas internas (no solo en el historial de movimientos) para que
            // se vea de una vez al abrir el pedido en el panel, sin tener que ir a buscarlo en Inventario.
            if (motivoCliente != null) {
                String notaMotivo = "Motivo de la " + accion.toLowerCase() + ": " + motivoCliente;
                venta.setNotasInternas(venta.getNotasInternas() == null || venta.getNotasInternas().isBlank()
                    ? notaMotivo : venta.getNotasInternas() + "\n" + notaMotivo);
            }
            boolean reembolsoPendiente = false;
            for (Pago pago : pagoRepository.findByVentaIdVenta(id)) {
                if (pago.getEstado() != Pago.Estado.pendiente) {
                    reembolsoPendiente = true;
                    pago.setEstado(Pago.Estado.reversado);
                    pagoRepository.save(pago);
                }
            }
            emailService.enviarNotificacionCancelacion(venta.getUsuario().getEmail(), venta.getNumeroVenta(),
                nuevoEstado == Venta.Estado.devuelto, reembolsoPendiente);
        }

        return ventaRepository.save(venta);
    }

    public Venta actualizarNotas(Integer id, VentaNotasRequest request) {
        Venta venta = ventaRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("No existe una venta con id " + id + "."));
        if (request.getNotasInternas() != null) venta.setNotasInternas(request.getNotasInternas());
        if (request.getFechaEntregaEstimada() != null) {
            try {
                venta.setFechaEntregaEstimada(LocalDate.parse(request.getFechaEntregaEstimada()));
            } catch (DateTimeParseException e) {
                throw new IllegalArgumentException("La fecha de entrega estimada no tiene un formato válido.");
            }
        }
        return ventaRepository.save(venta);
    }

    private void reponerStock(Producto producto, int cantidad, Usuario actor, String descripcion) {
        Inventario inventario = inventarioRepository.findByIdProducto(producto.getIdProducto()).orElse(null);
        if (inventario == null) return;
        inventario.setCantidadDisponible(inventario.getCantidadDisponible() + cantidad);
        inventario.setFechaUltimaEntrada(LocalDateTime.now());
        inventarioRepository.save(inventario);

        registrarMovimiento(producto, MovimientoInventario.TipoMovimiento.devolucion, cantidad, actor, descripcion);
    }

    private void registrarMovimiento(Producto producto, MovimientoInventario.TipoMovimiento tipo, int cantidad, Usuario actor, String descripcion) {
        MovimientoInventario movimiento = new MovimientoInventario();
        movimiento.setProducto(producto);
        movimiento.setTipoMovimiento(tipo);
        movimiento.setCantidad(Math.abs(cantidad));
        movimiento.setUsuario(actor);
        movimiento.setDescripcion(descripcion);
        movimientoInventarioRepository.save(movimiento);
    }

    private Usuario resolverUsuario(String email) {
        return usuarioRepository.findByEmail(email)
            .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado."));
    }
}
