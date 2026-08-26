package com.acabados1a.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

// El email no está aquí a propósito - es el usuario de acceso, no se edita desde Perfil (mismo
// límite que ya tenía la versión mock).
@Getter
@Setter
public class UsuarioUpdateRequest {

    @NotBlank(message = "El nombre es obligatorio.")
    private String nombre;

    @NotBlank(message = "El apellido es obligatorio.")
    private String apellido;

    private String tipoIdentificacion;
    private String numeroIdentificacion;
    private String telefono;
    private String whatsapp;
    private String direccion;
    private String ciudad;
    private String departamento;
}
