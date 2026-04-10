package com.hotel.model;
import java.util.*;

public class Booking {
    private final UUID id;
    private final String guestName;
    private final Room room;
    private final List<String> extraServices = new ArrayList<>();
    private double totalAmount;
    private String accessKey;

    public Booking(String guestName, Room room, double initialAmount) {
        this.id = UUID.randomUUID();
        this.guestName = guestName;
        this.room = room;
        this.totalAmount = initialAmount;
    }

    public void addExtraService(String service, double cost) {
        this.extraServices.add(service);
        this.totalAmount += cost;
    }

    // Método para "consultar" la lista y que IntelliJ no marque aviso
    public String getServicesSummary() {
        if (extraServices.isEmpty()) return "Ninguno";
        return String.join(", ", extraServices);
    }

    // Getters y Setters
    public UUID getId() { return id; }
    public String getGuestName() { return guestName; }
    public Room getRoom() { return room; }
    public double getTotalAmount() { return totalAmount; }
    public String getAccessKey() { return accessKey; }
    public void setAccessKey(String key) { this.accessKey = key; }
}