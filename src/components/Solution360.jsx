const Solutions = () => {
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
          <button className="btn-reserve">QUIERO RESERVAR</button>
          <button className="btn-club">SOY UN CLUB</button>
        </div>
      </div>

      <div className="solutions-dashboard">
        <div className="dashboard-header">
          <span>DASHBOARD DE GESTIÓN</span>
          <div className="status-dot"></div>
        </div>
        <div className="dashboard-mockup">
          <div className="mock-line long"></div>
          <div className="mock-line short"></div>
          <div className="mock-cards">
            <div className="mock-card"></div>
            <div className="mock-card"></div>
            <div className="mock-card"></div>
          </div>
          <div className="mock-chart">
             <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="20" x2="12" y2="10"></line>
                <line x1="18" y1="20" x2="18" y2="4"></line>
                <line x1="6" y1="20" x2="6" y2="16"></line>
             </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Solutions;