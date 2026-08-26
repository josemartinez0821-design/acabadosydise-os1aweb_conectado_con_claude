package com.acabados1a.backend.repository;

import com.acabados1a.backend.model.Resena;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ResenaRepository extends JpaRepository<Resena, Integer> {
    boolean existsByProductoIdProductoAndUsuarioIdUsuario(Integer idProducto, Integer idUsuario);
}
