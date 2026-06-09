import { useNavigate } from 'react-router-dom';
import './solutions.css';

const Solutions = () => {
  const navigate = useNavigate();

  return (
    <section className="solutions" id="nosotros">
      <div className="solutions-content">
        <h2>Soluciones 360° para el <span className="highlight">Ecosistema Pádel</span></h2>
        
        <div className="feature-item">
          <div className="feature-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <div className="feature-text">
            <h3>Para Jugadores</h3>
            <p>Reserva tu pista en segundos, encuentra compañeros de tu nivel y gestiona tus partidos desde cualquier dispositivo.</p>
          </div>
        </div>

        <div className="feature-item">
          <div className="feature-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="3" y1="9" x2="21" y2="9"></line>
              <line x1="9" y1="21" x2="9" y2="9"></line>
            </svg>
          </div>
          <div className="feature-text">
            <h3>Para Clubes</h3>
            <p>Optimiza la ocupación de tus pistas, automatiza cobros y obtén reportes detallados para hacer crecer tu negocio.</p>
          </div>
        </div>

        <div className="solutions-actions">
          <button className="btn-reserve" onClick={() => navigate('/complejos')}>QUIERO RESERVAR</button>
          <button className="btn-club" onClick={() => navigate('/register')}>SOY UN CLUB</button>
        </div>
      </div>

      <div className="solutions-dashboard tournaments-widget">
        <div className="dashboard-header">
          <div className="header-title-live">
            <svg viewBox="0 0 24 24" fill="none" stroke="#bef264" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
            <span>PRÓXIMOS EVENTOS</span>
          </div>
          <span className="badge-zone">Tucumán</span>
        </div>
        
        <div className="tournaments-list">
          <div className="tournament-card">
            <div className="tournament-date">
              <span className="t-month">MAY</span>
              <span className="t-day">18</span>
            </div>
            <div className="tournament-info">
              <span className="t-title">Americana 6ta y 7ma</span>
              <span className="t-club">Marcos Paz PADEL</span>
              <div className="t-tags">
                <span className="tag-cupos">Últimos 2 cupos</span>
                <span className="tag-price">$6.000</span>
              </div>
            </div>
            <button className="btn-anotarse" onClick={() => navigate('/login')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <line x1="12" y1="5" x2="12" y2="19"></line>
              </svg>
            </button>
          </div>

          <div className="tournament-card">
            <div className="tournament-date">
              <span className="t-month">MAY</span>
              <span className="t-day">25</span>
            </div>
            <div className="tournament-info">
              <span className="t-title">Torneo Suma 11</span>
              <span className="t-club">Guillermina Padel</span>
              <div className="t-tags">
                <span className="tag-open">Abierto</span>
                <span className="tag-price">$12.000</span>
              </div>
            </div>
            <button className="btn-anotarse outline" onClick={() => navigate('/login')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <line x1="12" y1="5" x2="12" y2="19"></line>
              </svg>
            </button>
          </div>
        </div>

        <button className="btn-view-all-tournaments" onClick={() => navigate('/complejos')}>
          VER CALENDARIO COMPLETO
        </button>
      </div>
    </section>
  );
};

export default Solutions;