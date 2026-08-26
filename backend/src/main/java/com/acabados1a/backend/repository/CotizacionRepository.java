package com.acabados1a.backend.repository;

import com.acabados1a.backend.model.Cotizacion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CotizacionRepository extends JpaRepository<Cotizacion, Integer> {
    List<Cotizacion> findByUsuarioIdUsuario(Integer idUsuario);
    boolean existsByNumeroCotizacion(String numeroCotizacion);
    List<Cotizacion> findByEstadoAndRecordatorioEnviadoFalse(Cotizacion.Estado estado);
}
