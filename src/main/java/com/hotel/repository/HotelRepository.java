package com.hotel.repository;
import com.hotel.model.*;
import org.springframework.stereotype.Repository;
import java.util.*;

@Repository
public class HotelRepository {
    // Las listas se marcan como final para que la referencia no cambie
    private final List<Room> rooms = new ArrayList<>();
    private final Map<UUID, Booking> bookings = new HashMap<>();

    public HotelRepository() {
        // Inicialización de 15 habitaciones [cite: 127]
        for (int i = 1; i <= 5; i++) rooms.add(new Room(i, "Sencilla", 100.0));
        for (int i = 6; i <= 10; i++) rooms.add(new Room(i, "Doble", 200.0));
        for (int i = 11; i <= 15; i++) rooms.add(new Room(i, "Suite", 300.0));
    }

    public List<Room> findAllRooms() { return rooms; }
    public void saveBooking(Booking b) { bookings.put(b.getId(), b); }
    public Booking findBookingById(UUID id) { return bookings.get(id); }
}