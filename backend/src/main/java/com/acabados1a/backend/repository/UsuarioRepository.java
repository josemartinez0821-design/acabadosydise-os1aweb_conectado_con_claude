package com.acabados1a.backend.repository;

import com.acabados1a.backend.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {

    Optional<Usuario> findByEmail(String email);

    boolean existsByEmail(String email);

    boolean existsByNumeroIdentificacion(String numeroIdentificacion);

    List<Usuario> findByRolIdRol(Integer idRol);
}
