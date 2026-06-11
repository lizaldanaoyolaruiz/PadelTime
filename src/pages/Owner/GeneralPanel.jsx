import { useState } from 'react';
import { CheckCircle2, XCircle, TrendingUp, Users, CalendarCheck, DollarSign } from 'lucide-react';
import './GeneralPanel.css';

// Placeholder data — wire each section to its real endpoint when backend is ready
const MOCK_PENDING = [
  { id: 1, nombre: 'Carlos Ruiz',  cancha: 'Cancha 2', horario: '18:30 - 20:00', monto: '$1.500', estado: 'pagado' },
  { id: 2, nombre: 'Laura Gomez',  cancha: 'Cancha 1', horario: '20:00 - 21:30', monto: null,     estado: 'seña_pendiente' },
];

const MOCK_AGENDA = [
  { horario: '17:00', c1: { nombre: 'M. Lopez',   estado: 'confirmado' }, c2: null,               c3: { nombre: 'J. Perez', estado: 'vip' } },
  { horario: '18:30', c1: { nombre: 'Turno Pendiente', estado: 'pendiente' }, c2: { nombre: 'R. Sanchez', estado: 'confirmado' }, c3: null },
  { horario: '20:00', c1: { nombre: 'S. Martinez', estado: 'confirmado' }, c2: { nombre: 'F. Torres', estado: 'confirmado' }, c3: { nombre: 'D. Blanco', estado: 'confirmado' } },
];

const STATS = [
  { label: 'Reservas hoy',    value: '8',       Icon: CalendarCheck, color: '#BEF264' },
  { label: 'Ingresos hoy',    value: '$12.400', Icon: DollarSign,    color: '#84CC16' },
  { label: 'Jugadores activos', value: '24',    Icon: Users,         color: '#60A5FA' },
  { label: 'Ocupación',       value: '75%',     Icon: TrendingUp,    color: '#F59E0B' },
];

function SlotCell({ slot }) {
  if (!slot) return <div className="slot slot--libre"><span>Turno Libre</span><span className="slot-sub">Click para reservar</span></div>;
  const cls = slot.estado === 'confirmado' ? 'slot--confirmado'
            : slot.estado === 'pendiente'  ? 'slot--pendiente'
            : slot.estado === 'vip'        ? 'slot--vip'
            : 'slot--libre';
  return (
    <div className={`slot ${cls}`}>
      <span className="slot-name">{slot.nombre}</span>
      <span className="slot-sub">
        {slot.estado === 'confirmado' ? 'Confirmado'
         : slot.estado === 'pendiente' ? 'Esperando Seña'
         : slot.estado === 'vip'       ? 'Socio VIP'
         : ''}
      </span>
    </div>
  );
}

export default function GeneralPanel() {
  const [pending, setPending] = useState(MOCK_PENDING);

  const confirm = (id) => setPending(p => p.filter(t => t.id !== id));
  const reject  = (id) => setPending(p => p.filter(t => t.id !== id));

  const today = new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div className="panel-wrap">
      {/* Header */}
      <div className="pg-header">
        <div>
          <h2>Gestión de Turnos</h2>
          <p className="panel-subtitle" style={{ textTransform: 'capitalize' }}>{today}</p>
        </div>
        <div className="pg-header-actions">
          <span className="mp-status"><span className="mp-dot" />Mercado Pago: Conectado</span>
          <button className="btn-primary">+ Nueva Reserva</button>
        </div>
      </div>

      {/* Stats row */}
      <div className="stats-row">
        {STATS.map(({ label, value, Icon, color }) => (
          <div key={label} className="stat-card">
            <div className="stat-icon" style={{ background: `${color}18`, color }}>
              <Icon size={20} />
            </div>
            <div>
              <div className="stat-value">{value}</div>
              <div className="stat-label">{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Mid row */}
      <div className="pg-mid">
        {/* Seña config summary */}
        <div className="pg-card pg-card--sena">
          <h3 className="pg-card-title">Porcentaje de Seña</h3>
          <p className="pg-card-desc">Define el porcentaje que los jugadores deben abonar para confirmar su reserva vía Mercado Pago.</p>
          <div className="sena-value">30%</div>
          <p className="sena-meta">Último cambio: 12 Oct</p>
          <button className="btn-secondary" style={{ marginTop: 12 }}>Modificar en Config. Pagos</button>
        </div>

        {/* Turnos por confirmar */}
        <div className="pg-card pg-card--confirmaciones">
          <div className="confirmaciones-header">
            <h3 className="pg-card-title" style={{ margin: 0 }}>Turnos por Confirmar</h3>
            {pending.length > 0 && <span className="badge-pending">{pending.length} Pendientes</span>}
          </div>
          <div className="confirmaciones-list">
            {pending.length === 0 ? (
              <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', margin: '24px 0', textAlign: 'center' }}>
                No hay turnos pendientes
              </p>
            ) : pending.map(t => (
              <div key={t.id} className="turno-row">
                <div className="turno-icon"><Users size={18} /></div>
                <div className="turno-info">
                  <span className="turno-nombre">{t.nombre}</span>
                  <span className="turno-detalle">{t.cancha} • {t.horario}</span>
                </div>
                <span className={`turno-estado ${t.estado === 'pagado' ? 'estado-pagado' : 'estado-pendiente'}`}>
                  {t.estado === 'pagado' ? `${t.monto} (Pagado)` : 'Seña pendiente'}
                </span>
                <div className="turno-actions">
                  <button className="action-btn action-btn--reject"  onClick={() => reject(t.id)}>
                    <XCircle size={18} />
                  </button>
                  <button className="action-btn action-btn--confirm" onClick={() => confirm(t.id)}>
                    <CheckCircle2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Agenda */}
      <div className="agenda-card">
        <div className="agenda-header">
          <h3 className="pg-card-title" style={{ margin: 0 }}>Agenda de Canchas - Hoy</h3>
          <div className="agenda-header-actions">
            <button className="btn-icon-text">Filtrar</button>
            <button className="btn-icon-text">Imprimir</button>
          </div>
        </div>
        <div className="agenda-table-wrap">
          <table className="agenda-table">
            <thead>
              <tr>
                <th>Horario</th>
                <th><span className="cancha-name">CANCHA 1</span><span className="cancha-sub">Cristal Pro</span></th>
                <th><span className="cancha-name">CANCHA 2</span><span className="cancha-sub">Panoramic</span></th>
                <th><span className="cancha-name">CANCHA 3</span><span className="cancha-sub">Outdoor</span></th>
              </tr>
            </thead>
            <tbody>
              {MOCK_AGENDA.map(row => (
                <tr key={row.horario}>
                  <td className="horario-cell">{row.horario}</td>
                  <td><SlotCell slot={row.c1} /></td>
                  <td><SlotCell slot={row.c2} /></td>
                  <td><SlotCell slot={row.c3} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
