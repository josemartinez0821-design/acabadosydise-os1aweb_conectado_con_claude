package com.acabados1a.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReenviarCodigoRequest {

    @NotBlank(message = "El correo es obligatorio.")
    private String email;
}
