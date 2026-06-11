import { Building2, CheckCircle, Clock, PauseCircle, TrendingUp } from 'lucide-react';
import { SkeletonStatCard } from './Skeletons';

export function StatCards({ complexes, loading }) {
  const approved  = complexes.filter(c => c.status === 'APPROVED').length;
  const pending   = complexes.filter(c => c.status === 'PENDING').length;
  const suspended = complexes.filter(c => c.status === 'SUSPENDED').length;

  const cards = [
    { label: 'Total Complejos', value: complexes.length, color: '#60A5FA', Icon: Building2,   trend: '+12% vs mes anterior', up: true  },
    { label: 'Aprobados',       value: approved,         color: '#84CC16', Icon: CheckCircle,  trend: '+8.4% vs mes anterior', up: true  },
    { label: 'Pendientes',      value: pending,          color: '#F59E0B', Icon: Clock,        trend: null,                    up: false },
    { label: 'Suspendidos',     value: suspended,        color: '#94A3B8', Icon: PauseCircle,  trend: null,                    up: false },
  ];

  return (
    <div className="gc-stats-row">
      {loading
        ? [...Array(4)].map((_, i) => <SkeletonStatCard key={i} />)
        : cards.map(({ label, value, color, Icon, trend, up }) => (
          <div key={label} className="gc-stat-card">
            <div className="gc-stat-icon" style={{ background: `${color}1a`, color }}>
              <Icon size={22} />
            </div>
            <div className="gc-stat-value">{value}</div>
            <div className="gc-stat-label">{label}</div>
            {trend && (
              <div className={`gc-stat-trend${up ? ' trend--up' : ' trend--down'}`}>
                <TrendingUp size={11} />
                <span>{trend}</span>
              </div>
            )}
          </div>
        ))
      }
    </div>
  );
}
