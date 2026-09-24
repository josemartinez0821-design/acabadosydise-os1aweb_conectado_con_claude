package com.acabados1a.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.GeneralSecurityException;
import java.security.MessageDigest;
import java.util.Base64;

// Hallazgo A-1 (auditoría cruzada): el código de 6 dígitos que autoriza verificar el correo o
// cambiar la contraseña se guardaba en texto plano en usuarios.codigo_verificacion. Ahora en la BD
// solo queda un HMAC-SHA256 del código, calculado con una llave que vive en el servidor.
//
// Por qué HMAC y no BCrypt (lo que sugería el informe):
//  - Solo existen 1.000.000 de códigos posibles. Con un BCrypt robado de la BD se pueden probar
//    todos fuera de línea en poco tiempo; con un HMAC no, porque sin la llave (que no está en la
//    BD) no hay forma de calcular el valor de ningún código.
//  - La columna es VARCHAR(10) y el esquema está congelado: un BCrypt mide 60 caracteres, mientras
//    que el HMAC recortado a 10 caracteres Base64 (60 bits) cabe sin tocar la BD.
@Component
public class CodigoVerificacionHasher {

    private static final String ALGORITMO = "HmacSHA256";
    private static final int LONGITUD_COLUMNA = 10;

    private final SecretKeySpec llave;

    // Llave propia si está configurada; si no, reutiliza jwt.secret para que el backend arranque
    // igual en un equipo cuyo application.properties todavía no tenga la clave nueva.
    public CodigoVerificacionHasher(@Value("${codigo-verificacion.secret:${jwt.secret}}") String secret) {
        this.llave = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), ALGORITMO);
    }

    public String hash(String codigo) {
        try {
            Mac mac = Mac.getInstance(ALGORITMO);
            mac.init(llave);
            byte[] firma = mac.doFinal(codigo.getBytes(StandardCharsets.UTF_8));
            return Base64.getUrlEncoder().withoutPadding().encodeToString(firma).substring(0, LONGITUD_COLUMNA);
        } catch (GeneralSecurityException e) {
            throw new IllegalStateException("No se pudo calcular el HMAC del código de verificación.", e);
        }
    }

    // MessageDigest.isEqual compara en tiempo constante: un equals() normal corta en el primer
    // carácter distinto, y medir cuánto tarda la respuesta daría pistas sobre el valor guardado.
    public boolean coincide(String codigoIngresado, String hashGuardado) {
        if (codigoIngresado == null || hashGuardado == null) return false;
        return MessageDigest.isEqual(
            hash(codigoIngresado).getBytes(StandardCharsets.UTF_8),
            hashGuardado.getBytes(StandardCharsets.UTF_8));
    }
}
