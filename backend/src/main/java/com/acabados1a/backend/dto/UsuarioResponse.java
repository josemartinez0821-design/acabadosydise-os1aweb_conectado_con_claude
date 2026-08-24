package com.acabados1a.backend.dto;

import com.acabados1a.backend.model.Usuario;
import lombok.Getter;

// Nunca incluye password_hash — esto es lo que de verdad viaja al cliente tras registro/login.
// Mismos campos que ya trae el objeto usuario del mock, para que Perfil/NavBar/etc. no encuentren
// nada distinto al pasar de MockData al backend real.
@Getter
public class UsuarioResponse {

    private final Integer idUsuario;
    private final String tipoIdentificacion;
    private final String numeroIdentificacion;
    private final String nombre;
    private final String apellido;
    private final String email;
    private final String telefono;
    private final String whatsapp;
    private final String direccion;
    private final String ciudad;
    private final String departamento;
    private final Integer idRol;
    private final Boolean estado;

    public UsuarioResponse(Usuario usuario) {
        this.idUsuario = usuario.getIdUsuario();
        this.tipoIdentificacion = usuario.getTipoIdentificacion() != null ? usuario.getTipoIdentificacion().name() : null;
        this.numeroIdentificacion = usuario.getNumeroIdentificacion();
        this.nombre = usuario.getNombre();
        this.apellido = usuario.getApellido();
        this.email = usuario.getEmail();
        this.telefono = usuario.getTelefono();
        this.whatsapp = usuario.getWhatsapp();
        this.direccion = usuario.getDireccion();
        this.ciudad = usuario.getCiudad();
        this.departamento = usuario.getDepartamento();
        this.idRol = usuario.getRol().getIdRol();
        this.estado = usuario.getEstado();
    }
}
