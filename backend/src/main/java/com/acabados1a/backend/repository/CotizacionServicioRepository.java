package com.acabados1a.backend.repository;

import com.acabados1a.backend.model.CotizacionServicio;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CotizacionServicioRepository extends JpaRepository<CotizacionServicio, Integer> {
    List<CotizacionServicio> findByCotizacionIdCotizacion(Integer idCotizacion);
}
