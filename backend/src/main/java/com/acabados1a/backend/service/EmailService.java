package com.acabados1a.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    // @Async: el registro/recuperación no debe esperar a que termine la conexión SMTP con Gmail
    // (esa espera era el "se demora 10 segundos" que reportó el usuario) - con esto el método se
    // dispara en otro hilo y AuthService sigue de una vez, sin bloquear la respuesta HTTP.
    @Async
    public void enviarCodigoVerificacion(String destinatario, String codigo) {
        enviar(destinatario, "Verifica tu cuenta - Acabados y Diseños 1A",
            "¡Bienvenido a Acabados y Diseños 1A!\n\n"
                + "Tu código de verificación es: " + codigo + "\n\n"
                + "Ingresa este código en la página de registro para activar tu cuenta. "
                + "El código vence en 15 minutos.");
    }

    @Async
    public void enviarCodigoRecuperacion(String destinatario, String codigo) {
        enviar(destinatario, "Recupera tu contraseña - Acabados y Diseños 1A",
            "Recibimos una solicitud para restablecer tu contraseña.\n\n"
                + "Tu código de verificación es: " + codigo + "\n\n"
                + "Ingresa este código para continuar. El código vence en 15 minutos. "
                + "Si no fuiste tú, puedes ignorar este correo.");
    }

    private void enviar(String destinatario, String asunto, String cuerpo) {
        SimpleMailMessage mensaje = new SimpleMailMessage();
        mensaje.setTo(destinatario);
        mensaje.setSubject(asunto);
        mensaje.setText(cuerpo);
        mailSender.send(mensaje);
    }
}
