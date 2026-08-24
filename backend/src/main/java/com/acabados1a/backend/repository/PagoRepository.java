package com.acabados1a.backend.repository;

import com.acabados1a.backend.model.Pago;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PagoRepository extends JpaRepository<Pago, Integer> {
    List<Pago> findByVentaIdVenta(Integer idVenta);
}
