import { useState } from 'react';
import './App.css';

const API_URL = 'http://localhost:8080/api/hotel';

function App() {
  const [step, setStep] = useState('search');
  const [rooms, setRooms] = useState([]);
  const [dates, setDates] = useState({ checkIn: '', checkOut: '' });
  const [isHighSeason, setIsHighSeason] = useState(false);

  const [selectedRoom, setSelectedRoom] = useState(null);
  const [guestName, setGuestName] = useState('');
  const [bookingId, setBookingId] = useState('');
  const [invoice, setInvoice] = useState('');
  const [message, setMessage] = useState('');

  // Función para reiniciar todo SIN recargar la página
  const resetApp = () => {
    setStep('search');
    setGuestName('');
    setBookingId('');
    setInvoice('');
    setMessage('');
    setSelectedRoom(null);
  };

  const handleSearch = async (e) => {
    e.preventDefault(); // Evita que la página intente recargarse
    if (!dates.checkIn || !dates.checkOut) {
      setMessage("⚠️ Por favor selecciona las fechas de llegada y salida.");
      return;
    }

    const month = new Date(dates.checkIn).getMonth() + 1;
    const highSeason = [6, 7, 8, 12].includes(month);
    setIsHighSeason(highSeason);

    try {
      const response = await fetch(`${API_URL}/disponibilidad`);
      const data = await response.json();
      setRooms(data);
      setMessage("✅ Habitaciones disponibles encontradas.");
    } catch (error) {
      setMessage("❌ Error: No se pudo conectar con el servidor (Verifica IntelliJ).");
    }
  };

  const handleReserve = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
          `${API_URL}/reservar?name=${encodeURIComponent(guestName)}&roomId=${selectedRoom.id}&highSeason=${isHighSeason}`,
          { method: 'POST' }
      );
      const text = await response.text();

      // Extraemos el código ocultando el formato feo de UUID
      const idMatch = text.match(/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/i);
      if (idMatch) {
        setBookingId(idMatch[0]);
        setStep('manage');
        setMessage(`¡Listo ${guestName}! Tu reserva ha sido confirmada con éxito.`);
      } else {
        setMessage("Hubo un problema al crear la reserva. Intenta de nuevo.");
      }
    } catch (error) {
      setMessage("❌ Error de conexión al reservar.");
    }
  };

  const handleCheckIn = async () => {
    const res = await fetch(`${API_URL}/checkin/${bookingId}`, { method: 'PUT' });
    setMessage("🔑 " + await res.text());
  };

  const handleAddService = async (tipo) => {
    const res = await fetch(`${API_URL}/servicios/${bookingId}?tipo=${tipo}`, { method: 'POST' });
    setMessage("🛒 " + await res.text());
  };

  const handleCheckOut = async () => {
    const res = await fetch(`${API_URL}/checkout/${bookingId}`, { method: 'PUT' });
    const facturatext = await res.text();

    // Limpiamos la factura para que se vea como texto normal y no como código
    const cleanInvoice = facturatext
        .replace('--- FACTURA FINAL ---', '')
        .replace('--- FACTURA HOTEL ---', '')
        .replace('¡Gracias por su visita!', '')
        .replace('¡Gracias!', '')
        .trim();

    setInvoice(cleanInvoice);
    setStep('invoice');
    setMessage("✅ Check-Out exitoso. ¡Vuelve pronto!");
  };

  return (
      <div className="app-container">
        <header className="hero">
          <div className="hero-overlay">
            <h1>Hotel Now!</h1>
            <p>La mejor experiencia de descanso, sin complicaciones.</p>
          </div>
        </header>

        {message && <div className="alert-message">{message}</div>}

        <main className="main-content">

          {/* VISTA 1: BÚSQUEDA */}
          {step === 'search' && (
              <section className="view-section">
                <h2 className="section-title">Buscar Disponibilidad</h2>
                <form onSubmit={handleSearch} className="search-form box-shadow">
                  <div className="input-group">
                    <label>Fecha de Llegada</label>
                    <input type="date" value={dates.checkIn} onChange={e => setDates({...dates, checkIn: e.target.value})} required/>
                  </div>
                  <div className="input-group">
                    <label>Fecha de Salida</label>
                    <input type="date" value={dates.checkOut} onChange={e => setDates({...dates, checkOut: e.target.value})} required/>
                  </div>
                  <button type="submit" className="btn-primary">Buscar</button>
                </form>

                <div className="rooms-grid">
                  {rooms.map(room => (
                      <div key={room.id} className="room-card box-shadow">
                        <h3>Tipo: {room.type}</h3>
                        <p className="price-tag">
                          ${isHighSeason ? (room.basePrice * 1.5).toFixed(2) : room.basePrice.toFixed(2)}
                        </p>
                        <p className="price-label">Precio por noche</p>

                        {isHighSeason && <div className="badge-alert">Temporada Alta</div>}

                        <button onClick={() => { setSelectedRoom(room); setStep('book'); setMessage(''); }} className="btn-action">
                          Reservar Esta Habitación
                        </button>
                      </div>
                  ))}
                </div>
              </section>
          )}

          {/* VISTA 2: RESERVA */}
          {step === 'book' && (
              <section className="view-section box-shadow card-padding">
                <h2 className="section-title">Detalles de la Reserva</h2>
                <div className="info-box">
                  <p>Habitación seleccionada: <strong>{selectedRoom.type}</strong></p>
                  <p>Total a pagar por noche: <strong className="highlight-text">${isHighSeason ? selectedRoom.basePrice * 1.5 : selectedRoom.basePrice}</strong></p>
                </div>

                <form onSubmit={handleReserve} className="booking-form">
                  <div className="input-group full-width">
                    <label>Nombre del titular de la reserva:</label>
                    <input type="text" value={guestName} onChange={e => setGuestName(e.target.value)} required placeholder="Ej: Maria Gonzalez" />
                  </div>
                  <div className="button-group">
                    <button type="button" onClick={() => setStep('search')} className="btn-secondary">Cancelar y Volver</button>
                    <button type="submit" className="btn-primary">Confirmar y Pagar</button>
                  </div>
                </form>
              </section>
          )}

          {/* VISTA 3: PANEL DE GESTIÓN */}
          {step === 'manage' && (
              <section className="view-section box-shadow card-padding">
                <h2 className="section-title">Gestión de Estadía</h2>
                <div className="code-box">
                  <span>Tu número de reserva es:</span>
                  <strong className="code-number">{bookingId.substring(0, 6).toUpperCase()}</strong>
                </div>

                <div className="dashboard-grid">
                  <div className="dashboard-card">
                    <h3>1. Recepción</h3>
                    <p>Obtén tu llave digital para ingresar a la habitación.</p>
                    <button onClick={handleCheckIn} className="btn-primary full-width">Hacer Check-In</button>
                  </div>

                  <div className="dashboard-card">
                    <h3>2. Servicios Extra</h3>
                    <p>Carga servicios adicionales a tu cuenta.</p>
                    <div className="service-buttons">
                      <button onClick={() => handleAddService('Spa')} className="btn-outline">Añadir Spa ($50)</button>
                      <button onClick={() => handleAddService('Desayuno')} className="btn-outline">Añadir Desayuno ($15)</button>
                      <button onClick={() => handleAddService('Traslado')} className="btn-outline">Añadir Traslado ($30)</button>
                    </div>
                  </div>
                </div>

                <div className="checkout-area">
                  <h3>3. Salida del Hotel</h3>
                  <p>Al hacer Check-Out, entregarás la habitación y generaremos tu recibo.</p>
                  <button onClick={handleCheckOut} className="btn-danger">Hacer Check-Out Final</button>
                </div>
              </section>
          )}

          {/* VISTA 4: FACTURA */}
          {step === 'invoice' && (
              <section className="view-section">
                <div className="receipt-card box-shadow">
                  <div className="receipt-header">
                    <h2>Hotel Now!</h2>
                    <p>Comprobante de Estadía</p>
                  </div>
                  <div className="receipt-body">
                    <pre className="receipt-text">{invoice}</pre>
                  </div>
                  <div className="receipt-footer">
                    <button onClick={resetApp} className="btn-primary full-width">Finalizar y Volver al Inicio</button>
                  </div>
                </div>
              </section>
          )}
        </main>
      </div>
  );
}

export default App;