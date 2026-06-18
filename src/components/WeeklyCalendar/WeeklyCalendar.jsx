import { useState, useMemo, Fragment } from 'react';
import { ChevronLeft, ChevronRight, Lock, Settings2, CalendarDays, BadgeDollarSign, Users } from 'lucide-react';
import './WeeklyCalendar.css';

/* ─────────────── Constants ─────────────── */
const HOURS = Array.from({ length: 16 }, (_, i) => i + 7); // 07:00 → 22:00
const DAY_LABELS = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'];
const MONTHS = [
  'Enero','Febrero','Marzo','Abril','Mayo','Junio',
  'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre',
];

/* ─────────────── Date helpers ─────────────── */
function getMondayOf(date) {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() + (day === 0 ? -6 : 1 - day));
  d.setHours(0, 0, 0, 0);
  return d;
}
function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}
function isoDate(date) {
  return date.toISOString().split('T')[0];
}
function todayIso() {
  return isoDate(new Date());
}
function fmtWeekRange(monday) {
  const sunday = addDays(monday, 6);
  const d1 = monday.getDate(), d2 = sunday.getDate();
  const m1 = monday.getMonth(), m2 = sunday.getMonth();
  const y  = sunday.getFullYear();
  return m1 === m2
    ? `${d1} - ${d2} ${MONTHS[m2]}, ${y}`
    : `${d1} ${MONTHS[m1]} - ${d2} ${MONTHS[m2]}, ${y}`;
}

/* ─────────────── Mock data (replace with API response) ─────────────── */
/*
  API esperada: GET /bookings/slots?courtId=X&from=YYYY-MM-DD&to=YYYY-MM-DD
  Respuesta: [{ courtId, date, hour, status }]
  status: 'disponible' | 'reservado' | 'mantenimiento'
*/
function buildMockSlots(courts, monday) {
  const slots = [];
  courts.forEach(({ _id: courtId }, ci) => {
    for (let d = 0; d < 7; d++) {
      const date = isoDate(addDays(monday, d));
      HOURS.forEach(hour => {
        const hash = (ci * 31 + d * 7 + hour) % 10;
        const status = hash < 3 ? 'reservado' : hash === 9 ? 'mantenimiento' : 'disponible';
        slots.push({ courtId, date, hour, status });
      });
    }
  });
  return slots;
}

const FALLBACK_COURTS = [
  { _id: 'court-1', name: 'Cancha Central' },
  { _id: 'court-2', name: 'Cancha 2' },
  { _id: 'court-3', name: 'Cancha 3 (Cristal)' },
];

/* ─────────────── Component ─────────────── */
/*
  Props:
  - courts:       [{ _id, name }]               - lista de pistas del complejo
  - slots:        [{ courtId, date, hour, status }] | null  - null usa mock data
  - onSlotClick:  (courtId, date, hour) => void  - callback al seleccionar un slot libre
  - stats:        { occupancyRate, estimatedRevenue, newPlayers } | null
  - loading:      boolean
*/
export default function WeeklyCalendar({
  courts      = [],
  slots       = null,
  onSlotClick = () => {},
  stats       = null,
  loading     = false,
  showStats   = true,
}) {
  const activeCourts = courts.length ? courts : FALLBACK_COURTS;

  const [weekStart,     setWeekStart]     = useState(() => getMondayOf(new Date()));
  const [selectedCourt, setSelectedCourt] = useState(activeCourts[0]?._id);

  const activeCourt = selectedCourt ?? activeCourts[0]?._id;

  const weekDays = useMemo(() =>
    Array.from({ length: 7 }, (_, i) => {
      const d = addDays(weekStart, i);
      return { date: isoDate(d), label: DAY_LABELS[i], num: d.getDate() };
    }), [weekStart]);

  const slotMap = useMemo(() => {
    const source = slots ?? buildMockSlots(activeCourts, weekStart);
    const map = {};
    source.forEach(({ courtId, date, hour, status }) => {
      if (courtId !== activeCourt) return;
      if (!map[date]) map[date] = {};
      map[date][hour] = status;
    });
    return map;
  }, [slots, activeCourt, weekStart, activeCourts]);

  const today = todayIso();

  const prevWeek = () => setWeekStart(d => addDays(d, -7));
  const nextWeek = () => setWeekStart(d => addDays(d, 7));
  const goToday  = () => { setWeekStart(getMondayOf(new Date())); };

  const handleSlot = (date, hour) => {
    if ((slotMap[date]?.[hour] ?? 'disponible') !== 'disponible') return;
    onSlotClick(activeCourt, date, hour);
  };

  // Compute display stats from slot map if not provided via prop
  const displayStats = useMemo(() => {
    if (stats) return stats;
    const source = slots ?? buildMockSlots(activeCourts, weekStart);
    const week = source.filter(s => s.courtId === activeCourt && weekDays.some(d => d.date === s.date));
    const total    = week.length;
    const occupied = week.filter(s => s.status === 'reservado').length;
    return {
      occupancyRate:     total ? Math.round((occupied / total) * 100) : 0,
      estimatedRevenue:  occupied * 18,
      newPlayers:        Math.floor(occupied * 0.6),
    };
  }, [stats, slots, activeCourt, weekStart, weekDays, activeCourts]);

  return (
    <section className="wc-container">
      {/* Page header */}
      <div className="wc-page-header">
        <div className="wc-page-header-text">
          <h2 className="wc-title">Agenda de Pistas</h2>
          <p className="wc-subtitle">Gestión semanal de disponibilidad y reservas.</p>
        </div>
        <div className="wc-court-tabs" role="tablist" aria-label="Seleccionar pista">
          {activeCourts.map(c => (
            <button
              key={c._id}
              role="tab"
              aria-selected={c._id === activeCourt}
              className={`wc-court-tab${c._id === activeCourt ? ' wc-court-tab--active' : ''}`}
              onClick={() => setSelectedCourt(c._id)}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Calendar card */}
      <div className="wc-card">
        {/* Week navigation */}
        <div className="wc-nav">
          <div className="wc-nav-controls">
            <button className="wc-nav-btn" onClick={prevWeek} aria-label="Semana anterior">
              <ChevronLeft size={16} />
            </button>
            <span className="wc-nav-range">{fmtWeekRange(weekStart)}</span>
            <button className="wc-nav-btn" onClick={nextWeek} aria-label="Semana siguiente">
              <ChevronRight size={16} />
            </button>
            <button className="wc-nav-today" onClick={goToday}>Hoy</button>
          </div>
          <div className="wc-legend" aria-label="Leyenda">
            <span className="wc-legend-item"><span className="wc-dot wc-dot--libre" />Libre</span>
            <span className="wc-legend-item"><span className="wc-dot wc-dot--ocupado" />Ocupado</span>
            <span className="wc-legend-item"><span className="wc-dot wc-dot--mant" />Mantenimiento</span>
          </div>
        </div>

        {/* Grid */}
        <div className="wc-grid-scroll" role="grid" aria-label="Calendario semanal">
          <div className="wc-grid">
            {/* Corner */}
            <div className="wc-corner" />

            {/* Day headers */}
            {weekDays.map(({ date, label, num }) => (
              <div
                key={date}
                role="columnheader"
                className={`wc-day-header${date === today ? ' wc-day-header--today' : ''}`}
              >
                <span className="wc-day-label">{label}</span>
                <span className="wc-day-num">{num}</span>
                {date === today && <span className="wc-today-dot" aria-hidden="true" />}
              </div>
            ))}

            {/* Rows: one per hour */}
            {loading
              ? HOURS.map(hour => (
                  <Fragment key={hour}>
                    <div className="wc-hour-label">{String(hour).padStart(2, '0')}:00</div>
                    {weekDays.map(({ date }) => (
                      <div key={`${date}-${hour}`} className="wc-slot wc-slot--skeleton" />
                    ))}
                  </Fragment>
                ))
              : HOURS.map(hour => (
                  <Fragment key={hour}>
                    <div className="wc-hour-label">
                      {String(hour).padStart(2, '0')}:00
                    </div>
                    {weekDays.map(({ date }) => {
                      const status = slotMap[date]?.[hour] ?? 'disponible';
                      const isClickable = status === 'disponible';
                      return (
                        <div
                          key={`${date}-${hour}`}
                          role={isClickable ? 'button' : 'gridcell'}
                          tabIndex={isClickable ? 0 : undefined}
                          aria-label={`${date} ${hour}:00 — ${status}`}
                          aria-disabled={!isClickable}
                          className={`wc-slot wc-slot--${status}`}
                          onClick={() => handleSlot(date, hour)}
                          onKeyDown={e => e.key === 'Enter' && handleSlot(date, hour)}
                        >
                          {status === 'reservado'     && <Lock     size={13} className="wc-slot-icon" aria-hidden="true" />}
                          {status === 'mantenimiento' && <Settings2 size={13} className="wc-slot-icon" aria-hidden="true" />}
                          <span className="wc-slot-label">
                            {status === 'disponible'     ? 'DISPONIBLE'
                             : status === 'reservado'    ? 'RESERVADO'
                             : ''}
                          </span>
                        </div>
                      );
                    })}
                  </Fragment>
                ))
            }
          </div>
        </div>
      </div>

      {/* Stats */}
      {showStats && (
        <div className="wc-stats">
          <div className="wc-stat-card">
            <div className="wc-stat-icon"><CalendarDays size={20} /></div>
            <div className="wc-stat-body">
              <span className="wc-stat-label">Tasa de Ocupación Semanal</span>
              <span className="wc-stat-value">{displayStats.occupancyRate}%</span>
            </div>
          </div>
          <div className="wc-stat-card">
            <div className="wc-stat-icon"><BadgeDollarSign size={20} /></div>
            <div className="wc-stat-body">
              <span className="wc-stat-label">Ingresos Estimados</span>
              <span className="wc-stat-value">{displayStats.estimatedRevenue.toLocaleString('es-ES')} €</span>
            </div>
          </div>
          <div className="wc-stat-card">
            <div className="wc-stat-icon"><Users size={20} /></div>
            <div className="wc-stat-body">
              <span className="wc-stat-label">Nuevos Jugadores</span>
              <span className="wc-stat-value">+{displayStats.newPlayers}</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
