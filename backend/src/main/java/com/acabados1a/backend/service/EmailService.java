package com.acabados1a.backend.service;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.text.NumberFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    private static final Locale ES_CO = new Locale("es", "CO");

    // Una línea del resumen de un correo (un producto o un servicio). El monto se formatea dentro
    // de EmailService para no repartir el NumberFormat por los servicios que arman estas listas.
    public record LineaResumen(String nombre, String detalle, BigDecimal monto) {}

    // Datos del correo "tu cotización fue aprobada" — los arma CotizacionService al aprobar.
    public record DatosCotizacionAprobada(
        String numeroCotizacion,
        String notaAsesor,
        List<LineaResumen> servicios,
        List<LineaResumen> productos,
        BigDecimal totalAprobado,
        BigDecimal anticipo,
        int validezDias,
        String fechaDeseadaIso
    ) {}

    // Datos del correo de confirmación de compra — los arma VentaService al registrar la venta.
    // esAnticipoServicio distingue el pago del 50% de una cotización de solo servicios (llega con
    // productos vacío) del checkout normal de productos; numeroCotizacion/saldoPendiente solo
    // aplican en ese caso.
    public record DatosConfirmacionPedido(
        String numeroVenta,
        List<LineaResumen> productos,
        List<LineaResumen> servicios,
        BigDecimal total,
        boolean esContraentrega,
        boolean esAnticipoServicio,
        String numeroCotizacion,
        BigDecimal saldoPendiente,
        String fechaDeseadaIso
    ) {}

    // Cómo se lee la cantidad de un servicio en el correo: "8 horas", "1 día" o, si se cobra a
    // precio fijo de proyecto, "Precio por proyecto" (sin número). Se pasan banderas y no la
    // entidad Servicio para no acoplar la capa de correo al modelo. Mismo criterio que
    // `unidadServicio()` en el frontend (stores/cotizaciones.js): hora manda sobre día sobre proyecto.
    public static String descripcionCantidadServicio(BigDecimal cantidad, boolean porHora, boolean porDia) {
        if (!porHora && !porDia) return "Precio por proyecto";
        BigDecimal c = (cantidad == null ? BigDecimal.ONE : cantidad).stripTrailingZeros();
        boolean uno = c.compareTo(BigDecimal.ONE) == 0;
        String unidad = porHora ? (uno ? "hora" : "horas") : (uno ? "día" : "días");
        return c.toPlainString() + " " + unidad;
    }

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
    // realidad. Plantilla HTML (misma identidad que verificación/recordatorio) con los servicios y
    // los productos en secciones separadas; el pago del anticipo del 50% de una cotización de solo
    // servicios (datos.esAnticipoServicio) usa un encabezado y un desglose propios en vez de
    // mostrar "Productos:" vacío como hacía la versión anterior en texto plano.
    @Async
    public void enviarConfirmacionPedido(String destinatario, DatosConfirmacionPedido datos) {
        try {
            MimeMessage mensaje = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mensaje, MimeMessageHelper.MULTIPART_MODE_RELATED, "UTF-8");
            helper.setTo(destinatario);
            String asunto = datos.esAnticipoServicio()
                ? "Recibimos tu anticipo - " + datos.numeroVenta() + " - Acabados y Diseños 1A"
                : "Confirmación de tu pedido " + datos.numeroVenta() + " - Acabados y Diseños 1A";
            helper.setSubject(asunto);
            helper.setText(plantillaConfirmacionPedidoTexto(datos), plantillaConfirmacionPedidoHtml(datos));
            helper.addInline("logoAcabados", new ClassPathResource("email/logo-acabados.png"));
            mailSender.send(mensaje);
        } catch (Exception e) {
            throw new RuntimeException("No se pudo enviar el correo de confirmación de pedido.", e);
        }
    }

    String plantillaConfirmacionPedidoTexto(DatosConfirmacionPedido d) {
        StringBuilder t = new StringBuilder();
        if (d.esAnticipoServicio()) {
            t.append("¡Recibimos tu anticipo! Tu pago del 50% quedó registrado y ya estamos coordinando tu servicio.\n\n");
            t.append("Comprobante: ").append(d.numeroVenta());
            if (d.numeroCotizacion() != null) t.append("  ·  Cotización: ").append(d.numeroCotizacion());
            t.append("\n\n");
        } else {
            t.append("¡Gracias por tu compra! Confirmamos que recibimos tu pedido ").append(d.numeroVenta()).append(".\n\n");
        }
        t.append(lineasTexto("Servicios", d.servicios()));
        t.append(lineasTexto("Productos", d.productos()));
        if (d.esAnticipoServicio()) {
            t.append("\nAnticipo pagado: ").append(formatoCOP(d.total())).append("\n");
            if (d.saldoPendiente() != null) t.append("Saldo pendiente: ").append(formatoCOP(d.saldoPendiente()))
                .append(" (se acuerda al confirmar el trabajo)\n");
        } else {
            t.append("\nTotal: ").append(formatoCOP(d.total())).append("\n");
        }
        String fecha = formatoFechaLarga(d.fechaDeseadaIso());
        if (fecha != null) t.append("Fecha que solicitaste: ").append(fecha).append("\n");
        t.append("\n");
        if (d.esAnticipoServicio()) {
            t.append("Te contactaremos por WhatsApp para confirmar la fecha y coordinar los detalles.");
        } else if (d.esContraentrega()) {
            t.append("Pagas en efectivo o datáfono cuando recojas tu pedido en el local de la transportadora. "
                + "Te avisaremos por este mismo correo apenas lo despachemos, con el número de guía.");
        } else {
            t.append("Te avisaremos por este mismo correo apenas tu pedido esté listo o despachado.");
        }
        return t.toString();
    }

    String plantillaConfirmacionPedidoHtml(DatosConfirmacionPedido d) {
        boolean anticipo = d.esAnticipoServicio();
        String titulo = anticipo ? "¡Recibimos tu anticipo!" : "¡Gracias por tu compra!";
        String intro = anticipo
            ? "Tu pago del <strong>50%</strong> quedó registrado y ya estamos coordinando tu servicio."
            : "Confirmamos que recibimos tu pedido y ya lo estamos preparando.";

        StringBuilder html = new StringBuilder(htmlAbrir() + htmlHeader());
        html.append("<tr><td style=\"padding:36px 32px 6px;text-align:center;\">")
            .append("<h1 style=\"margin:0 0 14px;font-size:22px;line-height:1.3;color:#1A1A2E;font-weight:800;\">").append(titulo).append("</h1>")
            .append("<p style=\"margin:0 0 6px;font-size:15px;color:#444444;line-height:1.6;\">").append(intro).append("</p>")
            .append("</td></tr>");

        // Chip con el número de comprobante/pedido (+ cotización si es un anticipo)
        html.append("<tr><td style=\"padding:6px 32px 0;text-align:center;\">")
            .append(chip(anticipo ? "Comprobante " + d.numeroVenta() : "Pedido " + d.numeroVenta()));
        if (d.numeroCotizacion() != null) html.append("&nbsp;").append(chip("Cotización " + d.numeroCotizacion()));
        html.append("</td></tr>");

        html.append(seccionResumen("Servicios", "#B26A00", d.servicios()));
        html.append(seccionResumen("Productos", "#C0392B", d.productos()));

        // Tarjeta de totales
        html.append("<tr><td style=\"padding:22px 32px 4px;\">")
            .append("<table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" style=\"background-color:#FBEDEA;border:1.5px solid #C0392B;border-radius:12px;\">")
            .append("<tr><td style=\"padding:20px;text-align:center;\">");
        if (anticipo) {
            html.append("<p style=\"margin:0 0 6px;font-size:11px;font-weight:800;letter-spacing:2px;color:#C0392B;text-transform:uppercase;font-family:Arial,sans-serif;\">Anticipo pagado</p>")
                .append("<p style=\"margin:0;font-size:30px;font-weight:800;color:#1A1A2E;font-family:'Nunito',Arial,sans-serif;\">").append(formatoCOP(d.total())).append("</p>");
            if (d.saldoPendiente() != null) {
                html.append("<p style=\"margin:10px 0 0;font-size:13px;color:#444444;\">Saldo pendiente: <strong style=\"color:#1A1A2E;\">")
                    .append(formatoCOP(d.saldoPendiente())).append("</strong></p>")
                    .append("<p style=\"margin:2px 0 0;font-size:12px;color:#777777;\">Se acuerda al confirmar el trabajo.</p>");
            }
        } else {
            html.append("<p style=\"margin:0 0 6px;font-size:11px;font-weight:800;letter-spacing:2px;color:#C0392B;text-transform:uppercase;font-family:Arial,sans-serif;\">Total</p>")
                .append("<p style=\"margin:0;font-size:30px;font-weight:800;color:#1A1A2E;font-family:'Nunito',Arial,sans-serif;\">").append(formatoCOP(d.total())).append("</p>");
        }
        html.append("</td></tr></table></td></tr>");

        String fecha = formatoFechaLarga(d.fechaDeseadaIso());
        if (fecha != null) {
            html.append("<tr><td style=\"padding:14px 32px 0;text-align:center;\">")
                .append("<p style=\"margin:0;font-size:13px;color:#777777;\">&#128197; Fecha que solicitaste: <strong style=\"color:#1A1A2E;\">")
                .append(fecha).append("</strong></p></td></tr>");
        }

        String aviso = anticipo
            ? "Te contactaremos por WhatsApp para confirmar la fecha y coordinar todos los detalles del servicio."
            : d.esContraentrega()
                ? "Pagas en efectivo o datáfono cuando recojas tu pedido en el local de la transportadora. Te avisaremos por este mismo correo apenas lo despachemos, con el número de guía."
                : "Te avisaremos por este mismo correo apenas tu pedido esté listo o despachado.";
        html.append(avisoAmbar(aviso));
        html.append(htmlFooter()).append(htmlCerrar());
        return html.toString();
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

    // Se dispara desde CotizacionService.actualizarEstado() apenas el admin aprueba una cotización.
    // Antes nada avisaba la aprobación en sí (solo existía el recordatorio de vencimiento, 5 días
    // antes). Lleva la nota del asesor, el desglose de servicios y productos por separado, el total
    // aprobado y el anticipo del 50% para que el cliente pueda entrar a pagar.
    @Async
    public void enviarCotizacionAprobada(String destinatario, DatosCotizacionAprobada datos) {
        try {
            MimeMessage mensaje = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mensaje, MimeMessageHelper.MULTIPART_MODE_RELATED, "UTF-8");
            helper.setTo(destinatario);
            helper.setSubject("¡Tu cotización " + datos.numeroCotizacion() + " fue aprobada! - Acabados y Diseños 1A");
            helper.setText(plantillaCotizacionAprobadaTexto(datos), plantillaCotizacionAprobadaHtml(datos));
            helper.addInline("logoAcabados", new ClassPathResource("email/logo-acabados.png"));
            mailSender.send(mensaje);
        } catch (Exception e) {
            throw new RuntimeException("No se pudo enviar el correo de cotización aprobada.", e);
        }
    }

    String plantillaCotizacionAprobadaTexto(DatosCotizacionAprobada d) {
        StringBuilder t = new StringBuilder();
        t.append("¡Tu cotización ").append(d.numeroCotizacion()).append(" fue aprobada!\n\n");
        t.append("Revisamos lo que necesitas y ya tienes tu precio confirmado.\n\n");
        if (d.notaAsesor() != null && !d.notaAsesor().isBlank()) {
            t.append("Nota de tu asesor: ").append(d.notaAsesor().trim()).append("\n\n");
        }
        t.append(lineasTexto("Servicios", d.servicios()));
        t.append(lineasTexto("Productos", d.productos()));
        t.append("\nTotal aprobado: ").append(formatoCOP(d.totalAprobado())).append("\n");
        t.append("Anticipo para agendar (50%): ").append(formatoCOP(d.anticipo())).append("\n");
        String fecha = formatoFechaLarga(d.fechaDeseadaIso());
        if (fecha != null) t.append("Fecha que solicitaste: ").append(fecha).append("\n");
        t.append("\nTienes ").append(d.validezDias()).append(" días para confirmar y pagar el anticipo. ")
            .append("Ingresa a tu cuenta en Acabados y Diseños 1A, entra a \"Mis cotizaciones\" y pulsa \"Aprobar y pagar\". ")
            .append("Si tienes dudas, escríbenos por WhatsApp.");
        return t.toString();
    }

    String plantillaCotizacionAprobadaHtml(DatosCotizacionAprobada d) {
        StringBuilder html = new StringBuilder(htmlAbrir() + htmlHeader());
        html.append("<tr><td style=\"padding:36px 32px 6px;text-align:center;\">")
            .append("<h1 style=\"margin:0 0 14px;font-size:22px;line-height:1.3;color:#1A1A2E;font-weight:800;\">¡Tu cotización fue aprobada!</h1>")
            .append("<p style=\"margin:0 0 6px;font-size:15px;color:#444444;line-height:1.6;\">Revisamos lo que necesitas y ya tienes tu precio confirmado. Este es el detalle:</p>")
            .append("</td></tr>");
        html.append("<tr><td style=\"padding:6px 32px 0;text-align:center;\">").append(chip("Cotización " + d.numeroCotizacion())).append("</td></tr>");

        // Nota del asesor (obligatoria al aprobar desde el panel) — tono ámbar, como otra info del sitio
        if (d.notaAsesor() != null && !d.notaAsesor().isBlank()) {
            html.append("<tr><td style=\"padding:20px 32px 4px;\">")
                .append("<table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" style=\"background-color:#FBF4E4;border-radius:8px;\">")
                .append("<tr><td style=\"padding:14px 16px;\">")
                .append("<p style=\"margin:0 0 4px;font-size:11px;font-weight:800;letter-spacing:1px;text-transform:uppercase;color:#8a5c06;font-family:Arial,sans-serif;\">Nota de tu asesor</p>")
                .append("<p style=\"margin:0;font-size:14px;color:#5c4a1a;line-height:1.55;\">").append(escapar(d.notaAsesor().trim())).append("</p>")
                .append("</td></tr></table></td></tr>");
        }

        html.append(seccionResumen("Servicios", "#B26A00", d.servicios()));
        html.append(seccionResumen("Productos", "#C0392B", d.productos()));

        // Tarjeta de total + anticipo
        html.append("<tr><td style=\"padding:22px 32px 4px;\">")
            .append("<table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" style=\"background-color:#FBEDEA;border:1.5px solid #C0392B;border-radius:12px;\">")
            .append("<tr><td style=\"padding:20px;text-align:center;\">")
            .append("<p style=\"margin:0 0 6px;font-size:11px;font-weight:800;letter-spacing:2px;color:#C0392B;text-transform:uppercase;font-family:Arial,sans-serif;\">Total aprobado</p>")
            .append("<p style=\"margin:0;font-size:30px;font-weight:800;color:#1A1A2E;font-family:'Nunito',Arial,sans-serif;\">").append(formatoCOP(d.totalAprobado())).append("</p>")
            .append("<p style=\"margin:10px 0 0;font-size:13px;color:#444444;\">Anticipo para agendar (50%): <strong style=\"color:#1A1A2E;\">").append(formatoCOP(d.anticipo())).append("</strong></p>")
            .append("</td></tr></table></td></tr>");

        String fecha = formatoFechaLarga(d.fechaDeseadaIso());
        if (fecha != null) {
            html.append("<tr><td style=\"padding:14px 32px 0;text-align:center;\">")
                .append("<p style=\"margin:0;font-size:13px;color:#777777;\">&#128197; Fecha que solicitaste: <strong style=\"color:#1A1A2E;\">")
                .append(fecha).append("</strong></p></td></tr>");
        }

        html.append(avisoAmbar("Tienes <strong>" + d.validezDias() + " días</strong> para confirmar y pagar el anticipo. "
            + "Ingresa a tu cuenta en Acabados y Diseños 1A, entra a <strong>Mis cotizaciones</strong> y pulsa <strong>Aprobar y pagar</strong>. "
            + "Si tienes dudas, escríbenos por WhatsApp."));
        html.append(htmlFooter()).append(htmlCerrar());
        return html.toString();
    }

    // Se dispara desde CotizacionService.actualizarEstado() cuando el admin (no el propio cliente)
    // rechaza una cotización. El simétrico de enviarCotizacionAprobada: antes el cliente no se
    // enteraba del rechazo salvo que entrara a su cuenta. El motivo lo escribe el admin y es
    // obligatorio en el panel; aun así se maneja el caso vacío por si llega por API sin él.
    @Async
    public void enviarCotizacionRechazada(String destinatario, String numeroCotizacion, String motivo) {
        try {
            MimeMessage mensaje = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mensaje, MimeMessageHelper.MULTIPART_MODE_RELATED, "UTF-8");
            helper.setTo(destinatario);
            helper.setSubject("Sobre tu cotización " + numeroCotizacion + " - Acabados y Diseños 1A");
            helper.setText(plantillaCotizacionRechazadaTexto(numeroCotizacion, motivo), plantillaCotizacionRechazadaHtml(numeroCotizacion, motivo));
            helper.addInline("logoAcabados", new ClassPathResource("email/logo-acabados.png"));
            mailSender.send(mensaje);
        } catch (Exception e) {
            throw new RuntimeException("No se pudo enviar el correo de cotización rechazada.", e);
        }
    }

    private boolean tieneTexto(String s) {
        return s != null && !s.isBlank();
    }

    String plantillaCotizacionRechazadaTexto(String numeroCotizacion, String motivo) {
        StringBuilder t = new StringBuilder();
        t.append("Revisamos tu cotización ").append(numeroCotizacion).append(" y por ahora no podemos continuar con ella.\n\n");
        if (tieneTexto(motivo)) t.append("Motivo: ").append(motivo.trim()).append("\n\n");
        t.append("Puedes pedir una cotización nueva ajustando lo que necesites, o escríbenos por WhatsApp y con gusto te ayudamos a encontrar una opción.");
        return t.toString();
    }

    String plantillaCotizacionRechazadaHtml(String numeroCotizacion, String motivo) {
        StringBuilder html = new StringBuilder(htmlAbrir() + htmlHeader());
        html.append("<tr><td style=\"padding:36px 32px 6px;text-align:center;\">")
            .append("<h1 style=\"margin:0 0 14px;font-size:22px;line-height:1.3;color:#1A1A2E;font-weight:800;\">Sobre tu cotización</h1>")
            .append("<p style=\"margin:0 0 6px;font-size:15px;color:#444444;line-height:1.6;\">Revisamos tu solicitud y por ahora no podemos continuar con ella.</p>")
            .append("</td></tr>");
        html.append("<tr><td style=\"padding:6px 32px 0;text-align:center;\">").append(chip("Cotización " + numeroCotizacion)).append("</td></tr>");

        if (tieneTexto(motivo)) {
            html.append("<tr><td style=\"padding:20px 32px 4px;\">")
                .append("<table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" style=\"background-color:#FBEDEA;border-radius:8px;\">")
                .append("<tr><td style=\"padding:14px 16px;\">")
                .append("<p style=\"margin:0 0 4px;font-size:11px;font-weight:800;letter-spacing:1px;text-transform:uppercase;color:#C0392B;font-family:Arial,sans-serif;\">Motivo</p>")
                .append("<p style=\"margin:0;font-size:14px;color:#5c1a1a;line-height:1.55;\">").append(escapar(motivo.trim())).append("</p>")
                .append("</td></tr></table></td></tr>");
        }

        html.append(avisoAmbar("Puedes pedir una <strong>cotización nueva</strong> ajustando lo que necesites, o escríbenos por WhatsApp y con gusto te ayudamos a encontrar una opción."));
        html.append(htmlFooter()).append(htmlCerrar());
        return html.toString();
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

    // ── Helpers compartidos por los correos HTML con resumen (cotización aprobada / confirmación) ──

    private String formatoCOP(BigDecimal valor) {
        NumberFormat f = NumberFormat.getCurrencyInstance(ES_CO);
        f.setMaximumFractionDigits(0);
        return f.format(valor == null ? BigDecimal.ZERO : valor);
    }

    // Recibe la fecha ISO (YYYY-MM-DD) que empacó el frontend en `observaciones` y la muestra en
    // español ("12 de septiembre de 2026"). Si viene vacía o no parsea, devuelve null y el correo
    // simplemente no muestra la línea de fecha.
    private String formatoFechaLarga(String fechaIso) {
        if (fechaIso == null || fechaIso.isBlank()) return null;
        try {
            LocalDate d = LocalDate.parse(fechaIso.trim());
            return d.format(DateTimeFormatter.ofPattern("d 'de' MMMM 'de' yyyy", ES_CO));
        } catch (Exception e) {
            return null;
        }
    }

    // Los nombres de producto/servicio los escribe el admin — se escapan antes de meterlos en el
    // HTML del correo para que un "&" o un "<" no rompan el marcado.
    private String escapar(String s) {
        if (s == null) return "";
        return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace("\"", "&quot;");
    }

    private String chip(String texto) {
        return "<span style=\"display:inline-block;background-color:#F0F1F4;border-radius:8px;padding:6px 14px;"
            + "font-size:12px;font-weight:800;color:#1A1A2E;letter-spacing:0.5px;font-family:Arial,sans-serif;\">"
            + escapar(texto) + "</span>";
    }

    // Una sección del resumen (Servicios o Productos). Devuelve "" si la lista viene vacía, así el
    // mismo correo sirve para una compra de solo productos, un anticipo de solo servicios o una
    // mezcla, mostrando únicamente las secciones que aplican. El color del título es lo que separa
    // visualmente servicios (ámbar) de productos (rojo de la marca).
    private String seccionResumen(String titulo, String colorAcento, List<LineaResumen> lineas) {
        if (lineas == null || lineas.isEmpty()) return "";
        StringBuilder filas = new StringBuilder();
        for (LineaResumen l : lineas) {
            filas.append("<tr>")
                .append("<td style=\"padding:9px 0;font-size:14px;color:#1A1A2E;border-bottom:1px solid #EEEEEE;\">")
                .append(escapar(l.nombre()));
            if (l.detalle() != null && !l.detalle().isBlank()) {
                filas.append("<span style=\"color:#999999;font-size:12px;\"> &middot; ").append(escapar(l.detalle())).append("</span>");
            }
            filas.append("</td>")
                .append("<td style=\"padding:9px 0;font-size:14px;color:#1A1A2E;font-weight:700;text-align:right;")
                .append("border-bottom:1px solid #EEEEEE;white-space:nowrap;\">")
                .append(formatoCOP(l.monto()))
                .append("</td></tr>");
        }
        return "<tr><td style=\"padding:16px 32px 0;\">"
            + "<p style=\"margin:0 0 2px;font-size:12px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;color:"
            + colorAcento + ";font-family:Arial,sans-serif;\">" + titulo + "</p>"
            + "<table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\">" + filas + "</table>"
            + "</td></tr>";
    }

    private String lineasTexto(String titulo, List<LineaResumen> lineas) {
        if (lineas == null || lineas.isEmpty()) return "";
        StringBuilder t = new StringBuilder(titulo).append(":\n");
        for (LineaResumen l : lineas) {
            t.append("- ").append(l.nombre());
            if (l.detalle() != null && !l.detalle().isBlank()) t.append(" (").append(l.detalle()).append(")");
            t.append(": ").append(formatoCOP(l.monto())).append("\n");
        }
        return t.toString();
    }

    private String avisoAmbar(String contenidoHtml) {
        return "<tr><td style=\"padding:24px 32px 32px;\">"
            + "<table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" style=\"background-color:#FBF4E4;border-radius:8px;\">"
            + "<tr><td style=\"padding:14px 16px;font-size:13px;color:#8a5c06;line-height:1.5;\">" + contenidoHtml + "</td></tr></table>"
            + "</td></tr>";
    }
}
