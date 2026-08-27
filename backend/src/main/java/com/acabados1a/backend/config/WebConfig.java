package com.acabados1a.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

// Sirve las imágenes de producto subidas por el admin (ProductoService.subirImagen) como archivos
// estáticos. La URL guardada en imagen_url es "/uploads/productos/<archivo>" y en disco vive en
// "uploads/productos/<archivo>" (relativo a donde corre el backend) - por eso el mapeo es
// "/uploads/**" -> carpeta "uploads/" (el "productos/" queda igual en los dos lados). "file:" +
// terminar en "/" es obligatorio para que Spring lo trate como carpeta del sistema de archivos y
// no un recurso del classpath.
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/uploads/**")
            .addResourceLocations("file:uploads/");
    }
}
