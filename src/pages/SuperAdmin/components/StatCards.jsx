import { Building2, CheckCircle, Clock, PauseCircle } from 'lucide-react';
import { SkeletonStatCard } from './Skeletons';

export function StatCards({ complexes, loading }) {
  const approved  = complexes.filter(c => c.status === 'approved').length;
  const pending   = complexes.filter(c => c.status === 'pending').length;
  const suspended = complexes.filter(c => c.status === 'suspended').length;

  const cards = [
    { label: 'Total Complejos', value: complexes.length, color: '#60A5FA', Icon: Building2  },
    { label: 'Aprobados',       value: approved,         color: '#84CC16', Icon: CheckCircle },
    { label: 'Pendientes',      value: pending,          color: '#F59E0B', Icon: Clock       },
    { label: 'Suspendidos',     value: suspended,        color: '#94A3B8', Icon: PauseCircle },
  ];

  return (
    <div className="gc-stats-row">
      {loading
        ? [...Array(4)].map((_, i) => <SkeletonStatCard key={i} />)
        : cards.map(({ label, value, color, Icon }) => (
          <div key={label} className="gc-stat-card">
            <div className="gc-stat-icon" style={{ background: `${color}1a`, color }}>
              <Icon size={22} />
            </div>
            <div className="gc-stat-value">{value}</div>
            <div className="gc-stat-label">{label}</div>
          </div>
        ))
      }
    </div>
  );
}
