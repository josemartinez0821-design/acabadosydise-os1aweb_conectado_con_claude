package com.acabados1a.backend.service;

import com.acabados1a.backend.dto.PqrsEstadoRequest;
import com.acabados1a.backend.dto.PqrsRequest;
import com.acabados1a.backend.model.Pqrs;
import com.acabados1a.backend.model.Usuario;
import com.acabados1a.backend.repository.PqrsRepository;
import com.acabados1a.backend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

// Igual que CotizacionService/VentaService: privado por usuario, sin permitAll. A diferencia de
// esas dos, aquí solo el cliente radica (siempre a nombre de sí mismo, no hay "radicar a nombre de
// otro" como en ventas) y solo el admin gestiona (forzado en SecurityConfig con hasRole, no hace
// falta revisar el rol acá para actualizar()).
@Service
@RequiredArgsConstructor
@Transactional
public class PqrsService {

    private final PqrsRepository pqrsRepository;
    private final UsuarioRepository usuarioRepository;

    public List<Pqrs> listarParaUsuario(String email, boolean esAdmin) {
        Usuario actor = resolverUsuario(email);
        return esAdmin ? pqrsRepository.findAll() : pqrsRepository.findByUsuarioIdUsuario(actor.getIdUsuario());
    }

    public Pqrs crear(String email, PqrsRequest request) {
        Usuario actor = resolverUsuario(email);

        Pqrs.Tipo tipo;
        try {
            tipo = Pqrs.Tipo.valueOf(request.getTipo());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("El tipo de solicitud indicado no es válido.");
        }

        Pqrs pqrs = new Pqrs();
        pqrs.setUsuario(actor);
        pqrs.setTipo(tipo);
        pqrs.setAsunto(request.getAsunto());
        pqrs.setDescripcion(request.getDescripcion());
        pqrs.setDepartamento(request.getDepartamento());
        pqrs.setCiudad(request.getCiudad());
        pqrs.setEvidenciaNombre(request.getEvidenciaNombre());
        pqrs.setEstado(Pqrs.Estado.abierto);
        pqrs.setPrioridad(Pqrs.Prioridad.media);

        // numero_pqrs depende del id real (IDENTITY) - mismo truco de placeholder temporal +
        // segundo save() que ya usan codigo_producto/numero_cotizacion/numero_venta.
        pqrs.setNumeroPqrs("TMP-" + UUID.randomUUID());
        Pqrs guardada = pqrsRepository.save(pqrs);
        guardada.setNumeroPqrs("PQRS-" + java.time.LocalDate.now().getYear() + "-" + String.format("%03d", guardada.getIdPqrs()));
        return pqrsRepository.save(guardada);
    }

    public Pqrs actualizar(String email, Integer id, PqrsEstadoRequest request) {
        Usuario actor = resolverUsuario(email);
        Pqrs pqrs = pqrsRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("No existe una PQRS con id " + id + "."));

        Pqrs.Estado nuevoEstado;
        try {
            nuevoEstado = Pqrs.Estado.valueOf(request.getEstado());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("El estado indicado no es válido.");
        }
        Pqrs.Prioridad nuevaPrioridad;
        try {
            nuevaPrioridad = Pqrs.Prioridad.valueOf(request.getPrioridad());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("La prioridad indicada no es válida.");
        }

        pqrs.setEstado(nuevoEstado);
        pqrs.setPrioridad(nuevaPrioridad);
        if (request.getRespuesta() != null) pqrs.setRespuesta(request.getRespuesta());
        // El responsable siempre es quien hace la petición (admin autenticado), nunca un valor del
        // body - mismo principio que "el id_usuario sale del token" en CotizacionService.
        pqrs.setResponsable(actor);

        boolean quedaResuelta = nuevoEstado == Pqrs.Estado.resuelto || nuevoEstado == Pqrs.Estado.cerrado;
        if (quedaResuelta && pqrs.getFechaResolucion() == null) {
            pqrs.setFechaResolucion(LocalDateTime.now());
        }

        return pqrsRepository.save(pqrs);
    }

    private Usuario resolverUsuario(String email) {
        return usuarioRepository.findByEmail(email)
            .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado."));
    }
}
