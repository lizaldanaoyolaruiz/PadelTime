import "./Metrics.css";

function OwnerStats() {
  return (
    <div className="stats-page">
      <div className="stats-header">
        <div>
          <h1>Estadísticas del Complejo</h1>
          <p>Monitoreo de rendimiento operativo y financiero</p>
        </div>

        <div className="period-selector">
          <button>Semana</button>
          <button className="active">Mes</button>
          <button>Año</button>
        </div>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <h4>Total Ingresos</h4>
          <h2>$42.500</h2>
        </div>

        <div className="metric-card">
          <h4>Total Reservas</h4>
          <h2>1248</h2>
        </div>

        <div className="metric-card">
          <h4>Tasa Confirmación</h4>
          <h2>94.8%</h2>
        </div>

        <div className="metric-card">
          <h4>Ingresos por Señas</h4>
          <h2>$12.840</h2>
        </div>
      </div>

      <div className="charts-section">
        <div className="chart-card large">
          Gráfico Reservas por período
        </div>

        <div className="chart-card">
          Gráfico Ingresos por tipo
        </div>
      </div>

      <div className="ranking-card">
        <h2>Ranking de Canchas</h2>

        <div className="ranking-item">
          <span>Cancha Cristal Central</span>
          <span>312 reservas</span>
        </div>

        <div className="progress">
          <div style={{ width: "90%" }}></div>
        </div>
      </div>

      <div className="heatmap-card">
        <h2>Intensidad de Juego / Horas Pico</h2>
      </div>

      <div className="bottom-cards">
        <div className="analysis-card">
          Análisis de ocupación
        </div>

        <div className="efficiency-card">
          <h2>8.4/10</h2>
        </div>
      </div>
    </div>
  );
}

export default OwnerStats;