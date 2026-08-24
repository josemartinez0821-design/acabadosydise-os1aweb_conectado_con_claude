package com.acabados1a.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UmbralesRequest {

    private Integer stockMinimo;
    private Integer stockMaximo;
    private String ubicacionBodega;
}
