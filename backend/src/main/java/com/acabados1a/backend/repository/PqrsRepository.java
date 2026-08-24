package com.acabados1a.backend.repository;

import com.acabados1a.backend.model.Pqrs;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PqrsRepository extends JpaRepository<Pqrs, Integer> {
    List<Pqrs> findByUsuarioIdUsuario(Integer idUsuario);
}
