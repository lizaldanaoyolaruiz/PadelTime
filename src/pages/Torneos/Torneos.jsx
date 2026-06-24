import { useState, useEffect, useMemo } from 'react';
import {
  ChevronLeft, ChevronRight, Trophy, CalendarDays,
  MapPin, Users, X, Info,
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { getTorneos } from '../../services/torneosService';
import './torneos.css';

/* ── Helpers ── */
const MONTHS = [
  'Enero','Febrero','Marzo','Abril','Mayo','Junio',
  'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre',
];
const DAY_LABELS = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];

const CATEGORIA_LABEL = {
  amateur: 'Amateur', intermedio: 'Intermedio', avanzado: 'Avanzado',
  profesional: 'Profesional', mixto: 'Mixto',
};

const ESTADO_LABEL = { activo: 'Activo', finalizado: 'Finalizado', cancelado: 'Cancelado' };

function isoDate(date) {
  return date.toISOString().split('T')[0];
}

function fmtDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('es-ES', {
    day: '2-digit', month: 'long', year: 'numeric',
  });
}

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}

/* Returns true if isoDate string falls within [start, end] range */
function dateInRange(dateIso, startIso, endIso) {
  return dateIso >= startIso && dateIso <= endIso;
}

/* ── Component ── */
export default function Torneos() {
  const [torneos,      setTorneos]      = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [year,         setYear]         = useState(() => new Date().getFullYear());
  const [month,        setMonth]        = useState(() => new Date().getMonth());
  const [selected,     setSelected]     = useState(null);
  const [filter,       setFilter]       = useState('todos');
  const [detailTorneo, setDetailTorneo] = useState(null);

  useEffect(() => {
    getTorneos()
      .then(res => setTorneos(res.data.torneos || res.data || []))
      .catch(() => setTorneos([]))
      .finally(() => setLoading(false));
  }, []);

  /* Build calendar grid */
  const calendarDays = useMemo(() => {
    const daysInMonth  = getDaysInMonth(year, month);
    const firstWeekDay = getFirstDayOfMonth(year, month);
    const days = [];
    for (let i = 0; i < firstWeekDay; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(d);
    return days;
  }, [year, month]);

  /* Map: isoDate → list of torneos active that day */
  const tournamentsByDay = useMemo(() => {
    const map = {};
    torneos.forEach(t => {
      if (!t.fechaInicio || !t.fechaFin) return;
      const startIso = t.fechaInicio.split('T')[0];
      const endIso   = t.fechaFin.split('T')[0];
      const daysInM  = getDaysInMonth(year, month);
      for (let d = 1; d <= daysInM; d++) {
        const iso = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        if (dateInRange(iso, startIso, endIso)) {
          if (!map[d]) map[d] = [];
          map[d].push(t);
        }
      }
    });
    return map;
  }, [torneos, year, month]);

  /* Selected day's tournaments */
  const selectedTorneos = selected ? (tournamentsByDay[selected] || []) : [];

  /* Sidebar list filtered */
  const today = isoDate(new Date());
  const listedTorneos = useMemo(() => {
    const base = filter === 'todos' ? torneos : torneos.filter(t => t.estado === filter);
    return [...base].sort((a, b) => (a.fechaInicio || '').localeCompare(b.fechaInicio || ''));
  }, [torneos, filter]);

  /* Navigation */
  const prevMonth = () => {
    if (month === 0) { setYear(y => y - 1); setMonth(11); }
    else setMonth(m => m - 1);
    setSelected(null);
  };
  const nextMonth = () => {
    if (month === 11) { setYear(y => y + 1); setMonth(0); }
    else setMonth(m => m + 1);
    setSelected(null);
  };
  const goToday = () => {
    const now = new Date();
    setYear(now.getFullYear());
    setMonth(now.getMonth());
    setSelected(null);
  };

  const todayDay  = new Date().getDate();
  const todayMonth = new Date().getMonth();
  const todayYear  = new Date().getFullYear();

  return (
    <div className="tp-page">
      <Navbar />

      <main className="tp-main">
        <div className="tp-hero">
          <div className="tp-hero-icon"><Trophy size={28} /></div>
          <div>
            <h1 className="tp-hero-title">Torneos y Eventos</h1>
            <p className="tp-hero-sub">
              Explorá los próximos torneos, encontrá tu categoría y participá.
            </p>
          </div>
        </div>

        <div className="tp-layout">

          {/* ── Calendar ── */}
          <section className="tp-calendar-wrap">
            {/* Month nav */}
            <div className="tp-cal-nav">
              <div className="tp-cal-nav-controls">
                <button className="tp-nav-btn" onClick={prevMonth} aria-label="Mes anterior">
                  <ChevronLeft size={16} />
                </button>
                <span className="tp-nav-label">{MONTHS[month]} {year}</span>
                <button className="tp-nav-btn" onClick={nextMonth} aria-label="Mes siguiente">
                  <ChevronRight size={16} />
                </button>
                <button className="tp-nav-today" onClick={goToday}>Hoy</button>
              </div>
            </div>

            {/* Day headers */}
            <div className="tp-cal-grid">
              {DAY_LABELS.map(d => (
                <div key={d} className="tp-cal-day-header">{d}</div>
              ))}

              {/* Day cells */}
              {calendarDays.map((day, idx) => {
                if (!day) return <div key={`empty-${idx}`} className="tp-cal-cell tp-cal-cell--empty" />;

                const cellIso = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const isToday = day === todayDay && month === todayMonth && year === todayYear;
                const hasTorneos = (tournamentsByDay[day] || []).length > 0;
                const isSelected = selected === day;
                const dayTorneos = tournamentsByDay[day] || [];

                return (
                  <div
                    key={day}
                    className={[
                      'tp-cal-cell',
                      isToday    ? 'tp-cal-cell--today'    : '',
                      hasTorneos ? 'tp-cal-cell--has-event' : '',
                      isSelected ? 'tp-cal-cell--selected'  : '',
                      cellIso < today ? 'tp-cal-cell--past' : '',
                    ].filter(Boolean).join(' ')}
                    onClick={() => setSelected(isSelected ? null : day)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={e => e.key === 'Enter' && setSelected(isSelected ? null : day)}
                  >
                    <span className="tp-cal-day-num">{day}</span>
                    {hasTorneos && (
                      <div className="tp-cal-dots">
                        {dayTorneos.slice(0, 3).map((t, i) => (
                          <span
                            key={i}
                            className={`tp-cal-dot tp-cal-dot--${t.estado}`}
                            title={t.nombre}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="tp-cal-legend">
              <span className="tp-legend-item">
                <span className="tp-cal-dot tp-cal-dot--activo" />Activo
              </span>
              <span className="tp-legend-item">
                <span className="tp-cal-dot tp-cal-dot--finalizado" />Finalizado
              </span>
              <span className="tp-legend-item">
                <span className="tp-cal-dot tp-cal-dot--cancelado" />Cancelado
              </span>
            </div>

            {/* Selected day events */}
            {selected && (
              <div className="tp-day-events">
                <div className="tp-day-events-header">
                  <h4>
                    <CalendarDays size={15} />
                    {selected} de {MONTHS[month]}
                  </h4>
                  <button className="tp-day-close" onClick={() => setSelected(null)}>
                    <X size={14} />
                  </button>
                </div>
                {selectedTorneos.length === 0 ? (
                  <p className="tp-day-empty">No hay torneos en este día.</p>
                ) : (
                  selectedTorneos.map(t => (
                    <div
                      key={t._id}
                      className="tp-day-event-item"
                      onClick={() => setDetailTorneo(t)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={e => e.key === 'Enter' && setDetailTorneo(t)}
                    >
                      <span className={`tp-event-dot tp-cal-dot--${t.estado}`} />
                      <div className="tp-day-event-info">
                        <span className="tp-day-event-name">{t.nombre}</span>
                        <span className="tp-day-event-meta">{t.ubicacion}</span>
                      </div>
                      <Info size={13} className="tp-day-event-icon" />
                    </div>
                  ))
                )}
              </div>
            )}
          </section>

          {/* ── Sidebar list ── */}
          <aside className="tp-sidebar">
            <div className="tp-sidebar-header">
              <h3>Todos los Torneos</h3>
              <div className="tp-sidebar-filters">
                {[
                  { key: 'todos',     label: 'Todos'      },
                  { key: 'activo',    label: 'Activos'    },
                  { key: 'finalizado',label: 'Finalizados'},
                ].map(f => (
                  <button
                    key={f.key}
                    className={`tp-filter-chip${filter === f.key ? ' tp-filter-chip--active' : ''}`}
                    onClick={() => setFilter(f.key)}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <p className="tp-list-empty">Cargando torneos...</p>
            ) : listedTorneos.length === 0 ? (
              <p className="tp-list-empty">No hay torneos disponibles.</p>
            ) : (
              <div className="tp-list">
                {listedTorneos.map(torneo => (
                  <div
                    key={torneo._id}
                    className="tp-list-item"
                    onClick={() => setDetailTorneo(torneo)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={e => e.key === 'Enter' && setDetailTorneo(torneo)}
                  >
                    <div className="tp-list-top">
                      <span className="tp-list-name">{torneo.nombre}</span>
                      <span className={`tp-list-badge tp-badge--${torneo.estado}`}>
                        {ESTADO_LABEL[torneo.estado] || torneo.estado}
                      </span>
                    </div>
                    <div className="tp-list-meta">
                      <span><CalendarDays size={11} /> {fmtDate(torneo.fechaInicio)}</span>
                      <span><MapPin size={11} /> {torneo.ubicacion}</span>
                    </div>
                    {torneo.categoria && (
                      <span className="tp-list-cat">
                        {CATEGORIA_LABEL[torneo.categoria] || torneo.categoria}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </aside>
        </div>
      </main>

      <Footer />

      {/* ── Detail modal ── */}
      {detailTorneo && (
        <div className="tp-detail-overlay" onClick={() => setDetailTorneo(null)}>
          <div className="tp-detail-modal" onClick={e => e.stopPropagation()}>
            <div className="tp-detail-header">
              <div className="tp-detail-icon"><Trophy size={20} /></div>
              <div className="tp-detail-title-wrap">
                <h2 className="tp-detail-title">{detailTorneo.nombre}</h2>
                <div className="tp-detail-badges">
                  <span className={`tp-list-badge tp-badge--${detailTorneo.estado}`}>
                    {ESTADO_LABEL[detailTorneo.estado] || detailTorneo.estado}
                  </span>
                  {detailTorneo.categoria && (
                    <span className="tp-detail-cat">
                      {CATEGORIA_LABEL[detailTorneo.categoria] || detailTorneo.categoria}
                    </span>
                  )}
                </div>
              </div>
              <button className="tp-detail-close" onClick={() => setDetailTorneo(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="tp-detail-body">
              {detailTorneo.descripcion && (
                <p className="tp-detail-desc">{detailTorneo.descripcion}</p>
              )}
              <div className="tp-detail-grid">
                <div className="tp-detail-field">
                  <CalendarDays size={15} />
                  <div>
                    <span className="tp-detail-field-label">Fechas</span>
                    <span className="tp-detail-field-value">
                      {fmtDate(detailTorneo.fechaInicio)} → {fmtDate(detailTorneo.fechaFin)}
                    </span>
                  </div>
                </div>
                <div className="tp-detail-field">
                  <MapPin size={15} />
                  <div>
                    <span className="tp-detail-field-label">Ubicación</span>
                    <span className="tp-detail-field-value">{detailTorneo.ubicacion}</span>
                  </div>
                </div>
                <div className="tp-detail-field">
                  <Users size={15} />
                  <div>
                    <span className="tp-detail-field-label">Cupo máximo</span>
                    <span className="tp-detail-field-value">{detailTorneo.cupoMaximo} participantes</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
