import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarDays, MapPin, Users, Trophy, ArrowRight } from 'lucide-react';
import { getTorneos } from '../services/torneosService';
import './torneosSection.css';

const CATEGORIA_LABEL = {
  amateur:     'Amateur',
  intermedio:  'Intermedio',
  avanzado:    'Avanzado',
  profesional: 'Profesional',
  mixto:       'Mixto',
};

function fmtDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('es-ES', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

export default function TorneosSection() {
  const [torneos, setTorneos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getTorneos({ estado: 'activo' })
      .then(res => {
        const all = res.data.torneos || res.data || [];
        const activos = all.filter(t => t.estado === 'activo').slice(0, 3);
        setTorneos(activos);
      })
      .catch(() => setTorneos([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;
  if (torneos.length === 0) return null;

  return (
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
            onClick={() => navigate('/torneos')}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && navigate('/torneos')}
          >
            <div className="ts-card-header">
              <span className="ts-badge-activo">En curso</span>
              <span className="ts-categoria">{CATEGORIA_LABEL[torneo.categoria] || torneo.categoria}</span>
            </div>
            <h3 className="ts-card-name">{torneo.nombre}</h3>
            {torneo.descripcion && (
              <p className="ts-card-desc">{torneo.descripcion}</p>
            )}
            <div className="ts-card-meta">
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
  );
}
