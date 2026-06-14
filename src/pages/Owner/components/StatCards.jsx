import { CalendarCheck, DollarSign, Users, TrendingUp } from 'lucide-react';

const STATS = [
  { key: 'reservas',  label: 'Reservas hoy',     Icon: CalendarCheck, color: '#BEF264' },
  { key: 'ingresos',  label: 'Ingresos hoy',      Icon: DollarSign,    color: '#84CC16' },
  { key: 'jugadores', label: 'Jugadores activos', Icon: Users,         color: '#60A5FA' },
  { key: 'ocupacion', label: 'Ocupación',          Icon: TrendingUp,    color: '#F59E0B' },
];

export default function StatCards({ data = {} }) {
  return (
    <div className="stats-row">
      {STATS.map(({ key, label, Icon, color }) => (
        <div key={key} className="stat-card">
          <div className="stat-icon" style={{ background: `${color}18`, color }}>
            <Icon size={20} />
          </div>
          <div>
            <div className="stat-value">{data[key] ?? '—'}</div>
            <div className="stat-label">{label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
