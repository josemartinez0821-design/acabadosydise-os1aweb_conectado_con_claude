package com.acabados1a.backend.service;

import com.acabados1a.backend.service.EmailService.DatosConfirmacionPedido;
import com.acabados1a.backend.service.EmailService.DatosCotizacionAprobada;
import com.acabados1a.backend.service.EmailService.LineaResumen;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

// Prueba de render puro de las plantillas de correo (sin @SpringBootTest: EmailService solo
// necesita el JavaMailSender para enviar, no para armar el HTML). Cubre lo que pidió el negocio:
// que servicios y productos salgan en secciones separadas, que el anticipo del 50% de una
// cotización de solo servicios tenga su propio encabezado y saldo pendiente, y que el HTML quede
// bien cerrado. Si alguien rompe una etiqueta al editar un template, esto falla en el build.
class EmailServiceRenderTest {

    private final EmailService email = new EmailService(null);

    private static void assertHtmlBienFormado(String html) {
        assertTrue(html.startsWith("<!doctype html><html>"), "arranca con el doctype del marco");
        assertTrue(html.trim().endsWith("</body></html>"), "cierra body y html");
        for (String tag : List.of("table", "tr", "td", "p", "h1")) {
            long abre = html.split("<" + tag + "[ >]", -1).length - 1;
            long cierra = html.split("</" + tag + ">", -1).length - 1;
            assertEquals(abre, cierra, "etiquetas <" + tag + "> descuadradas");
        }
    }

    @Test
    void cotizacionAprobada_muestraServiciosYProductosPorSeparado() {
        var datos = new DatosCotizacionAprobada(
            "COT-014",
            "Confirmamos la visita para la fecha que pediste. El valor incluye materiales y mano de obra.",
            List.of(new LineaResumen("Aplicación de Pintura",
                EmailService.descripcionCantidadServicio(new BigDecimal("8.00"), true, false), new BigDecimal("120000"))),
            List.of(new LineaResumen("Estuco Plástico Tesacol", "x2", new BigDecimal("58000"))),
            new BigDecimal("178000"), new BigDecimal("89000"), 15, "2026-09-12");

        String html = email.plantillaCotizacionAprobadaHtml(datos);
        assertHtmlBienFormado(html);
        assertTrue(html.contains(">Servicios<") && html.contains(">Productos<"), "las dos secciones");
        assertTrue(html.contains("Aplicación de Pintura") && html.contains("8 horas"));
        assertTrue(html.contains("Nota de tu asesor"));
        assertTrue(html.contains("12 de septiembre de 2026"), "fecha deseada en español");

        String texto = email.plantillaCotizacionAprobadaTexto(datos);
        assertTrue(texto.contains("Anticipo para agendar (50%): "));
        assertTrue(texto.contains("Servicios:") && texto.contains("Productos:"));
    }

    @Test
    void confirmacionPedido_anticipoDeServicio_tieneEncabezadoYSaldoPropios() {
        var datos = new DatosConfirmacionPedido(
            "VEN-2026-045",
            List.of(),
            List.of(new LineaResumen("Instalación de Drywall",
                EmailService.descripcionCantidadServicio(new BigDecimal("1"), false, true), new BigDecimal("150000"))),
            new BigDecimal("75000"), false, true, "COT-020", new BigDecimal("75000"), "2026-10-01");

        String html = email.plantillaConfirmacionPedidoHtml(datos);
        assertHtmlBienFormado(html);
        assertTrue(html.contains("¡Recibimos tu anticipo!"));
        assertTrue(html.contains("Anticipo pagado") && html.contains("Saldo pendiente"));
        assertTrue(html.contains("Cotización COT-020"));
        assertTrue(html.contains("1 día"), "servicio por día, singular");
        assertFalse(html.contains(">Productos<"), "sin sección de productos en un anticipo de solo servicios");

        assertTrue(email.plantillaConfirmacionPedidoTexto(datos).contains("Saldo pendiente: "));
    }

    @Test
    void confirmacionPedido_compraNormal_soloProductosYEscapaComillas() {
        var datos = new DatosConfirmacionPedido(
            "VEN-2026-046",
            List.of(
                new LineaResumen("Pintura Viniltex Blanco", "x3", new BigDecimal("174000")),
                new LineaResumen("Rodillo Goya 9\"", "x1", new BigDecimal("18000"))),
            List.of(),
            new BigDecimal("192000"), true, false, null, null, null);

        String html = email.plantillaConfirmacionPedidoHtml(datos);
        assertHtmlBienFormado(html);
        assertTrue(html.contains("¡Gracias por tu compra!"));
        assertTrue(html.contains(">Productos<"));
        assertFalse(html.contains(">Servicios<"), "sin sección de servicios en una compra de solo productos");
        assertTrue(html.contains("local de la transportadora"), "aviso de contraentrega");
        assertTrue(html.contains("Rodillo Goya 9&quot;"), "comillas del nombre escapadas");
    }

    @Test
    void descripcionCantidadServicio_cubreHoraDiaYProyecto() {
        assertEquals("8 horas", EmailService.descripcionCantidadServicio(new BigDecimal("8.00"), true, false));
        assertEquals("1 hora", EmailService.descripcionCantidadServicio(BigDecimal.ONE, true, false));
        assertEquals("2 días", EmailService.descripcionCantidadServicio(new BigDecimal("2"), false, true));
        assertEquals("1 día", EmailService.descripcionCantidadServicio(BigDecimal.ONE, false, true));
        assertEquals("Precio por proyecto", EmailService.descripcionCantidadServicio(BigDecimal.ONE, false, false));
    }
}
