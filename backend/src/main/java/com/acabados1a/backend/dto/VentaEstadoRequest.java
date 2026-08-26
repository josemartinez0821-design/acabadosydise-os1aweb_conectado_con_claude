package com.acabados1a.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VentaEstadoRequest {

    @NotBlank(message = "El estado es obligatorio.")
    private String estado;

    // Solo aplican al marcar un pedido de envío como despachado (ver VentaService) - se guardan
    // tal cual los entrega la transportadora, no hay integración con ninguna API de transportadora.
    private String numeroGuia;
    private String transportadora;

    // Solo aplica al cancelar o devolver (ver VentaService) - texto libre, no un catálogo cerrado
    // de motivos, a propósito (negocio chico, no vale la pena mantener una taxonomía).
    private String motivo;
}
