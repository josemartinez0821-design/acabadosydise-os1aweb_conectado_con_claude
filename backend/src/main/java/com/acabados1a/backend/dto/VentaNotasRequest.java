package com.acabados1a.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VentaNotasRequest {

    private String notasInternas;

    // ISO yyyy-MM-dd, opcional.
    private String fechaEntregaEstimada;
}
