import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './BookingConfirmation.css';

const BookingConfirmation = () => {
  const navigate = useNavigate();

  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="confirmation-main">
        <div className="confirmation-container">
          
          <div className="confirmation-left">
            <h1 className="confirmation-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="#bef264" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              Confirmar Reserva
            </h1>

            <div className="summary-card">
              <div className="club-summary-header">
                <img src="https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&q=80&w=150" alt="Club" className="club-summary-img" />
                <div className="club-summary-info">
                  <h2>Premium Padel Club</h2>
                  <span className="location">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    Buenos Aires, Argentina
                  </span>
                  <span className="court-badge">Pista Central #4</span>
                </div>
              </div>

              <div className="datetime-row">
                <div className="datetime-block">
                  <span className="label">FECHA</span>
                  <span className="value">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#bef264" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    Viernes, 24 Mayo
                  </span>
                </div>
                <div className="datetime-block">
                  <span className="label">HORARIO</span>
                  <span className="value">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#bef264" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    19:00 - 20:30 (90 min)
                  </span>
                </div>
              </div>
            </div>

            <div className="breakdown-card">
              <span className="label">Desglose de Pago</span>
              <div className="breakdown-row">
                <span>Alquiler de Pista</span>
                <span>$12.000,00</span>
              </div>
              <div className="breakdown-row">
                <span>Luz (Nocturno)</span>
                <span>$1.500,00</span>
              </div>
              
              <div className="breakdown-total">
                <span>Total Reserva</span>
                <span className="total-amount">$13.500,00</span>
              </div>

              <div className="deposit-warning">
                <div className="warning-header">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                  </svg>
                  <span>Seña requerida: $5.000,00</span>
                </div>
                <p>El resto se abona en el club el día del turno.</p>
              </div>
            </div>
          </div>

          <div className="confirmation-right">
            <div className="payment-methods-card">
              <h2>Selecciona un método</h2>
              
              <div className="method-box">
                <div className="method-icon mp-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
                    <rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect>
                    <line x1="2" y1="10" x2="22" y2="10"></line>
                  </svg>
                </div>
                <h3>Mercado Pago</h3>
                <p>Confirmación Inmediata</p>
                <button className="btn-mp">PAGAR AHORA</button>
              </div>

              <div className="divider">
                <span>O TAMBIÉN</span>
              </div>

              <div className="method-box">
                <div className="method-icon wa-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                  </svg>
                </div>
                <h3>WhatsApp</h3>
                <p>Estado: Pendiente</p>
                <button className="btn-wa">RESERVAR VÍA CHAT</button>
              </div>

              <p className="terms-text">
                Al confirmar, aceptas nuestros <a href="#terminos">Términos de Servicio</a>.
              </p>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BookingConfirmation;