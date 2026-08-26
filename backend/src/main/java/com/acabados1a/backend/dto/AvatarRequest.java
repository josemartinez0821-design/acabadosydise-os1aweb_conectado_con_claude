package com.acabados1a.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

// data URL completa ("data:image/png;base64,...") tal como la produce FileReader.readAsDataURL()
// en el frontend - se guarda tal cual, sin decodificar ni revalidar el tipo en el backend (el
// frontend ya valida tipo/tamaño antes de mandarlo).
@Getter
@Setter
public class AvatarRequest {

    @NotBlank(message = "La imagen es obligatoria.")
    private String avatar;
}
