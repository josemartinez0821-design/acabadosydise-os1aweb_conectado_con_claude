package com.acabados1a.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

// @EnableAsync habilita los métodos @Async (hoy solo EmailService) - sin esto, @Async se ignora
// silenciosamente y el método sigue ejecutándose de forma síncrona como si nada.
// @EnableScheduling habilita @Scheduled (hoy solo CotizacionService.enviarRecordatoriosVencimiento)
// - sin esto el método con @Scheduled simplemente nunca se ejecuta, sin ningún error ni aviso.
@EnableAsync
@EnableScheduling
@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

}
