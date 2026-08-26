package com.acabados1a.backend.service;

import com.acabados1a.backend.dto.ResenaRequest;
import com.acabados1a.backend.model.Producto;
import com.acabados1a.backend.model.Resena;
import com.acabados1a.backend.model.Usuario;
import com.acabados1a.backend.repository.ProductoRepository;
import com.acabados1a.backend.repository.ResenaRepository;
import com.acabados1a.backend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

// Público en el GET (dato de catálogo, como productos/servicios) - el frontend trae todas y
// filtra por producto en cliente, igual que hace con productos/cotizaciones. Privado en el POST
// (SecurityConfig): el autor sale del token, nunca del body, mismo principio que CotizacionService.
@Service
@RequiredArgsConstructor
@Transactional
public class ResenaService {

    private final ResenaRepository resenaRepository;
    private final ProductoRepository productoRepository;
    private final UsuarioRepository usuarioRepository;

    public List<Resena> listar() {
        return resenaRepository.findAll();
    }

    public Resena crear(String email, ResenaRequest request) {
        Usuario usuario = usuarioRepository.findByEmail(email)
            .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado."));
        Producto producto = productoRepository.findById(request.getIdProducto())
            .orElseThrow(() -> new IllegalArgumentException("El producto indicado no existe."));

        if (resenaRepository.existsByProductoIdProductoAndUsuarioIdUsuario(producto.getIdProducto(), usuario.getIdUsuario())) {
            throw new IllegalArgumentException("Ya escribiste una reseña para este producto.");
        }

        Resena resena = new Resena();
        resena.setProducto(producto);
        resena.setUsuario(usuario);
        resena.setCalificacion(request.getCalificacion());
        resena.setComentario(request.getComentario());

        return resenaRepository.save(resena);
    }
}
