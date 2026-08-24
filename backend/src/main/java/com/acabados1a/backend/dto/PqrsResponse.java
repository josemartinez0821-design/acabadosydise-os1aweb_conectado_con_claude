package com.acabados1a.backend.dto;

import com.acabados1a.backend.model.Pqrs;
import lombok.Getter;

import java.time.LocalDateTime;

// Mismo criterio que VentaResponse: id_usuario plano (AdminPqrsView filtra/agrupa por cliente en
// varios sitios) además del usuario anidado (nombre/email/teléfono para la tarjeta de contacto y
// el link de WhatsApp).
@Getter
public class PqrsResponse {

    private final Integer idPqrs;
    private final String numeroPqrs;
    private final Integer idUsuario;
    private final UsuarioResponse usuario;
    private final String tipo;
    private final String asunto;
    private final String descripcion;
    private final String departamento;
    private final String ciudad;
    private final String estado;
    private final String prioridad;
    private final LocalDateTime fechaCreacion;
    private final LocalDateTime fechaResolucion;
    private final String respuesta;
    private final Integer idResponsable;
    private final String evidenciaNombre;

    public PqrsResponse(Pqrs p) {
        this.idPqrs = p.getIdPqrs();
        this.numeroPqrs = p.getNumeroPqrs();
        this.idUsuario = p.getUsuario().getIdUsuario();
        this.usuario = new UsuarioResponse(p.getUsuario());
        this.tipo = p.getTipo() != null ? p.getTipo().name() : null;
        this.asunto = p.getAsunto();
        this.descripcion = p.getDescripcion();
        this.departamento = p.getDepartamento();
        this.ciudad = p.getCiudad();
        this.estado = p.getEstado() != null ? p.getEstado().name() : null;
        this.prioridad = p.getPrioridad() != null ? p.getPrioridad().name() : null;
        this.fechaCreacion = p.getFechaCreacion();
        this.fechaResolucion = p.getFechaResolucion();
        this.respuesta = p.getRespuesta();
        this.idResponsable = p.getResponsable() != null ? p.getResponsable().getIdUsuario() : null;
        this.evidenciaNombre = p.getEvidenciaNombre();
    }
}
