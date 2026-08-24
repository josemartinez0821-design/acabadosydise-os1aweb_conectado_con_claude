package com.acabados1a.backend.repository;

import com.acabados1a.backend.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductoRepository extends JpaRepository<Producto, Integer> {
    boolean existsByCodigoProducto(String codigoProducto);
}
