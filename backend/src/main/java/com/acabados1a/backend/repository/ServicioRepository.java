package com.acabados1a.backend.repository;

import com.acabados1a.backend.model.Servicio;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ServicioRepository extends JpaRepository<Servicio, Integer> {
    boolean existsByCodigoServicio(String codigoServicio);
}
