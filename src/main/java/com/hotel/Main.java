package com.hotel;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication // Esta anotación es clave: le dice a Spring que busque tus componentes
public class Main {

    public static void main(String[] args) {
        // Esta línea inicia el servidor embebido (Tomcat) en el puerto 8080
        SpringApplication.run(Main.class, args);
        System.out.println("Servidor del Hotel iniciado exitosamente!");
    }
}