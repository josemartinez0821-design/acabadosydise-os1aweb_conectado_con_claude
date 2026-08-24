package com.acabados1a.backend.repository;

import com.acabados1a.backend.model.MovimientoInventario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MovimientoInventarioRepository extends JpaRepository<MovimientoInventario, Integer> {
    List<MovimientoInventario> findByProductoIdProducto(Integer idProducto);
}
