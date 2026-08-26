package com.acabados1a.backend.service;

import com.acabados1a.backend.dto.AvatarRequest;
import com.acabados1a.backend.dto.CambiarPasswordRequest;
import com.acabados1a.backend.dto.UsuarioUpdateRequest;
import com.acabados1a.backend.model.Usuario;
import com.acabados1a.backend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    // Datos personales + avatar: el dueño de la cuenta o un admin pueden editarlos (mismo patrón
    // de ownership que Cotizacion/Venta) - aunque hoy el único consumidor real es Perfil editando
    // lo suyo, no una pantalla admin de "editar cualquier cliente" (esa se declinó explícitamente).
    public Usuario actualizar(String email, boolean esAdmin, Integer idObjetivo, UsuarioUpdateRequest request) {
        Usuario actor = resolverUsuario(email);
        Usuario objetivo = resolverObjetivo(actor, esAdmin, idObjetivo);

        objetivo.setNombre(request.getNombre().trim());
        objetivo.setApellido(request.getApellido().trim());
        if (request.getTipoIdentificacion() != null && !request.getTipoIdentificacion().isBlank()) {
            try {
                objetivo.setTipoIdentificacion(Usuario.TipoIdentificacion.valueOf(request.getTipoIdentificacion()));
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("El tipo de identificación indicado no es válido.");
            }
        }
        objetivo.setNumeroIdentificacion(request.getNumeroIdentificacion());
        objetivo.setTelefono(request.getTelefono());
        objetivo.setWhatsapp(request.getWhatsapp());
        objetivo.setDireccion(request.getDireccion());
        objetivo.setCiudad(request.getCiudad());
        objetivo.setDepartamento(request.getDepartamento());

        return usuarioRepository.save(objetivo);
    }

    public Usuario actualizarAvatar(String email, boolean esAdmin, Integer idObjetivo, AvatarRequest request) {
        Usuario actor = resolverUsuario(email);
        Usuario objetivo = resolverObjetivo(actor, esAdmin, idObjetivo);
        objetivo.setAvatar(request.getAvatar());
        return usuarioRepository.save(objetivo);
    }

    // A propósito sin bypass de admin - cambiar la contraseña de otro requiere saber la actual,
    // que un admin no tiene. Si algún día un admin necesita "resetear" la de alguien más, eso es
    // el flujo de recuperar-contraseña por correo que ya existe, no este endpoint.
    public Usuario cambiarPassword(String email, Integer idObjetivo, CambiarPasswordRequest request) {
        Usuario actor = resolverUsuario(email);
        if (!actor.getIdUsuario().equals(idObjetivo)) {
            throw new IllegalArgumentException("No tienes permiso para cambiar la contraseña de otra cuenta.");
        }
        if (!passwordEncoder.matches(request.getPasswordActual(), actor.getPasswordHash())) {
            throw new IllegalArgumentException("La contraseña actual es incorrecta.");
        }
        actor.setPasswordHash(passwordEncoder.encode(request.getPasswordNueva()));
        return usuarioRepository.save(actor);
    }

    private Usuario resolverObjetivo(Usuario actor, boolean esAdmin, Integer idObjetivo) {
        if (actor.getIdUsuario().equals(idObjetivo)) return actor;
        if (!esAdmin) throw new IllegalArgumentException("No tienes permiso para editar esta cuenta.");
        return usuarioRepository.findById(idObjetivo)
            .orElseThrow(() -> new IllegalArgumentException("El usuario indicado no existe."));
    }

    private Usuario resolverUsuario(String email) {
        return usuarioRepository.findByEmail(email)
            .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado."));
    }
}
