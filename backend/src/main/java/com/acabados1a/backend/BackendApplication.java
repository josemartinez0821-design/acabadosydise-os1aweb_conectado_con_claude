package com.acabados1a.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

// @EnableAsync habilita los métodos @Async (hoy solo EmailService) - sin esto, @Async se ignora
// silenciosamente y el método sigue ejecutándose de forma síncrona como si nada.
@EnableAsync
@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

}
