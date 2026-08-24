package com.acabados1a.backend.repository;

import com.acabados1a.backend.model.Inventario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface InventarioRepository extends JpaRepository<Inventario, Integer> {
    Optional<Inventario> findByIdProducto(Integer idProducto);
}
