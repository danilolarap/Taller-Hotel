package com.hotel.model;

public class Room {
    // Campos marcados como final porque no cambian después de crearse
    private final int id;
    private final String type;
    private final double basePrice;
    private boolean isAvailable;

    public Room(int id, String type, double basePrice) {
        this.id = id;
        this.type = type;
        this.basePrice = basePrice;
        this.isAvailable = true;
    }

    // Getters
    public int getId() { return id; }
    public String getType() { return type; }
    public double getBasePrice() { return basePrice; }
    public boolean isAvailable() { return isAvailable; }

    // Setter (isAvailable no es final porque cambia su estado)
    public void setAvailable(boolean available) { isAvailable = available; }
}