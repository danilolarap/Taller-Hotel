package com.hotel.service;
import org.springframework.stereotype.Service;
import java.util.UUID;

@Service
public class KeyService {
    // Generar UUID de acceso [cite: 125]
    public String generateKey() { return UUID.randomUUID().toString(); }
}