package com.acabados1a.backend.service;

import com.acabados1a.backend.dto.ServicioRequest;
import com.acabados1a.backend.model.Impuesto;
import com.acabados1a.backend.model.Servicio;
import com.acabados1a.backend.repository.ImpuestoRepository;
import com.acabados1a.backend.repository.ServicioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class ServicioService {

    // IVA 19%, la tasa general - default cuando el request no manda id_impuesto.
    private static final int ID_IMPUESTO_GENERAL = 1;

    private final ServicioRepository servicioRepository;
    private final ImpuestoRepository impuestoRepository;

    public Servicio crear(ServicioRequest request) {
        Servicio servicio = new Servicio();
        aplicarCamposComunes(servicio, request);

        servicio.setImpuesto(resolverImpuesto(
            request.getIdImpuesto() != null ? request.getIdImpuesto() : ID_IMPUESTO_GENERAL));
        servicio.setIncluyeMateriales(request.getIncluyeMateriales() != null ? request.getIncluyeMateriales() : false);
        servicio.setDestacado(request.getDestacado() != null ? request.getDestacado() : false);
        servicio.setActivo(request.getActivo() != null ? request.getActivo() : true);

        boolean codigoAutogenerado = request.getCodigoServicio() == null || request.getCodigoServicio().isBlank();
        if (codigoAutogenerado) {
            // codigo_servicio es NOT NULL UNIQUE - no se puede insertar vacío, y el id real
            // (IDENTITY) solo se conoce después del primer INSERT. Mismo truco que ProductoService.
            servicio.setCodigoServicio("TMP-" + UUID.randomUUID());
        } else {
            if (servicioRepository.existsByCodigoServicio(request.getCodigoServicio())) {
                throw new IllegalArgumentException("Ya existe un servicio con el código " + request.getCodigoServicio() + ".");
            }
            servicio.setCodigoServicio(request.getCodigoServicio());
        }

        Servicio guardado = servicioRepository.save(servicio);

        if (codigoAutogenerado) {
            guardado.setCodigoServicio("SERV-" + String.format("%03d", guardado.getIdServicio()));
            guardado = servicioRepository.save(guardado);
        }

        return guardado;
    }

    public Servicio actualizar(Integer id, ServicioRequest request) {
        Servicio servicio = servicioRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("No existe un servicio con id " + id + "."));

        aplicarCamposComunes(servicio, request);

        // "Ausente" en edición significa "no tocar", no "resetear al default de creación".
        if (request.getIdImpuesto() != null) servicio.setImpuesto(resolverImpuesto(request.getIdImpuesto()));
        if (request.getIncluyeMateriales() != null) servicio.setIncluyeMateriales(request.getIncluyeMateriales());
        if (request.getDestacado() != null) servicio.setDestacado(request.getDestacado());
        if (request.getActivo() != null) servicio.setActivo(request.getActivo());
        if (request.getCodigoServicio() != null && !request.getCodigoServicio().isBlank()) {
            servicio.setCodigoServicio(request.getCodigoServicio());
        }

        return servicioRepository.save(servicio);
    }

    public void eliminar(Integer id) {
        // Soft delete: cotizacion_servicios tiene ON DELETE RESTRICT contra servicios, mismo
        // motivo que productos - un DELETE real falla apenas el servicio ya tiene una cotización.
        Servicio servicio = servicioRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("No existe un servicio con id " + id + "."));
        servicio.setActivo(false);
        servicioRepository.save(servicio);
    }

    private void aplicarCamposComunes(Servicio servicio, ServicioRequest request) {
        servicio.setNombreServicio(request.getNombreServicio());
        servicio.setDescripcion(request.getDescripcion());
        servicio.setTipoServicio(Servicio.TipoServicio.valueOf(request.getTipoServicio()));
        servicio.setPrecioHora(request.getPrecioHora());
        servicio.setPrecioProyecto(request.getPrecioProyecto());
        servicio.setPrecioDia(request.getPrecioDia());
        servicio.setDuracionEstimadaHoras(request.getDuracionEstimadaHoras());
        servicio.setImagenUrl(request.getImagenUrl());
    }

    private Impuesto resolverImpuesto(Integer idImpuesto) {
        return impuestoRepository.findById(idImpuesto)
            .orElseThrow(() -> new IllegalArgumentException("El impuesto indicado no existe."));
    }
}
