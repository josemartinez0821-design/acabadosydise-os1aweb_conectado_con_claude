package com.acabados1a.backend.dto;

import com.acabados1a.backend.model.Resena;
import lombok.Getter;

import java.time.LocalDate;

// usuario anidado (nombre/apellido) - así el frontend deja de resolver el autor contra
// MockData.usuarios, mismo criterio que PqrsResponse/CotizacionResponse/VentaResponse.
@Getter
public class ResenaResponse {

    private final Integer idResena;
    private final Integer idProducto;
    private final UsuarioResponse usuario;
    private final Integer calificacion;
    private final String comentario;
    private final LocalDate fecha;

    public ResenaResponse(Resena r) {
        this.idResena = r.getIdResena();
        this.idProducto = r.getProducto().getIdProducto();
        this.usuario = new UsuarioResponse(r.getUsuario());
        this.calificacion = r.getCalificacion();
        this.comentario = r.getComentario();
        this.fecha = r.getFecha();
    }
}
