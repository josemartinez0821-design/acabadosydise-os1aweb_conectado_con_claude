package com.acabados1a.backend.service;

import com.acabados1a.backend.dto.UmbralesRequest;
import com.acabados1a.backend.model.Inventario;
import com.acabados1a.backend.repository.InventarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class InventarioService {

    private final InventarioRepository inventarioRepository;

    public Inventario actualizarUmbrales(Integer idProducto, UmbralesRequest request) {
        Inventario inventario = inventarioRepository.findByIdProducto(idProducto)
            .orElseThrow(() -> new IllegalArgumentException("El producto no tiene inventario registrado."));
        if (request.getStockMinimo() != null) inventario.setStockMinimo(request.getStockMinimo());
        if (request.getStockMaximo() != null) inventario.setStockMaximo(request.getStockMaximo());
        if (request.getUbicacionBodega() != null) inventario.setUbicacionBodega(request.getUbicacionBodega());
        return inventarioRepository.save(inventario);
    }
}
