package com.acabados1a.backend.repository;

import com.acabados1a.backend.model.DetalleVenta;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DetalleVentaRepository extends JpaRepository<DetalleVenta, Integer> {
    List<DetalleVenta> findByVentaIdVenta(Integer idVenta);
}
