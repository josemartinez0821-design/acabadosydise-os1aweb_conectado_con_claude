package com.acabados1a.backend.service;

import com.acabados1a.backend.dto.PromocionRequest;
import com.acabados1a.backend.model.Producto;
import com.acabados1a.backend.model.Promocion;
import com.acabados1a.backend.repository.ProductoRepository;
import com.acabados1a.backend.repository.PromocionRepository;
import com.acabados1a.backend.repository.ServicioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class PromocionService {

    private final PromocionRepository promocionRepository;
    private final ProductoRepository productoRepository;
    private final ServicioRepository servicioRepository;

    public Promocion crear(PromocionRequest request) {
        Promocion promocion = new Promocion();
        aplicarCampos(promocion, request);
        return promocionRepository.save(promocion);
    }

    public Promocion actualizar(Integer id, PromocionRequest request) {
        Promocion promocion = promocionRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("No existe una promoción con id " + id + "."));
        aplicarCampos(promocion, request);
        return promocionRepository.save(promocion);
    }

    public void eliminar(Integer id) {
        // Hard delete real, a diferencia de productos/servicios: confirmado en information_schema
        // que lo único que referencia id_promocion es promocion_productos, con ON DELETE CASCADE
        // (no hace falta confiar en comentarios/suposiciones - misma lección aprendida con el FK
        // real de promociones.id_servicio durante la migración de servicios). Una promoción es un
        // dato de mercadeo temporal, no un historial de ventas, así que no necesita activo=false.
        if (!promocionRepository.existsById(id)) {
            throw new IllegalArgumentException("No existe una promoción con id " + id + ".");
        }
        promocionRepository.deleteById(id);
    }

    private void aplicarCampos(Promocion promocion, PromocionRequest request) {
        Promocion.Tipo tipo;
        try {
            tipo = Promocion.Tipo.valueOf(request.getTipo());
        } catch (IllegalArgumentException | NullPointerException e) {
            throw new IllegalArgumentException("El tipo de promoción indicado no es válido.");
        }

        List<Producto> productos = resolverProductos(request.getProductos());
        validarSegunTipo(tipo, productos, request);

        promocion.setTitulo(request.getTitulo());
        promocion.setDescripcion(request.getDescripcion());
        promocion.setImagenUrl(request.getImagenUrl());
        promocion.setTipo(tipo);
        promocion.setDescuentoPorcentaje(request.getDescuentoPorcentaje());
        promocion.setPrecioEspecial(request.getPrecioEspecial());
        promocion.setFechaInicio(request.getFechaInicio());
        promocion.setFechaFin(request.getFechaFin());
        promocion.setActivo(request.getActivo() != null ? request.getActivo() : true);
        promocion.setDestacado(request.getDestacado() != null ? request.getDestacado() : false);
        // Limpia el campo del "otro" eje (servicio vs productos) al guardar - evita que quede un
        // id_servicio fantasma de una edición anterior si el admin cambia el tipo de la promoción.
        promocion.setIdServicio(tipo == Promocion.Tipo.servicio ? request.getIdServicio() : null);
        promocion.setProductos(tipo == Promocion.Tipo.servicio ? List.of() : productos);
    }

    private List<Producto> resolverProductos(List<Integer> ids) {
        if (ids == null || ids.isEmpty()) return List.of();
        List<Producto> productos = productoRepository.findAllById(ids);
        if (productos.size() != ids.size()) {
            throw new IllegalArgumentException("Uno o más productos seleccionados ya no existen.");
        }
        return productos;
    }

    private void validarSegunTipo(Promocion.Tipo tipo, List<Producto> productos, PromocionRequest request) {
        if (request.getFechaInicio() != null && request.getFechaFin() != null
            && request.getFechaFin().isBefore(request.getFechaInicio())) {
            throw new IllegalArgumentException("La fecha de fin no puede ser anterior a la fecha de inicio.");
        }
        boolean tienePrecio = request.getDescuentoPorcentaje() != null || request.getPrecioEspecial() != null;
        switch (tipo) {
            case descuento -> {
                if (productos.size() != 1) {
                    throw new IllegalArgumentException("Un descuento normal necesita exactamente 1 producto.");
                }
                if (!tienePrecio) {
                    throw new IllegalArgumentException("Indica un porcentaje de descuento o un precio especial.");
                }
            }
            case combo -> {
                if (productos.size() < 2) {
                    throw new IllegalArgumentException("Un combo necesita al menos 2 productos.");
                }
                if (request.getPrecioEspecial() == null) {
                    throw new IllegalArgumentException("Un combo necesita el precio del paquete.");
                }
            }
            case servicio -> {
                if (request.getIdServicio() == null) {
                    throw new IllegalArgumentException("Selecciona el servicio de la promoción.");
                }
                if (!servicioRepository.existsById(request.getIdServicio())) {
                    throw new IllegalArgumentException("El servicio indicado no existe.");
                }
                if (!tienePrecio) {
                    throw new IllegalArgumentException("Indica un porcentaje de descuento o un precio especial.");
                }
            }
        }
    }
}
