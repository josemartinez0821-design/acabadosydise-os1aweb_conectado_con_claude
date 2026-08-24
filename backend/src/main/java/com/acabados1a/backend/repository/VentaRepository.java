package com.acabados1a.backend.repository;

import com.acabados1a.backend.model.Venta;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VentaRepository extends JpaRepository<Venta, Integer> {
    List<Venta> findByUsuarioIdUsuario(Integer idUsuario);
}
