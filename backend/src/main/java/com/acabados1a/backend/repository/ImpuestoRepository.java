package com.acabados1a.backend.repository;

import com.acabados1a.backend.model.Impuesto;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ImpuestoRepository extends JpaRepository<Impuesto, Integer> {
}
