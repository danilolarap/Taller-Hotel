package com.hotel.facade;

import com.hotel.model.*;
import com.hotel.service.*;
import com.hotel.repository.HotelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
public class HotelFacade {

    @Autowired private HotelRepository repository;
    @Autowired private PriceService priceService;
    @Autowired private ExtraService extraService;
    @Autowired private KeyService keyService;

    public List<Room> consultarDisponibilidad() {
        return repository.findAllRooms().stream()
                .filter(Room::isAvailable)
                .collect(Collectors.toList());
    }

    public String createReservation(String guest, int roomId, boolean highSeason) {
        Room room = repository.findAllRooms().stream()
                .filter(r -> r.getId() == roomId && r.isAvailable())
                .findFirst().orElse(null);

        if (room == null) return "Habitación no disponible.";

        double total = priceService.calculateRate(room.getBasePrice(), highSeason);
        Booking booking = new Booking(guest, room, total);
        room.setAvailable(false);
        repository.saveBooking(booking);

        return "Reserva exitosa para " + guest + ". ID: " + booking.getId();
    }

    public String performCheckIn(UUID bookingId) {
        Booking b = repository.findBookingById(bookingId);
        if (b == null) return "No se encontró la reserva.";

        b.setAccessKey(keyService.generateKey());
        return "Check-in realizado. Llave digital: " + b.getAccessKey();
    }

    public String agregarServicioExtra(UUID reservaId, String tipo) {
        Booking b = repository.findBookingById(reservaId);
        if (b == null) return "Reserva no encontrada.";

        double costo = extraService.getServiceCost(tipo);
        b.addExtraService(tipo, costo);
        return "Servicio de " + tipo + " añadido. Nuevo total: $" + b.getTotalAmount();
    }

    public String realizarCheckOut(UUID reservaId) {
        Booking b = repository.findBookingById(reservaId);
        if (b == null) return "Error: Reserva no encontrada.";

        // Liberar habitación
        b.getRoom().setAvailable(true);

        // Generar factura detallada
        return String.format(
                "--- FACTURA HOTEL ---\nCliente: %s\nHabitación: %s\nServicios: %s\nTOTAL: $%.2f\n¡Gracias!",
                b.getGuestName(), b.getRoom().getType(), b.getServicesSummary(), b.getTotalAmount()
        );
    }
}