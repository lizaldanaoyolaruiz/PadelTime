import { useState, useEffect, useCallback } from 'react';
import {
  ResponsiveContainer, AreaChart, Area,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts';
import {
  FiDollarSign, FiCalendar, FiCheckCircle, FiCreditCard, FiTrendingUp, FiTrendingDown,
} from 'react-icons/fi';
import { getMetrics } from '../../services/metricsService';
import './Metrics.css';

const COLORS   = ['#bef264', '#1e3a5f'];
const PIE_DAYS = ['', 'Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sáb'];
const HOURS    = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];

const fmt = (n) =>
  n >= 1000
    ? `$${(n / 1000).toFixed(1)}k`
    : `$${Number(n).toLocaleString('es-AR', { minimumFractionDigits: 2 })}`;

const getIntensity = (reservas, max) => {
  if (!reservas || reservas === 0) return 'empty';
  if (max <= 0) return 'low';
  const ratio = reservas / max;
  if (ratio >= 0.65) return 'high';
  if (ratio >= 0.30) return 'medium';
  return 'low';
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="mtr-tooltip">
      <p className="mtr-tooltip-label">{label}</p>
      <p className="mtr-tooltip-val">{payload[0].value} reservas</p>
    </div>
  );
};

export default function OwnerStats() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [periodo, setPeriodo] = useState('mes');
  const [customFrom, setCustomFrom] = useState('');
  const [customTo,   setCustomTo]   = useState('');

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getMetrics(
        periodo,
        periodo === 'personalizado' ? customFrom : null,
        periodo === 'personalizado' ? customTo   : null,
      );
      setMetrics(data);
    } catch (err) {
      console.error('Error cargando métricas:', err);
    } finally {
      setLoading(false);
    }
  }, [periodo, customFrom, customTo]);

  useEffect(() => {
    if (periodo !== 'personalizado') load();
  }, [periodo, load]);

  const handleCustomApply = () => {
    if (customFrom && customTo) load();
  };

  if (loading) {
    return (
      <div className="mtr-page">
        <div className="mtr-loading">
          <div className="mtr-spinner" />
          <p>Cargando métricas...</p>
        </div>
      </div>
    );
  }

  const m            = metrics || {};
  const rankingMax   = m.rankingCanchas?.[0]?.reservas || 1;
  const chartData    = m.reservasPorPeriodo || [];
  const incomeData   = m.incomeByType       || [{ name: 'Pago Completo', value: 70 }, { name: 'Señas', value: 30 }];
  const heatmapMap   = new Map(
    (m.heatmap || []).map(h => [`${h.dayOfWeek}-${h.hour}`, h.reservas])
  );
  const heatmapMax = Math.max(0, ...(m.heatmap || []).map(h => h.reservas));

  const fmtTrend = (val) => {
    if (val === null || val === undefined) return null;
    return val >= 0 ? `+${val}%` : `${val}%`;
  };

  const t = m.trends || {};

  const statCards = [
    {
      icon: <FiDollarSign />,
      label: 'Total Ingresos',
      value: fmt(m.totalIngresos || 0),
      trend: fmtTrend(t.ingresos),
      up: (t.ingresos ?? 0) >= 0,
    },
    {
      icon: <FiCalendar />,
      label: 'Total Reservas',
      value: (m.totalReservas || 0).toLocaleString(),
      trend: fmtTrend(t.reservas),
      up: (t.reservas ?? 0) >= 0,
    },
    {
      icon: <FiCheckCircle />,
      label: 'Tasa de Confirmación',
      value: `${m.tasaConfirmacion || 0}%`,
      trend: fmtTrend(t.tasa),
      up: (t.tasa ?? 0) >= 0,
    },
    {
      icon: <FiCreditCard />,
      label: 'Ingresos por Señas',
      value: fmt(m.ingresosSenias || 0),
      trend: fmtTrend(t.senias),
      up: (t.senias ?? 0) >= 0,
    },
  ];

  const HEATMAP_DAYS = [2, 3, 4, 5, 6, 7, 1];
  const HOUR_LABELS  = ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'];

  return (
    <div className="mtr-page">

      <div className="mtr-header">
        <div>
          <h1>Estadísticas del Complejo</h1>
          <p>Monitoreo de rendimiento operativo y financiero en tiempo real.</p>
        </div>
        <div className="mtr-period-bar">
          {['semana', 'mes', 'año', 'personalizado'].map(p => (
            <button
              key={p}
              className={`mtr-period-btn ${periodo === p ? 'active' : ''}`}
              onClick={() => setPeriodo(p)}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {periodo === 'personalizado' && (
        <div className="mtr-custom-range">
          <input type="date" value={customFrom} onChange={e => setCustomFrom(e.target.value)} />
          <span>→</span>
          <input type="date" value={customTo}   onChange={e => setCustomTo(e.target.value)} />
          <button className="mtr-apply-btn" onClick={handleCustomApply}>Aplicar</button>
        </div>
      )}

      <div className="mtr-cards">
        {statCards.map(({ icon, label, value, trend, up }) => (
          <div key={label} className="mtr-card">
            <div className="mtr-card-top">
              <div className="mtr-card-icon">{icon}</div>
              {trend && (
                <span className={`mtr-card-trend ${up ? 'up' : 'down'}`}>
                  {up ? <FiTrendingUp /> : <FiTrendingDown />}
                  {trend}
                </span>
              )}
            </div>
            <p className="mtr-card-label">{label}</p>
            <h2 className="mtr-card-value">{value}</h2>
          </div>
        ))}
      </div>

      <div className="mtr-charts-row">

        <div className="mtr-chart-card large">
          <div className="mtr-chart-head">
            <div>
              <h3>Reservas por Período</h3>
              <p>Tendencia de ocupación {periodo === 'semana' ? 'semanal' : periodo === 'mes' ? 'mensual' : 'anual'}</p>
            </div>
          </div>
          {chartData.length === 0 ? (
            <div className="mtr-no-data">Sin datos para este período</div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#bef264" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#bef264" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,.06)" />
                <XAxis dataKey="dia" stroke="#64748b" tick={{ fontSize: 12 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="reservas"
                  stroke="#bef264"
                  fill="url(#grad)"
                  strokeWidth={2.5}
                  dot={{ fill: '#bef264', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="mtr-chart-card donut">
          <h3>Ingresos por Tipo</h3>
          <div className="mtr-donut-wrap">
            <PieChart width={200} height={200}>
              <Pie
                data={incomeData}
                cx="50%"
                cy="50%"
                innerRadius={62}
                outerRadius={90}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
              >
                {incomeData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
            <div className="mtr-donut-center">
              <span className="mtr-donut-label">Total</span>
              <span className="mtr-donut-val">{fmt(m.totalIngresos || 0)}</span>
            </div>
          </div>
          <div className="mtr-legend">
            {incomeData.map((item, i) => (
              <div key={item.name} className="mtr-legend-item">
                <span className="mtr-legend-dot" style={{ background: COLORS[i] }} />
                <span>{item.name}</span>
                <span className="mtr-legend-pct">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mtr-section-card">
        <div className="mtr-section-head">
          <h3>Ranking de Canchas</h3>
          <span className="mtr-section-sub">Más reservadas este {periodo}</span>
        </div>
        {m.rankingCanchas?.length === 0 ? (
          <p className="mtr-no-data">Sin datos de canchas</p>
        ) : (
          <div className="mtr-ranking-grid">
            {(m.rankingCanchas || []).map((c, i) => (
              <div key={c.name} className="mtr-ranking-item">
                <div className="mtr-ranking-row">
                  <span className="mtr-ranking-name">
                    <span className="mtr-ranking-pos">{i + 1}.</span> {c.name}
                  </span>
                  <span className="mtr-ranking-count">{c.reservas} reservas</span>
                </div>
                <div className="mtr-bar-bg">
                  <div
                    className="mtr-bar-fill"
                    style={{ width: `${Math.round((c.reservas / rankingMax) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mtr-section-card">
        <div className="mtr-section-head">
          <div>
            <h3>Intensidad de Juego / Horas Pico</h3>
            <p className="mtr-section-desc">Frecuencia de reservas por hora y día</p>
          </div>
          <div className="mtr-heat-legend">
            <span>BAJA</span>
            <span className="mtr-heat-dot low" />
            <span className="mtr-heat-dot medium" />
            <span className="mtr-heat-dot high" />
            <span>ALTA</span>
          </div>
        </div>

        <div className="mtr-heatmap">
          <div className="mtr-heat-hour-row">
            <div className="mtr-heat-day-label" />
            {HOURS.filter((_, i) => i % 2 === 0).map(h => (
              <div key={h} className="mtr-heat-hour-label">
                {String(h).padStart(2, '0')}:00
              </div>
            ))}
          </div>

          {HEATMAP_DAYS.map(dow => (
            <div key={dow} className="mtr-heat-row">
              <div className="mtr-heat-day-label">{PIE_DAYS[dow]}</div>
              {HOURS.map(h => {
                const count = heatmapMap.get(`${dow}-${h}`) || 0;
                return (
                  <div
                    key={h}
                    className={`mtr-heat-cell ${getIntensity(count, heatmapMax)}`}
                    title={`${PIE_DAYS[dow]} ${h}:00 — ${count} reservas`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="mtr-bottom-row">

        <div className="mtr-analysis-card">
          <p className="mtr-analysis-tag">ANÁLISIS DE OCUPACIÓN</p>
          <div className="mtr-analysis-body">
            <img
              src="https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=600&q=80"
              alt="Cancha padel"
            />
            <div>
              {m.peakHour ? (
                <>
                  <p>Pico máximo alcanzado: <strong>{m.peakHour.label}</strong></p>
                  <p>La demanda más alta del período se concentra en ese horario.</p>
                  <p>Recomendación: Revisá tarifas diferenciadas para maximizar ingresos.</p>
                </>
              ) : (
                <p>No hay suficientes datos para analizar horas pico en este período.</p>
              )}
            </div>
          </div>
        </div>

        <div className="mtr-efficiency-card">
          <FiTrendingUp size={38} />
          <p className="mtr-eff-label">Eficiencia de Operación</p>
          <h2 className="mtr-eff-score">{m.efficiency ?? '0.0'}<span>/10</span></h2>
          <p className="mtr-eff-desc">BASADO EN RESERVAS Y CHECK-INS</p>
        </div>

      </div>
    </div>
  );
}
