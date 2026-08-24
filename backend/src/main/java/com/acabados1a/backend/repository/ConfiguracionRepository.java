package com.acabados1a.backend.repository;

import com.acabados1a.backend.model.Configuracion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ConfiguracionRepository extends JpaRepository<Configuracion, Integer> {

    Optional<Configuracion> findByClave(String clave);
}
