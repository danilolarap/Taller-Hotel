package com.hotel.service;
import org.springframework.stereotype.Service;

@Service
public class ExtraService {
    // Costos adicionales fijos [cite: 124]
    public double getServiceCost(String type) {
        return switch (type.toLowerCase()) {
            case "spa" -> 50.0;
            case "desayuno" -> 15.0;
            case "traslado" -> 30.0;
            default -> 0.0;
        };
    }
}