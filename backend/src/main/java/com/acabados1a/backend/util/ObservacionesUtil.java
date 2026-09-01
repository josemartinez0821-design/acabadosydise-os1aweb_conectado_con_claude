package com.acabados1a.backend.util;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

// La tabla `cotizaciones` no tiene columna para la fecha deseada del servicio: el frontend la
// empaca al inicio de `observaciones` con un prefijo reconocible ("📅 Fecha deseada: YYYY-MM-DD")
// y la vuelve a separar al mostrarla (ver `empacarFechaDeseada` / `extraerFechaDeseada` en
// frontend/src/composables/useFormat.js). El backend necesita leer esa misma fecha para los
// correos (confirmación de pedido, cotización aprobada), así que aquí va el mismo parser en Java.
public final class ObservacionesUtil {

    private ObservacionesUtil() {}

    // Mismo patrón que REGEX_FECHA_DESEADA en useFormat.js: el prefijo va al comienzo del texto.
    private static final Pattern FECHA_DESEADA = Pattern.compile("^📅 Fecha deseada:\\s*([^\\n]+)");

    // Devuelve la fecha en ISO (YYYY-MM-DD) tal como la guardó el frontend, o null si el texto no
    // trae el prefijo. No se formatea aquí: cada correo decide cómo mostrarla.
    public static String extraerFechaDeseada(String observaciones) {
        if (observaciones == null) return null;
        Matcher m = FECHA_DESEADA.matcher(observaciones);
        return m.find() ? m.group(1).trim() : null;
    }
}
