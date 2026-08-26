package com.acabados1a.backend.service;

import com.acabados1a.backend.dto.ContactoRequest;
import com.acabados1a.backend.repository.ConfiguracionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

// Sin tabla propia (decisión explícita: el mensaje solo se envía por correo al negocio, no se
// persiste - no hay una sección admin para "mensajes de contacto", a diferencia de PQRS).
// El destinatario se lee de la fila `configuracion`/clave `email` en vez de quedar hardcodeado,
// así que si ese correo cambia (ver catalog.configuracion.email en el frontend), este envío
// automáticamente empieza a llegar a la dirección nueva sin tocar código.
@Service
@RequiredArgsConstructor
public class ContactoService {

    private final ConfiguracionRepository configuracionRepository;
    private final EmailService emailService;

    public void enviar(ContactoRequest request) {
        String destinatario = configuracionRepository.findByClave("email")
            .map(c -> c.getValor())
            .orElseThrow(() -> new IllegalStateException("No hay un correo de contacto configurado."));

        emailService.enviarMensajeContacto(destinatario, request.getMotivo(), request.getNombre(),
            request.getTelefono(), request.getEmail(), request.getCiudad(), request.getDepartamento(), request.getMensaje());
    }
}
