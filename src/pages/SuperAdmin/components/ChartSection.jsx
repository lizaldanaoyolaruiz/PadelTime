import { CHART_DATA, RECENT_ACTIVITY } from '../utils/constants';

export function ChartSection() {
  const chartMax = Math.max(...CHART_DATA.map(d => d.value));

  return (
    <div className="gc-bottom-row">
      {/* Crecimiento de la Red */}
      <div className="gc-chart-card">
        <div className="gc-chart-card-header">
          <div>
            <h3 className="gc-card-title">Crecimiento de la Red</h3>
            <p className="gc-card-subtitle">Evolución de registros semanales</p>
          </div>
          <span className="gc-chart-period">Últimos 30 días</span>
        </div>
        <div className="gc-bar-chart">
          {CHART_DATA.map(({ label, value }) => (
            <div key={label} className="gc-bar-col">
              <div
                className="gc-bar"
                style={{ height: `${(value / chartMax) * 100}%` }}
                title={`${value} registros`}
              />
              <span className="gc-bar-label">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Actividad Reciente */}
      <div className="gc-activity-card">
        <div className="gc-activity-header">
          <h3 className="gc-card-title">Actividad Reciente</h3>
          <button className="gc-link-btn">Ver todo</button>
        </div>
        <div className="gc-activity-list">
          {RECENT_ACTIVITY.map(({ Icon, colorCls, title, detail, time }) => (
            <div key={title} className="gc-activity-item">
              <div className={`gc-activity-icon ${colorCls}`}>
                <Icon size={15} />
              </div>
              <div className="gc-activity-content">
                <span className="gc-activity-title">{title}</span>
                <span className="gc-activity-detail">{detail}</span>
                <span className="gc-activity-time">{time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
