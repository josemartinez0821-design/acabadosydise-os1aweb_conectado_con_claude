package com.acabados1a.backend.repository;

import com.acabados1a.backend.model.Venta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface VentaRepository extends JpaRepository<Venta, Integer> {
    List<Venta> findByUsuarioIdUsuario(Integer idUsuario);

    // Lectura nativa (no un find()/entidad) a propósito: el trigger before_venta_insert genera el
    // numero_venta real durante el INSERT, pero el first-level cache de Hibernate sigue devolviendo
    // el valor que Java mandó (el placeholder "TMP-...") si se vuelve a pedir la misma entidad por
    // id - hace falta leer la columna directo de la BD para ver lo que el trigger de verdad escribió.
    @Query(value = "SELECT numero_venta FROM ventas WHERE id_venta = :idVenta", nativeQuery = true)
    String obtenerNumeroVentaReal(@Param("idVenta") Integer idVenta);
}
