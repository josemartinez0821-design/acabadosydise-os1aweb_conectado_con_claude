package com.acabados1a.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

// RF01 - registro: mismos campos que ya recolecta RegistroView.vue.
@Getter
@Setter
public class RegistroRequest {

    @NotBlank
    private String nombre;

    @NotBlank
    private String apellido;

    private String tipoIdentificacion;

    private String numeroIdentificacion;

    @NotBlank
    @Email
    private String email;

    @NotBlank
    @Size(min = 8, message = "La contraseña debe tener al menos 8 caracteres")
    private String password;

    private String telefono;

    private String whatsapp;

    private String direccion;

    private String ciudad;

    private String departamento;
}
