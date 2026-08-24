package com.acabados1a.backend.repository;

import com.acabados1a.backend.model.CotizacionProducto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CotizacionProductoRepository extends JpaRepository<CotizacionProducto, Integer> {
    List<CotizacionProducto> findByCotizacionIdCotizacion(Integer idCotizacion);
}
