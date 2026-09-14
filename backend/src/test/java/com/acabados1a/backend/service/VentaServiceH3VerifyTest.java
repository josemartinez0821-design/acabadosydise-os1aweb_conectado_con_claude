package com.acabados1a.backend.service;

import com.acabados1a.backend.dto.VentaRequest;
import com.acabados1a.backend.model.Inventario;
import com.acabados1a.backend.model.Producto;
import com.acabados1a.backend.model.Usuario;
import com.acabados1a.backend.model.Venta;
import com.acabados1a.backend.repository.InventarioRepository;
import com.acabados1a.backend.repository.ProductoRepository;
import com.acabados1a.backend.repository.UsuarioRepository;
import com.acabados1a.backend.repository.VentaRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.regex.Pattern;

import static org.junit.jupiter.api.Assertions.*;

// Prueba de regresión del hallazgo H-3, contra la BD real (necesita MariaDB corriendo, mismo
// patrón que BackendApplicationTests) - @Transactional revierte todo al terminar, no deja una
// venta de prueba en la BD real. Si alguien reintroduce el segundo save() que pisaba lo que
// generaba el trigger, este test es el que se rompe.
@SpringBootTest
@Transactional
class VentaServiceH3VerifyTest {

    @Autowired VentaService ventaService;
    @Autowired VentaRepository ventaRepository;
    @Autowired UsuarioRepository usuarioRepository;
    @Autowired InventarioRepository inventarioRepository;
    @Autowired ProductoRepository productoRepository;

    @Test
    void numeroVenta_finalEsElQueRealmenteEscribioElTrigger_noUnPlaceholderNiUnDuplicado() {
        Usuario usuario = usuarioRepository.findAll().stream().findFirst()
            .orElseThrow(() -> new IllegalStateException("No hay usuarios en la BD para probar."));
        Inventario conStock = inventarioRepository.findAll().stream()
            .filter(i -> i.getCantidadDisponible() != null && i.getCantidadDisponible() > 0)
            .findFirst()
            .orElseThrow(() -> new IllegalStateException("No hay inventario con stock para probar."));
        Producto producto = productoRepository.findById(conStock.getIdProducto()).orElseThrow();

        VentaRequest.Item item = new VentaRequest.Item();
        item.setIdProducto(producto.getIdProducto());
        item.setCantidad(1);
        item.setPrecioVenta(producto.getPrecioVenta());

        VentaRequest request = new VentaRequest();
        request.setItems(List.of(item));
        request.setMetodoPago("efectivo");
        request.setMetodoEnvio("recogida");

        Venta creada = ventaService.crear(usuario.getEmail(), false, request);

        assertNotNull(creada.getNumeroVenta());
        assertFalse(creada.getNumeroVenta().startsWith("TMP-"), "no debe quedar el placeholder");

        // Lo que devuelve el service debe coincidir EXACTO con lo que de verdad quedó en la BD
        // (columna leída aparte, sin pasar por el objeto Java en memoria) - si algún día alguien
        // reintroduce el segundo save() que pisaba lo que generaba el trigger, este assert es el
        // que se rompe.
        String enLaBaseDeVerdad = ventaRepository.obtenerNumeroVentaReal(creada.getIdVenta());
        assertEquals(enLaBaseDeVerdad, creada.getNumeroVenta());
        // Formato real del trigger (before_venta_insert, ver el .sql de schema):
        // CONCAT('VEN-', DATE_FORMAT(NOW(), '%Y%m%d'), '-', RIGHT(UUID_SHORT(), 5)) - fecha
        // completa + un número no secuencial. Antes de este fix, Java lo sobrescribía con
        // "VEN-" + año + "-" + id con padding de 3 dígitos, un formato totalmente distinto y
        // predecible (secuencial por id_venta) que el trigger nunca tuvo intención de exponer.
        assertTrue(Pattern.matches("VEN-\\d{8}-\\d{5}", enLaBaseDeVerdad),
            "formato real generado por el trigger before_venta_insert: " + enLaBaseDeVerdad);
    }
}
