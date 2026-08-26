package com.acabados1a.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ContactoRequest {

    @NotBlank(message = "El motivo es obligatorio.")
    private String motivo;

    @NotBlank(message = "El nombre es obligatorio.")
    private String nombre;

    @NotBlank(message = "El teléfono es obligatorio.")
    private String telefono;

    @NotBlank(message = "El correo es obligatorio.")
    @Email(message = "El correo no es válido.")
    private String email;

    private String departamento;
    private String ciudad;

    @NotBlank(message = "El mensaje es obligatorio.")
    private String mensaje;
}
