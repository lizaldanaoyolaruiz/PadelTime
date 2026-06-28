import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarDays, MapPin, Users, Trophy, ArrowRight, X, Building2 } from 'lucide-react';
import { getTournaments } from '../services/tournamentsService';
import './tournamentsSection.css';

const CATEGORIA_LABEL = {
  amateur:     'Amateur',
  intermedio:  'Intermedio',
  avanzado:    'Avanzado',
  profesional: 'Profesional',
  mixto:       'Mixto',
};

const ESTADO_LABEL = { activo: 'Activo', finalizado: 'Finalizado', cancelado: 'Cancelado' };

function fmtDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('es-ES', {
    day: '2-digit', month: 'long', year: 'numeric',
  });
}

export default function TournamentsSection() {
  const [torneos,  setTorneos]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getTournaments({ estado: 'activo' })
      .then(res => {
        const all = res.data.torneos || res.data || [];
        setTorneos(all.filter(t => t.estado === 'activo').slice(0, 3));
      })
      .catch(() => setTorneos([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;
  if (torneos.length === 0) return null;

  const waLink = (torneo) => {
    const num = torneo.whatsapp?.replace(/\D/g, '');
    const msg = encodeURIComponent(`Hola, quiero información sobre el torneo "${torneo.nombre}"`);
    return `https://wa.me/${num}?text=${msg}`;
  };

  return (
    <>
      <section className="ts-section">
        <div className="ts-header">
          <div className="ts-title-wrap">
            <div className="ts-title-icon"><Trophy size={20} /></div>
            <div>
              <h2 className="ts-title">Próximos Torneos</h2>
              <p className="ts-subtitle">Eventos competitivos disponibles en tu zona</p>
            </div>
          </div>
          <button className="ts-ver-todos" onClick={() => navigate('/torneos')}>
            Ver todos los torneos
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="ts-grid">
          {torneos.map(torneo => (
            <div
              key={torneo._id}
              className="ts-card"
              onClick={() => setSelected(torneo)}
              role="button"
              tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && setSelected(torneo)}
            >
              <div className="ts-card-header">
                <span className="ts-categoria">{CATEGORIA_LABEL[torneo.categoria] || torneo.categoria}</span>
              </div>
              <h3 className="ts-card-name">{torneo.nombre}</h3>
              {torneo.descripcion && (
                <p className="ts-card-desc">{torneo.descripcion}</p>
              )}
              <div className="ts-card-meta">
                {torneo.complejo?.name && (
                  <span className="ts-meta-item">
                    <Building2 size={13} />
                    {torneo.complejo.name}
                  </span>
                )}
                <span className="ts-meta-item">
                  <CalendarDays size={13} />
                  {fmtDate(torneo.fechaInicio)} — {fmtDate(torneo.fechaFin)}
                </span>
                <span className="ts-meta-item">
                  <MapPin size={13} />
                  {torneo.ubicacion}
                </span>
                <span className="ts-meta-item">
                  <Users size={13} />
                  Cupo: {torneo.cupoMaximo}
                </span>
              </div>
              <div className="ts-card-footer">
                <span className="ts-ver-info">Ver información →</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {selected && (
        <div className="ts-modal-overlay" onClick={() => setSelected(null)}>
          <div className="ts-modal" onClick={e => e.stopPropagation()}>
            <div className="ts-modal-header">
              <div className="ts-modal-icon"><Trophy size={18} /></div>
              <div className="ts-modal-title-wrap">
                <h2 className="ts-modal-title">{selected.nombre}</h2>
                <div className="ts-modal-badges">
                  <span className={`ts-modal-badge ts-modal-badge--${selected.estado}`}>
                    {ESTADO_LABEL[selected.estado] || selected.estado}
                  </span>
                  {selected.categoria && (
                    <span className="ts-categoria">
                      {CATEGORIA_LABEL[selected.categoria] || selected.categoria}
                    </span>
                  )}
                </div>
              </div>
              <button className="ts-modal-close" onClick={() => setSelected(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="ts-modal-body">
              {selected.descripcion && (
                <p className="ts-modal-desc">{selected.descripcion}</p>
              )}
              <div className="ts-modal-grid">
                {selected.complejo?.name && (
                  <div className="ts-modal-field">
                    <Building2 size={15} />
                    <div>
                      <span className="ts-modal-field-label">Complejo</span>
                      <span className="ts-modal-field-value">{selected.complejo.name}</span>
                    </div>
                  </div>
                )}
                <div className="ts-modal-field">
                  <CalendarDays size={15} />
                  <div>
                    <span className="ts-modal-field-label">Fechas</span>
                    <span className="ts-modal-field-value">
                      {fmtDate(selected.fechaInicio)} → {fmtDate(selected.fechaFin)}
                    </span>
                  </div>
                </div>
                <div className="ts-modal-field">
                  <MapPin size={15} />
                  <div>
                    <span className="ts-modal-field-label">Ubicación</span>
                    <span className="ts-modal-field-value">{selected.ubicacion}</span>
                  </div>
                </div>
                <div className="ts-modal-field">
                  <Users size={15} />
                  <div>
                    <span className="ts-modal-field-label">Cupo máximo</span>
                    <span className="ts-modal-field-value">{selected.cupoMaximo} participantes</span>
                  </div>
                </div>
              </div>

              {selected.whatsapp && (
                <a
                  href={waLink(selected)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ts-modal-wa-btn"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Reservar por WhatsApp
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
