package com.hotel.controller;

import com.hotel.facade.HotelFacade;
import com.hotel.model.Room; // Importante para la lista de habitaciones
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/hotel")
@CrossOrigin(origins = "*") // Permite conexión del Frontend
public class HotelController {

    @Autowired
    private HotelFacade hotelFacade;

    // 1. ENDPOINT DE DISPONIBILIDAD (¡Este era el que faltaba!)
    @GetMapping("/disponibilidad")
    public List<Room> getDisponibilidad() {
        return hotelFacade.consultarDisponibilidad();
    }

    // 2. ENDPOINT PARA RESERVAR
    @PostMapping("/reservar")
    public String reserve(@RequestParam String name, @RequestParam int roomId, @RequestParam(defaultValue = "false") boolean highSeason) {
        return hotelFacade.createReservation(name, roomId, highSeason);
    }

    // 3. ENDPOINT PARA CHECK-IN
    @PutMapping("/checkin/{id}")
    public String checkIn(@PathVariable UUID id) {
        return hotelFacade.performCheckIn(id);
    }

    // 4. ENDPOINT PARA AGREGAR SERVICIOS (Spa, Desayuno, etc.)
    @PostMapping("/servicios/{reservaId}")
    public String addService(@PathVariable UUID reservaId, @RequestParam String tipo) {
        return hotelFacade.agregarServicioExtra(reservaId, tipo);
    }

    // 5. ENDPOINT PARA CHECK-OUT Y FACTURA
    @PutMapping("/checkout/{reservaId}")
    public String checkOut(@PathVariable UUID reservaId) {
        return hotelFacade.realizarCheckOut(reservaId);
    }
}