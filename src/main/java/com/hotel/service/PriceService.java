package com.hotel.service;
import org.springframework.stereotype.Service;

@Service
public class PriceService {
    // Temporada alta = base x 1.5 [cite: 123]
    public double calculateRate(double base, boolean isHighSeason) {
        return isHighSeason ? base * 1.5 : base;
    }
}