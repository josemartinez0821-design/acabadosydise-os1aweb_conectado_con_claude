package com.acabados1a.backend.service;

import com.acabados1a.backend.dto.ProductoRequest;
import com.acabados1a.backend.model.CategoriaProducto;
import com.acabados1a.backend.model.Impuesto;
import com.acabados1a.backend.model.Inventario;
import com.acabados1a.backend.model.Producto;
import com.acabados1a.backend.repository.CategoriaProductoRepository;
import com.acabados1a.backend.repository.ImpuestoRepository;
import com.acabados1a.backend.repository.InventarioRepository;
import com.acabados1a.backend.repository.ProductoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Set;
import java.util.UUID;

// Producto+Inventario se crean/actualizan juntos (dos repositorios) - @Transactional a nivel de
// clase para que las dos escrituras queden atómicas (si la segunda falla, la primera no se queda
// commiteada sola dejando un producto huérfano sin fila de inventario).
@Service
@RequiredArgsConstructor
@Transactional
public class ProductoService {

    // IVA 19%, la tasa general - default cuando el request no manda id_impuesto.
    private static final int ID_IMPUESTO_GENERAL = 1;
    private static final int STOCK_MINIMO_DEFECTO = 10;
    private static final int STOCK_MAXIMO_DEFECTO = 200;
    private static final String BODEGA_DEFECTO = "Bodega A";

    // Relativo a donde corre el proceso del backend (mvnw.cmd se ejecuta desde backend/, ver
    // launch.json) - no una ruta absoluta, para que funcione igual en cualquier máquina del equipo.
    private static final Path CARPETA_IMAGENES = Paths.get("uploads", "productos");
    private static final String PREFIJO_URL_IMAGENES = "/uploads/productos/";
    private static final Set<String> TIPOS_IMAGEN_PERMITIDOS = Set.of("image/jpeg", "image/png", "image/webp");

    private final ProductoRepository productoRepository;
    private final InventarioRepository inventarioRepository;
    private final CategoriaProductoRepository categoriaProductoRepository;
    private final ImpuestoRepository impuestoRepository;

    public Producto crear(ProductoRequest request) {
        Producto producto = new Producto();
        aplicarCamposComunes(producto, request);

        producto.setCategoria(resolverCategoria(request.getIdCategoria()));
        producto.setImpuesto(resolverImpuesto(
            request.getIdImpuesto() != null ? request.getIdImpuesto() : ID_IMPUESTO_GENERAL));

        // precio_compra/precio_mayorista/descuento_maximo son NOT NULL en la BD pero el
        // formulario no siempre los pide - un NULL explícito desde Java pisa el DEFAULT de la
        // columna en SQL, así que el default hay que aplicarlo aquí, no dejarlo vacío.
        producto.setPrecioCompra(request.getPrecioCompra() != null ? request.getPrecioCompra() : request.getPrecioVenta());
        producto.setPrecioMayorista(request.getPrecioMayorista() != null ? request.getPrecioMayorista() : request.getPrecioVenta());
        producto.setDescuentoMaximo(request.getDescuentoMaximo() != null ? request.getDescuentoMaximo() : BigDecimal.ZERO);
        producto.setDestacado(request.getDestacado() != null ? request.getDestacado() : false);
        producto.setActivo(request.getActivo() != null ? request.getActivo() : true);

        boolean codigoAutogenerado = request.getCodigoProducto() == null || request.getCodigoProducto().isBlank();
        if (codigoAutogenerado) {
            // codigo_producto es NOT NULL UNIQUE - no se puede insertar vacío, y el id real
            // (IDENTITY) solo se conoce después del primer INSERT. Placeholder único temporal,
            // después un segundo save() ya con el código real armado a partir del id.
            producto.setCodigoProducto("TMP-" + UUID.randomUUID());
        } else {
            if (productoRepository.existsByCodigoProducto(request.getCodigoProducto())) {
                throw new IllegalArgumentException("Ya existe un producto con el código " + request.getCodigoProducto() + ".");
            }
            producto.setCodigoProducto(request.getCodigoProducto());
        }

        Producto guardado = productoRepository.save(producto);

        if (codigoAutogenerado) {
            guardado.setCodigoProducto("PROD-" + String.format("%03d", guardado.getIdProducto()));
            guardado = productoRepository.save(guardado);
        }

        crearInventario(guardado.getIdProducto(), request.getStockInicial());

        return guardado;
    }

    public Producto actualizar(Integer id, ProductoRequest request) {
        Producto producto = productoRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("No existe un producto con id " + id + "."));

        aplicarCamposComunes(producto, request);
        producto.setCategoria(resolverCategoria(request.getIdCategoria()));

        // "Ausente" en edición significa "no tocar", no "resetear al default de creación" - si
        // no, cada edición que no incluya descuento_maximo lo dejaría en 0 sin querer.
        if (request.getIdImpuesto() != null) producto.setImpuesto(resolverImpuesto(request.getIdImpuesto()));
        if (request.getPrecioCompra() != null) producto.setPrecioCompra(request.getPrecioCompra());
        if (request.getPrecioMayorista() != null) producto.setPrecioMayorista(request.getPrecioMayorista());
        if (request.getDescuentoMaximo() != null) producto.setDescuentoMaximo(request.getDescuentoMaximo());
        if (request.getDestacado() != null) producto.setDestacado(request.getDestacado());
        if (request.getActivo() != null) producto.setActivo(request.getActivo());
        if (request.getCodigoProducto() != null && !request.getCodigoProducto().isBlank()) {
            producto.setCodigoProducto(request.getCodigoProducto());
        }

        Producto guardado = productoRepository.save(producto);

        if (request.getStockInicial() != null) {
            Inventario inventario = inventarioRepository.findByIdProducto(id).orElse(null);
            if (inventario != null) {
                inventario.setCantidadDisponible(request.getStockInicial());
                inventarioRepository.save(inventario);
            } else {
                // Producto anterior a este cambio que nunca tuvo su fila pareja - se autosana en
                // vez de fallar.
                crearInventario(id, request.getStockInicial());
            }
        }

        return guardado;
    }

    public void eliminar(Integer id) {
        // Soft delete: cotizacion_productos y detalle_ventas tienen ON DELETE RESTRICT contra
        // productos, así que un DELETE real falla apenas el producto ya tiene una cotización o
        // venta real (el caso normal, no la excepción, en este catálogo). La fila de inventario
        // se deja intacta por si el producto se reactiva después vía PUT.
        Producto producto = productoRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("No existe un producto con id " + id + "."));
        producto.setActivo(false);
        productoRepository.save(producto);
    }

    // Guarda el archivo real en disco (no en la BD - imagen_url es VARCHAR(255) y el catálogo
    // público trae los 74+ productos de una sola vez, meter base64 ahí volvería esa respuesta
    // varias veces más pesada). Se sirve después vía WebConfig ("/uploads/**").
    public Producto subirImagen(Integer id, MultipartFile archivo) {
        Producto producto = productoRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("No existe un producto con id " + id + "."));

        if (archivo == null || archivo.isEmpty()) {
            throw new IllegalArgumentException("No se recibió ningún archivo.");
        }
        String tipo = archivo.getContentType();
        if (tipo == null || !TIPOS_IMAGEN_PERMITIDOS.contains(tipo)) {
            throw new IllegalArgumentException("Solo se permiten imágenes JPG, PNG o WEBP.");
        }

        try {
            Files.createDirectories(CARPETA_IMAGENES);
            String extension = switch (tipo) {
                case "image/png" -> ".png";
                case "image/webp" -> ".webp";
                default -> ".jpg";
            };
            String nombreArchivo = "producto-" + id + "-" + UUID.randomUUID() + extension;
            Files.copy(archivo.getInputStream(), CARPETA_IMAGENES.resolve(nombreArchivo), StandardCopyOption.REPLACE_EXISTING);

            // Borra el archivo anterior solo si también era una subida propia - una URL externa
            // (las fotos de stock que ya traían los productos originales) se deja intacta, no es
            // un archivo nuestro para borrar.
            String urlAnterior = producto.getImagenUrl();
            if (urlAnterior != null && urlAnterior.startsWith(PREFIJO_URL_IMAGENES)) {
                Files.deleteIfExists(CARPETA_IMAGENES.resolve(urlAnterior.substring(PREFIJO_URL_IMAGENES.length())));
            }

            producto.setImagenUrl(PREFIJO_URL_IMAGENES + nombreArchivo);
            return productoRepository.save(producto);
        } catch (IOException e) {
            throw new RuntimeException("No se pudo guardar la imagen.", e);
        }
    }

    private void aplicarCamposComunes(Producto producto, ProductoRequest request) {
        producto.setNombre(request.getNombre());
        producto.setDescripcion(request.getDescripcion());
        producto.setEspecificacionesTecnicas(request.getEspecificacionesTecnicas());
        producto.setMarca(request.getMarca());
        producto.setModelo(request.getModelo());
        if (request.getUnidadMedida() != null && !request.getUnidadMedida().isBlank()) {
            producto.setUnidadMedida(Producto.UnidadMedida.valueOf(request.getUnidadMedida()));
        }
        producto.setPresentacion(request.getPresentacion());
        producto.setColor(request.getColor());
        producto.setAcabado(request.getAcabado());
        producto.setMaterial(request.getMaterial());
        producto.setDimensiones(request.getDimensiones());
        producto.setPesoKg(request.getPesoKg());
        producto.setPrecioVenta(request.getPrecioVenta());
        producto.setImagenUrl(request.getImagenUrl());
    }

    private CategoriaProducto resolverCategoria(Integer idCategoria) {
        return categoriaProductoRepository.findById(idCategoria)
            .orElseThrow(() -> new IllegalArgumentException("La categoría indicada no existe."));
    }

    private Impuesto resolverImpuesto(Integer idImpuesto) {
        return impuestoRepository.findById(idImpuesto)
            .orElseThrow(() -> new IllegalArgumentException("El impuesto indicado no existe."));
    }

    private void crearInventario(Integer idProducto, Integer stockInicial) {
        Inventario inventario = new Inventario();
        inventario.setIdProducto(idProducto);
        inventario.setCantidadDisponible(stockInicial != null ? stockInicial : 0);
        inventario.setCantidadReservada(0);
        inventario.setStockMinimo(STOCK_MINIMO_DEFECTO);
        inventario.setStockMaximo(STOCK_MAXIMO_DEFECTO);
        inventario.setUbicacionBodega(BODEGA_DEFECTO);
        inventarioRepository.save(inventario);
    }
}
