import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './ClubDetail.css';

const ClubDetail = () => {
  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="club-detail-main">
        <div className="club-header-section">
          <span className="badge-premium">✓ Club Premium</span>
          <h1>Padel Arena Elite</h1>
          <div className="club-info-row">
            <div className="club-location-contact">
              <span>📍 Av. Deportiva 450, Madrid</span>
              <span>📞 +34 912 345 678</span>
              <span>🕒 Lun - Dom: 07:00 - 23:30</span>
            </div>
            <div className="club-action-buttons">
              <button className="btn-secondary">🔗 Compartir</button>
              <button className="btn-secondary">♡ Favorito</button>
            </div>
          </div>
        </div>

        <div className="gallery-grid">
          <img src="https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&q=80&w=800" alt="Cancha principal" className="img-main" />
          <div className="gallery-right">
            <img src="https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&q=80&w=400" alt="Cancha detalle 1" className="img-sub" />
            <img src="https://images.unsplash.com/photo-1574629810360-7efbb1925536?auto=format&fit=crop&q=80&w=400" alt="Cancha detalle 2" className="img-sub" />
            <img src="https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&q=80&w=800" alt="Cancha detalle 3" className="img-wide" />
          </div>
        </div>

        <div className="content-split">
          <section className="courts-list">
            <div className="courts-header">
              <h2>Nuestras Canchas</h2>
              <span>6 canchas disponibles</span>
            </div>
            
            <div className="court-card">
              <div className="court-img-container">
                <span className="badge-status">Habilitada</span>
                <img src="https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&q=80&w=400" alt="Cancha 1" />
              </div>
              <div className="court-info">
                <div className="court-title-row">
                  <h3>Cancha Central WPT</h3>
                  <span className="court-price">35€/h</span>
                </div>
                <p>Cancha panorámica oficial con césped Mondo STX y máxima visibilidad. Ideal para torneos.</p>
                <div className="court-tags">
                  <span>Interior</span>
                  <span>Panorámica</span>
                  <span>Césped Azul</span>
                </div>
              </div>
            </div>

            <div className="court-card">
              <div className="court-img-container">
                <span className="badge-status">Habilitada</span>
                <img src="https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&q=80&w=400" alt="Cancha 2" />
              </div>
              <div className="court-info">
                <div className="court-title-row">
                  <h3>Cancha 2 - Outdoor</h3>
                  <span className="court-price">28€/h</span>
                </div>
                <p>Cancha al aire libre con iluminación LED Pro de última generación. Perfecta para jugar de noche.</p>
                <div className="court-tags">
                  <span>Exterior</span>
                  <span>LED Pro</span>
                  <span>Césped Verde</span>
                </div>
              </div>
            </div>
          </section>

          <aside className="booking-widget">
            <h3>Reserva tu turno</h3>
            
            <div className="calendar-section">
              <div className="calendar-header">
                <span>Mayo 2024</span>
                <div className="calendar-arrows">
                  <span>&lt;</span>
                  <span>&gt;</span>
                </div>
              </div>
              <div className="calendar-days">
                <div className="day"><span>L</span><span>12</span></div>
                <div className="day active"><span>M</span><span>13</span></div>
                <div className="day"><span>X</span><span>14</span></div>
                <div className="day"><span>J</span><span>15</span></div>
                <div className="day"><span>V</span><span>16</span></div>
                <div className="day"><span>S</span><span>17</span></div>
                <div className="day"><span>D</span><span>18</span></div>
              </div>
            </div>

            <div className="time-slots">
              <span>Horarios disponibles</span>
              <div className="slots-grid">
                <button className="slot">08:00</button>
                <button className="slot">09:00</button>
                <button className="slot active">10:00</button>
                <button className="slot disabled">11:00</button>
                <button className="slot">12:00</button>
                <button className="slot">13:00</button>
              </div>
            </div>

            <div className="booking-summary">
              <div className="summary-row">
                <span>Cancha Central x 1h</span>
                <span>35,00€</span>
              </div>
              <div className="summary-row">
                <span>Tasa de Servicio</span>
                <span>1,50€</span>
              </div>
              <div className="summary-total">
                <span>Total</span>
                <span>36,50€</span>
              </div>
              <button className="btn-book">Realizar Reserva</button>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ClubDetail;