package com.acabados1a.backend.service;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    // Único correo con plantilla HTML por ahora (pedido explícito del usuario: "únicamente...
    // la verificación de cuentas", el resto de correos de este servicio se queda en texto plano
    // tal cual estaban). El código en sí y su tiempo real de vigencia (VIGENCIA_CODIGO_MINUTOS en
    // AuthService, 15 minutos) NO se tocan aquí - este método solo cambia cómo se ve, nunca genera
    // ni valida nada. @Async igual que antes: no bloquea la respuesta HTTP mientras habla con Gmail.
    @Async
    public void enviarCodigoVerificacion(String destinatario, String codigo) {
        try {
            MimeMessage mensaje = mailSender.createMimeMessage();
            // MULTIPART_MODE_RELATED (no el `true`/MIXED de antes) - MIXED es para adjuntos
            // normales y arma mal el multipart/related que necesita una imagen inline (addInline)
            // combinada con el texto alternativo (setText con html+texto plano). Con MIXED, Gmail
            // puede terminar mostrando solo la parte de texto plano - es justo lo que reportó el
            // usuario ("se ve igual que antes").
            MimeMessageHelper helper = new MimeMessageHelper(mensaje, MimeMessageHelper.MULTIPART_MODE_RELATED, "UTF-8");
            helper.setTo(destinatario);
            helper.setSubject("Verifica tu cuenta - Acabados y Diseños 1A");
            helper.setText(plantillaVerificacionTexto(codigo), plantillaVerificacionHtml(codigo));
            helper.addInline("logoAcabados", new ClassPathResource("email/logo-acabados.png"));
            mailSender.send(mensaje);
        } catch (Exception e) {
            // No relanzar: este método corre en un hilo aparte (@Async) sin nadie esperando su
            // resultado - un fallo aquí no debe tumbar el registro, solo quedar en el log del server.
            throw new RuntimeException("No se pudo enviar el correo de verificación.", e);
        }
    }

    // Mismo texto de siempre como respaldo para clientes de correo que no rendericen HTML - los
    // espacios entre dígitos son solo visuales en el HTML (letter-spacing), aquí van tal cual.
    private String plantillaVerificacionTexto(String codigo) {
        return "¡Bienvenido a Acabados y Diseños 1A!\n\n"
            + "Tu código de verificación es: " + codigo + "\n\n"
            + "Ingresa este código en la página de registro para activar tu cuenta. "
            + "El código vence en 15 minutos.";
    }

    // Tabla + estilos inline a propósito (nada de <style> externo, JS ni fuentes remotas) - es lo
    // que de verdad se renderiza igual en Gmail y en la mayoría de clientes de correo. Colores y
    // logo son los reales del proyecto (style.css: --primary #C0392B, --secondary #1A1A2E,
    // --accent #F39C12), mismo patrón de "chip blanco redondeado" que ya usa el logo en el navbar/
    // topbar del checkout (ver .checkout-logo en style.css) - no es una identidad nueva.
    private String plantillaVerificacionHtml(String codigo) {
        return htmlAbrir()
            + htmlHeader()
            // Título + saludo
            + "<tr><td style=\"padding:36px 32px 6px;text-align:center;\">"
            + "<h1 style=\"margin:0 0 16px;font-size:22px;line-height:1.3;color:#1A1A2E;font-weight:800;\">Verifica tu cuenta</h1>"
            + "<p style=\"margin:0 0 4px;font-size:15px;color:#444444;line-height:1.6;\">¡Hola! Gracias por registrarte en <strong>Acabados y Diseños 1A</strong>.</p>"
            + "<p style=\"margin:0 0 8px;font-size:15px;color:#444444;line-height:1.6;\">Para completar la activación de tu cuenta, usa el siguiente código:</p>"
            + "</td></tr>"
            // Tarjeta del código
            + "<tr><td style=\"padding:20px 32px 4px;\">"
            + "<table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" style=\"background-color:#FBEDEA;border:1.5px solid #C0392B;border-radius:12px;\">"
            + "<tr><td style=\"padding:26px 16px;text-align:center;\">"
            + "<p style=\"margin:0 0 12px;font-size:11px;font-weight:800;letter-spacing:2px;color:#C0392B;text-transform:uppercase;font-family:Arial,sans-serif;\">Código de verificación</p>"
            + "<p style=\"margin:0;font-size:42px;font-weight:800;letter-spacing:14px;color:#1A1A2E;font-family:'Nunito',Arial,sans-serif;\">" + codigo + "</p>"
            + "</td></tr></table>"
            + "</td></tr>"
            + "<tr><td style=\"padding:16px 32px 0;text-align:center;\">"
            + "<p style=\"margin:0;font-size:13px;color:#777777;\">Este código es válido durante <strong>15 minutos</strong>.</p>"
            + "</td></tr>"
            // Aviso de seguridad
            + "<tr><td style=\"padding:24px 32px 32px;\">"
            + "<table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" style=\"background-color:#FBF4E4;border-radius:8px;\">"
            + "<tr><td style=\"padding:14px 16px;font-size:13px;color:#8a5c06;line-height:1.5;\">"
            + "Si no solicitaste este código, puedes ignorar este mensaje. No compartas este código con nadie."
            + "</td></tr></table>"
            + "</td></tr>"
            + htmlFooter()
            + htmlCerrar();
    }

    // Envoltorio exterior (fondo gris + tarjeta blanca centrada) compartido por todos los
    // correos con plantilla HTML — separado de htmlHeader()/htmlFooter() porque cada correo
    // pone contenido distinto entre header y footer, pero el marco siempre es el mismo.
    private String htmlAbrir() {
        return "<!doctype html><html><body style=\"margin:0;padding:0;background-color:#F0F1F4;\">"
            + "<table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" style=\"background-color:#F0F1F4;padding:32px 16px;font-family:'Nunito',Arial,sans-serif;\">"
            + "<tr><td align=\"center\">"
            + "<table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" style=\"max-width:480px;background-color:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.06);\">";
    }

    private String htmlCerrar() {
        return "</table></td></tr></table></body></html>";
    }

    // Chip blanco redondeado con el logo (cid:logoAcabados, adjuntado inline por cada método
    // @Async que use esta plantilla) + nombre de marca sobre fondo navy — mismo header en todo
    // correo HTML del proyecto, para que se vean como un solo sistema, no plantillas sueltas.
    private String htmlHeader() {
        return "<tr><td style=\"background-color:#1A1A2E;padding:28px 32px;text-align:center;\">"
            + "<table role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\" style=\"margin:0 auto 12px;\"><tr><td style=\"background-color:#ffffff;border-radius:10px;padding:6px;\">"
            + "<img src=\"cid:logoAcabados\" width=\"48\" height=\"48\" alt=\"Acabados y Diseños 1A\" style=\"display:block;border-radius:6px;\">"
            + "</td></tr></table>"
            + "<span style=\"color:#ffffff;font-size:15px;font-weight:800;letter-spacing:0.5px;\">ACABADOS Y DISEÑOS <span style=\"color:#F39C12;\">1A</span></span>"
            + "</td></tr>";
    }

    private String htmlFooter() {
        return "<tr><td style=\"background-color:#1A1A2E;padding:22px 32px;text-align:center;\">"
            + "<p style=\"margin:0 0 3px;font-size:13px;color:#ffffff;font-weight:700;\">Acabados y Diseños 1A</p>"
            + "<p style=\"margin:0;font-size:12px;color:#a9a9c0;\">Grandes ideas que inspiran grandes Diseños</p>"
            + "</td></tr>";
    }

    @Async
    public void enviarCodigoRecuperacion(String destinatario, String codigo) {
        enviar(destinatario, "Recupera tu contraseña - Acabados y Diseños 1A",
            "Recibimos una solicitud para restablecer tu contraseña.\n\n"
                + "Tu código de verificación es: " + codigo + "\n\n"
                + "Ingresa este código para continuar. El código vence en 15 minutos. "
                + "Si no fuiste tú, puedes ignorar este correo.");
    }

    // Se dispara desde VentaService.crear() apenas se registra el pedido - antes la pantalla de
    // éxito del checkout prometía "te enviaremos los detalles a tu correo" sin que nada lo hiciera
    // realidad. resumenProductos ya viene armado como texto ("- Nombre x2: $90.000\n...").
    @Async
    public void enviarConfirmacionPedido(String destinatario, String numeroVenta, String resumenProductos, String total, boolean esContraentrega) {
        String cuerpo = "¡Gracias por tu compra! Confirmamos que recibimos tu pedido " + numeroVenta + ".\n\n"
            + "Productos:\n" + resumenProductos + "\n\n"
            + "Total: " + total + "\n\n";
        cuerpo += esContraentrega
            ? "Pagas en efectivo o datáfono cuando recojas tu pedido en el local de la transportadora. "
                + "Te avisaremos por este mismo correo apenas lo despachemos, con el número de guía."
            : "Te avisaremos por este mismo correo apenas tu pedido esté listo o despachado.";
        enviar(destinatario, "Confirmación de tu pedido " + numeroVenta + " - Acabados y Diseños 1A", cuerpo);
    }

    // Se dispara desde VentaService.actualizarEstado() al marcar un pedido como despachado/
    // entregado - guía/transportadora vienen tal cual las escribió el admin (sin API de
    // transportadora, ver VentaEstadoRequest). numeroGuia null = pedido de recogida en tienda.
    @Async
    public void enviarNotificacionDespacho(String destinatario, String numeroVenta, String numeroGuia, String transportadora) {
        if (numeroGuia != null && !numeroGuia.isBlank()) {
            enviar(destinatario, "Tu pedido " + numeroVenta + " fue despachado - Acabados y Diseños 1A",
                "¡Buenas noticias! Tu pedido " + numeroVenta + " ya fue entregado a la transportadora"
                    + (transportadora != null && !transportadora.isBlank() ? " " + transportadora : "") + ".\n\n"
                    + "Número de guía: " + numeroGuia + "\n\n"
                    + "Puedes usar este número para hacer seguimiento directamente con la transportadora.");
        } else {
            enviar(destinatario, "Tu pedido " + numeroVenta + " fue entregado - Acabados y Diseños 1A",
                "Confirmamos que tu pedido " + numeroVenta + " fue entregado en nuestra tienda.\n\n"
                    + "¡Gracias por tu compra!");
        }
    }

    // Se dispara desde VentaService.actualizarEstado() al cancelar un pedido en proceso o al
    // registrar la devolución de uno ya entregado - antes ninguna de las dos avisaba nada al
    // cliente. reembolsoPendiente = ya había un pago completado (tarjeta/Nequi/etc.), así que el
    // negocio le debe algo de vuelta y hay que decírselo, aunque el reembolso en sí se coordine
    // aparte (no hay pasarela de pago real conectada todavía).
    @Async
    public void enviarNotificacionCancelacion(String destinatario, String numeroVenta, boolean esDevolucion, boolean reembolsoPendiente) {
        String cuerpo = esDevolucion
            ? "Confirmamos que registramos la devolución de tu pedido " + numeroVenta + ".\n\n"
            : "Tu pedido " + numeroVenta + " fue cancelado.\n\n";
        if (reembolsoPendiente) {
            cuerpo += "Nuestro equipo se pondrá en contacto contigo para coordinar el reembolso.";
        } else {
            cuerpo += "No se realizó ningún cobro por este pedido.";
        }
        enviar(destinatario,
            (esDevolucion ? "Devolución registrada" : "Pedido cancelado") + " - " + numeroVenta + " - Acabados y Diseños 1A",
            cuerpo);
    }

    // Se dispara desde CotizacionService.enviarRecordatoriosVencimiento() (job diario) cuando a
    // una cotización aprobada le quedan exactamente 5 días antes de vencer. Plantilla HTML igual
    // que la de verificación (pedido explícito del usuario: "más bonito elegante y no tan
    // genérico") — reusa htmlAbrir/htmlHeader/htmlFooter en vez de duplicar el marco de tabla.
    @Async
    public void enviarRecordatorioCotizacion(String destinatario, String numeroCotizacion, String totalFormateado) {
        try {
            MimeMessage mensaje = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mensaje, MimeMessageHelper.MULTIPART_MODE_RELATED, "UTF-8");
            helper.setTo(destinatario);
            helper.setSubject("Tu cotización " + numeroCotizacion + " está por vencer - Acabados y Diseños 1A");
            helper.setText(plantillaRecordatorioTexto(numeroCotizacion, totalFormateado), plantillaRecordatorioHtml(numeroCotizacion, totalFormateado));
            helper.addInline("logoAcabados", new ClassPathResource("email/logo-acabados.png"));
            mailSender.send(mensaje);
        } catch (Exception e) {
            throw new RuntimeException("No se pudo enviar el correo de recordatorio de cotización.", e);
        }
    }

    private String plantillaRecordatorioTexto(String numeroCotizacion, String totalFormateado) {
        return "¡Hola! Tu cotización " + numeroCotizacion + " por " + totalFormateado + " está por vencer.\n\n"
            + "Te quedan 5 días para confirmar y pagar antes de que pierda su validez. "
            + "Ingresa a tu cuenta en Acabados y Diseños 1A para revisarla y continuar.\n\n"
            + "Si tienes dudas, escríbenos por WhatsApp y con gusto te ayudamos.";
    }

    private String plantillaRecordatorioHtml(String numeroCotizacion, String totalFormateado) {
        return htmlAbrir()
            + htmlHeader()
            + "<tr><td style=\"padding:36px 32px 6px;text-align:center;\">"
            + "<h1 style=\"margin:0 0 16px;font-size:22px;line-height:1.3;color:#1A1A2E;font-weight:800;\">Tu cotización está por vencer</h1>"
            + "<p style=\"margin:0 0 4px;font-size:15px;color:#444444;line-height:1.6;\">¡Hola! Queremos recordarte que tu cotización sigue esperando por ti.</p>"
            + "<p style=\"margin:0 0 8px;font-size:15px;color:#444444;line-height:1.6;\">Te quedan <strong>5 días</strong> para confirmarla y pagarla antes de que pierda su validez.</p>"
            + "</td></tr>"
            // Tarjeta con el resumen de la cotización
            + "<tr><td style=\"padding:20px 32px 4px;\">"
            + "<table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" style=\"background-color:#FBEDEA;border:1.5px solid #C0392B;border-radius:12px;\">"
            + "<tr><td style=\"padding:22px 20px;text-align:center;\">"
            + "<p style=\"margin:0 0 10px;font-size:11px;font-weight:800;letter-spacing:2px;color:#C0392B;text-transform:uppercase;font-family:Arial,sans-serif;\">Cotización</p>"
            + "<p style=\"margin:0 0 14px;font-size:26px;font-weight:800;letter-spacing:1px;color:#1A1A2E;font-family:'Nunito',Arial,sans-serif;\">" + numeroCotizacion + "</p>"
            + "<p style=\"margin:0;font-size:15px;color:#444444;\">Total estimado: <strong style=\"color:#1A1A2E;\">" + totalFormateado + "</strong></p>"
            + "</td></tr></table>"
            + "</td></tr>"
            // Aviso de vencimiento (mismo tono ámbar que otros avisos del sitio)
            + "<tr><td style=\"padding:24px 32px 32px;\">"
            + "<table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" style=\"background-color:#FBF4E4;border-radius:8px;\">"
            + "<tr><td style=\"padding:14px 16px;font-size:13px;color:#8a5c06;line-height:1.5;\">"
            + "Después de esta fecha, la cotización dejará de estar disponible para pagar. Ingresa a tu cuenta en Acabados y Diseños 1A para revisarla, o escríbenos por WhatsApp si necesitas ayuda."
            + "</td></tr></table>"
            + "</td></tr>"
            + htmlFooter()
            + htmlCerrar();
    }

    // Se dispara desde ContactoService.enviar() - a diferencia de los otros correos (siempre
    // salen del negocio hacia un cliente), este entra: alguien llenó el formulario público de
    // Contacto y el negocio necesita verlo. setReplyTo() con el correo de quien escribió, así
    // quien lo reciba puede darle "Responder" directamente sin copiar el correo a mano.
    @Async
    public void enviarMensajeContacto(String destinatario, String motivo, String nombre, String telefono,
                                       String emailRemitente, String ciudad, String departamento, String mensaje) {
        SimpleMailMessage correo = new SimpleMailMessage();
        correo.setTo(destinatario);
        correo.setReplyTo(emailRemitente);
        correo.setSubject("Nuevo mensaje de contacto (" + motivo + ") - " + nombre);
        String ubicacion = (ciudad != null && !ciudad.isBlank()) ? ciudad + (departamento != null && !departamento.isBlank() ? ", " + departamento : "") : null;
        correo.setText("Nuevo mensaje desde el formulario de Contacto del sitio.\n\n"
            + "Motivo: " + motivo + "\n"
            + "Nombre: " + nombre + "\n"
            + "Teléfono: " + telefono + "\n"
            + "Correo: " + emailRemitente + "\n"
            + (ubicacion != null ? "Ubicación: " + ubicacion + "\n" : "")
            + "\nMensaje:\n" + mensaje);
        mailSender.send(correo);
    }

    private void enviar(String destinatario, String asunto, String cuerpo) {
        SimpleMailMessage mensaje = new SimpleMailMessage();
        mensaje.setTo(destinatario);
        mensaje.setSubject(asunto);
        mensaje.setText(cuerpo);
        mailSender.send(mensaje);
    }
}
