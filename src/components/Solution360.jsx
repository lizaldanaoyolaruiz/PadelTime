import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTournaments } from '../services/tournamentsService';
import './solutions.css';

const MESES = ['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SEP','OCT','NOV','DIC'];

const CATEGORIA_LABEL = {
  amateur: 'Amateur', intermedio: 'Intermedio', avanzado: 'Avanzado',
  profesional: 'Profesional', mixto: 'Mixto',
};

function parseFecha(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr + 'T00:00:00');
  return { mes: MESES[d.getMonth()], dia: d.getDate() };
}

const Solutions = () => {
  const navigate = useNavigate();
  const [torneos, setTorneos] = useState([]);

  useEffect(() => {
    getTournaments({ estado: 'activo' })
      .then(res => {
        const all = res.data.torneos || res.data || [];
        setTorneos(all.filter(t => t.estado === 'activo').slice(0, 2));
      })
      .catch(() => setTorneos([]));
  }, []);

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
        </div>

        <div className="tournaments-list">
          {torneos.length === 0 ? (
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', textAlign: 'center', padding: '1rem 0' }}>
              No hay torneos activos próximos.
            </p>
          ) : (
            torneos.map(t => {
              const fecha = parseFecha(t.fechaInicio);
              return (
                <div
                  key={t._id}
                  className="tournament-card"
                  onClick={() => navigate('/torneos')}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="tournament-date">
                    <span className="t-month">{fecha?.mes || '—'}</span>
                    <span className="t-day">{fecha?.dia || '—'}</span>
                  </div>
                  <div className="tournament-info">
                    <span className="t-title">{t.nombre}</span>
                    <span className="t-club">{t.complejo?.name || t.ubicacion}</span>
                    {t.categoria && (
                      <div className="t-tags">
                        <span className="tag-open">{CATEGORIA_LABEL[t.categoria] || t.categoria}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        <button className="btn-view-all-tournaments" onClick={() => navigate('/torneos')}>
          VER CALENDARIO COMPLETO
        </button>
      </div>
    </section>
  );
};

export default Solutions;
