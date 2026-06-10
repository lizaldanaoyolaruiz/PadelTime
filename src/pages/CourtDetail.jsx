import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './CourtDetail.css';

const CourtDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [cancha, setCancha] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState('11:00 - 12:30');
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    setTimeout(() => {
      setCancha({
        id: id,
        name: "Pista Central - World Padel Tour Edition",
        location: "Madrid, Spain",
        status: "Certificado Oficial",
        image: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&q=80&w=1920",
        price: 32,
        specs: {
          surface: "Blue WPT Turf",
          lighting: "LED Pro",
          glass: "Panoramic 12mm",
          fence: "Pro Mesh"
        },
        description: "Disfruta de las mismas condiciones que los mejores jugadores del mundo. Nuestra pista central cuenta con el césped oficial del WPT, garantizando un rebote perfecto y máxima tracción.",
        services: [
          "Bolas nuevas Head Pro",
          "Agua mineral fría",
          "Toallas de microfibra",
          "Grabación de partido (Opcional)"
        ],
        recommended: [
          { id: 101, name: "Pista 4 - Indoor Pro", status: "Disponible ahora", image: "https://images.unsplash.com/photo-1574629810360-7efbb1925536?auto=format&fit=crop&q=80&w=400" },
          { id: 102, name: "Pista 2 - Panorámica", status: "Próxima libre: 19:30", image: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&q=80&w=400" },
          { id: 103, name: "Pista 7 - Individual", status: "Disponible ahora", image: "https://images.unsplash.com/photo-1526624536643-6c0b39be8eb8?auto=format&fit=crop&q=80&w=400" }
        ]
      });
      setLoading(false);
    }, 800);
  }, [id]);

  const handleReserva = () => {
    navigate('/confirmacion', {
      state: {
        complejo_id: "complejo_id_mock",
        clubNombre: "Sede Central",
        ubicacion: cancha.location,
        canchaNombre: cancha.name,
        canchaImagen: cancha.image,
        dia: selectedDate || "Hoy",
        horario: selectedSlot,
        precioAlquiler: 48000,
        precioLuz: 2500,
        total: 50500,
        senia: 15000
      }
    });
  };

  if (loading) return <div className="cd-loading">Cargando detalles de la cancha...</div>;

  return (
    <div className="cd-page-wrapper">
      <Navbar />
      
      <div className="cd-hero" style={{ backgroundImage: `url(${cancha.image})` }}>
        <div className="cd-hero-overlay"></div>
        <div className="cd-hero-content">
          <span className="cd-badge-premium">☆ PREMIUM EDITION</span>
          <h1 className="cd-title">{cancha.name}</h1>
          <div className="cd-subtitle-row">
            <span className="cd-location">📍 {cancha.location}</span>
            <span className="cd-status">✓ {cancha.status}</span>
          </div>
        </div>
      </div>

      <main className="cd-main-container">
        <div className="cd-content-split">
          
          <div className="cd-left-column">
            <div className="cd-specs-grid">
              <div className="cd-spec-card">
                <svg viewBox="0 0 24 24" fill="none" stroke="#bef264" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
                <span className="cd-spec-label">SUPERFICIE</span>
                <span className="cd-spec-value">{cancha.specs.surface}</span>
              </div>
              <div className="cd-spec-card">
                <svg viewBox="0 0 24 24" fill="none" stroke="#bef264" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
                <span className="cd-spec-label">ILUMINACIÓN</span>
                <span className="cd-spec-value">{cancha.specs.lighting}</span>
              </div>
              <div className="cd-spec-card">
                <svg viewBox="0 0 24 24" fill="none" stroke="#bef264" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path></svg>
                <span className="cd-spec-label">CRISTAL</span>
                <span className="cd-spec-value">{cancha.specs.glass}</span>
              </div>
              <div className="cd-spec-card">
                <svg viewBox="0 0 24 24" fill="none" stroke="#bef264" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
                <span className="cd-spec-label">CERCADO</span>
                <span className="cd-spec-value">{cancha.specs.fence}</span>
              </div>
            </div>

            <div className="cd-info-row">
              <div className="cd-info-card">
                <h3>Experiencia Profesional</h3>
                <p>{cancha.description}</p>
              </div>
              <div className="cd-info-card">
                <h3>Servicios Incluidos</h3>
                <ul className="cd-services-list">
                  {cancha.services.map((service, index) => (
                    <li key={index}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="#bef264" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      {service}
                    </li>
                  ))}
                </ul>
                <div className="cd-booked-today">
                  <div className="cd-avatars">
                    <div className="cd-avatar"></div>
                    <div className="cd-avatar"></div>
                    <div className="cd-avatar"></div>
                  </div>
                  <span>Reservado hoy</span>
                </div>
              </div>
            </div>
          </div>

          <aside className="cd-right-column">
            <div className="cd-booking-widget">
              <div className="cd-widget-header">
                <div className="cd-price-block">
                  <span className="cd-price-label">DESDE</span>
                  <div className="cd-price-value">{cancha.price}€ <span className="cd-price-unit">/ hora</span></div>
                </div>
                <span className="cd-badge-prime">PRIME TIME</span>
              </div>

              <div className="cd-date-selector">
                <label>Selecciona Fecha</label>
                <div className="cd-date-input-wrapper">
                  <input 
                    type="date" 
                    value={selectedDate} 
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="cd-slots-section">
                <label>Slots Disponibles</label>
                <div className="cd-slots-grid">
                  <button className={`cd-slot ${selectedSlot === '08:00 - 09:30' ? 'active' : ''}`} onClick={() => setSelectedSlot('08:00 - 09:30')}>08:00 - 09:30</button>
                  <button className={`cd-slot ${selectedSlot === '09:30 - 11:00' ? 'active' : ''}`} onClick={() => setSelectedSlot('09:30 - 11:00')}>09:30 - 11:00</button>
                  <button className={`cd-slot ${selectedSlot === '11:00 - 12:30' ? 'active' : ''}`} onClick={() => setSelectedSlot('11:00 - 12:30')}>11:00 - 12:30</button>
                  <button className="cd-slot disabled">12:30 - 14:00</button>
                  <button className={`cd-slot ${selectedSlot === '17:00 - 18:30' ? 'active' : ''}`} onClick={() => setSelectedSlot('17:00 - 18:30')}>17:00 - 18:30</button>
                  <button className={`cd-slot ${selectedSlot === '18:30 - 20:00' ? 'active' : ''}`} onClick={() => setSelectedSlot('18:30 - 20:00')}>18:30 - 20:00</button>
                </div>
              </div>

              <div className="cd-summary">
                <div className="cd-summary-row">
                  <span>Reserva (90 min)</span>
                  <span>48.00€</span>
                </div>
                <div className="cd-summary-row">
                  <span>Luz (LED Pro)</span>
                  <span>2.50€</span>
                </div>
                <div className="cd-summary-total">
                  <span>Total</span>
                  <span>50.50€</span>
                </div>
              </div>

              <button className="cd-btn-book" onClick={handleReserva}>RESERVAR AHORA</button>
              <span className="cd-cancel-policy">Cancelación gratuita hasta 24h antes</span>
            </div>
          </aside>

        </div>

        <section className="cd-recommended-section">
          <h2>Otras Pistas Recomendadas</h2>
          <div className="cd-recommended-grid">
            {cancha.recommended.map((rec) => (
              <div 
                className="cd-rec-card" 
                key={rec.id}
                onClick={() => navigate(`/cancha/${rec.id}`)}
              >
                <div className="cd-rec-img" style={{ backgroundImage: `url(${rec.image})` }}></div>
                <div className="cd-rec-info">
                  <h4>{rec.name}</h4>
                  <span className={rec.status.includes('ahora') ? 'status-green' : 'status-gray'}>{rec.status}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
};

export default CourtDetail;