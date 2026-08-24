package com.acabados1a.backend.service;

import com.acabados1a.backend.dto.MovimientoInventarioRequest;
import com.acabados1a.backend.model.Inventario;
import com.acabados1a.backend.model.MovimientoInventario;
import com.acabados1a.backend.model.Producto;
import com.acabados1a.backend.model.Usuario;
import com.acabados1a.backend.repository.InventarioRepository;
import com.acabados1a.backend.repository.MovimientoInventarioRepository;
import com.acabados1a.backend.repository.ProductoRepository;
import com.acabados1a.backend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

// Registro manual de entradas/salidas/ajustes/devoluciones desde el panel de Inventario - las
// ventas y sus cancelaciones/devoluciones NO pasan por aquí (el trigger `after_venta_detalle_insert`
// y VentaService.reponerStock() ya se encargan de esos dos casos, ver memoria del proyecto).
@Service
@RequiredArgsConstructor
@Transactional
public class MovimientoInventarioService {

    // 'venta' queda fuera a propósito: ese tipo solo lo genera el trigger real de la BD, nunca a
    // mano, para que cada fila de ese tipo siempre tenga una venta real detrás.
    private static final Set<String> TIPOS_MANUALES = Set.of("entrada", "salida", "ajuste", "devolucion");

    private final MovimientoInventarioRepository movimientoRepository;
    private final InventarioRepository inventarioRepository;
    private final ProductoRepository productoRepository;
    private final UsuarioRepository usuarioRepository;

    public List<MovimientoInventario> listar() {
        return movimientoRepository.findAll();
    }

    public MovimientoInventario registrar(String email, MovimientoInventarioRequest request) {
        Usuario actor = usuarioRepository.findByEmail(email)
            .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado."));

        if (!TIPOS_MANUALES.contains(request.getTipoMovimiento())) {
            throw new IllegalArgumentException("Este tipo de movimiento no se puede registrar manualmente.");
        }
        MovimientoInventario.TipoMovimiento tipo;
        try {
            tipo = MovimientoInventario.TipoMovimiento.valueOf(request.getTipoMovimiento());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("El tipo de movimiento indicado no es válido.");
        }

        Producto producto = productoRepository.findById(request.getIdProducto())
            .orElseThrow(() -> new IllegalArgumentException("El producto indicado no existe."));
        Inventario inventario = inventarioRepository.findByIdProducto(producto.getIdProducto())
            .orElseThrow(() -> new IllegalArgumentException("El producto no tiene inventario registrado."));

        // Mismo cálculo que el store mock (catalog.js): para 'ajuste' la cantidad ya viene con el
        // signo del cambio (+3/-2); para el resto la dirección la determina el tipo, no quien lo
        // registra.
        int cantidadSolicitada = request.getCantidad();
        int delta = switch (tipo) {
            case ajuste -> cantidadSolicitada;
            case entrada, devolucion -> Math.abs(cantidadSolicitada);
            case salida -> -Math.abs(cantidadSolicitada);
            default -> throw new IllegalArgumentException("Este tipo de movimiento no se puede registrar manualmente.");
        };

        // El cambio real puede quedar por debajo de lo pedido si el stock disponible no alcanzaba
        // (el clamp de abajo lo recorta) - se registra el delta que de verdad se aplicó, no el
        // solicitado, para que el historial de movimientos nunca diga un número que no cuadra con
        // el cambio real de `cantidad_disponible`.
        int cantidadAnterior = inventario.getCantidadDisponible();
        int nuevaCantidad = Math.max(0, cantidadAnterior + delta);
        int deltaAplicado = nuevaCantidad - cantidadAnterior;
        inventario.setCantidadDisponible(nuevaCantidad);
        LocalDateTime ahora = LocalDateTime.now();
        if (deltaAplicado > 0) inventario.setFechaUltimaEntrada(ahora);
        if (deltaAplicado < 0) inventario.setFechaUltimaSalida(ahora);
        inventarioRepository.save(inventario);

        String descripcion = request.getDescripcion() != null && !request.getDescripcion().isBlank()
            ? request.getDescripcion()
            : "Movimiento manual registrado por el administrador";
        int magnitudSolicitada = Math.abs(cantidadSolicitada);
        int magnitudAplicada = Math.abs(deltaAplicado);
        if (magnitudAplicada != magnitudSolicitada) {
            descripcion += " (solicitado: " + magnitudSolicitada + ", aplicado: " + magnitudAplicada + " por límite de stock disponible)";
        }

        MovimientoInventario movimiento = new MovimientoInventario();
        movimiento.setProducto(producto);
        movimiento.setTipoMovimiento(tipo);
        movimiento.setCantidad(magnitudAplicada);
        movimiento.setUsuario(actor);
        movimiento.setDescripcion(descripcion);
        return movimientoRepository.save(movimiento);
    }
}
