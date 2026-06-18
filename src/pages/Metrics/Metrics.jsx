import { useState } from "react";
import "./Metrics.css";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import {
  FiDollarSign,
  FiCalendar,
  FiCheckCircle,
  FiCreditCard,
  FiTrendingUp,
} from "react-icons/fi";

const reservationsWeek = [
  { dia: "Lun", reservas: 25 },
  { dia: "Mar", reservas: 35 },
  { dia: "Mie", reservas: 30 },
  { dia: "Jue", reservas: 55 },
  { dia: "Vie", reservas: 75 },
  { dia: "Sab", reservas: 82 },
  { dia: "Dom", reservas: 98 },
];

const reservationsMonth = [
  { dia: "S1", reservas: 180 },
  { dia: "S2", reservas: 240 },
  { dia: "S3", reservas: 280 },
  { dia: "S4", reservas: 310 },
];

const reservationsYear = [
  { dia: "Ene", reservas: 500 },
  { dia: "Feb", reservas: 620 },
  { dia: "Mar", reservas: 700 },
  { dia: "Abr", reservas: 810 },
  { dia: "May", reservas: 920 },
  { dia: "Jun", reservas: 1100 },
];

const incomeData = [
  {
    name: "Pago Completo",
    value: 70,
  },
  {
    name: "Señas",
    value: 30,
  },
];

const courts = [
  {
    name: "Cancha Cristal Central",
    value: 312,
    width: "95%",
  },
  {
    name: "Pista Panorámica Azul",
    value: 285,
    width: "85%",
  },
  {
    name: "Cancha 3 Techada",
    value: 241,
    width: "72%",
  },
  {
    name: "Muro Clásica",
    value: 198,
    width: "60%",
  },
];

const COLORS = ["#9EF01A", "#24324D"];

function OwnerStats() {
  const [periodo, setPeriodo] = useState("mes");
  const chartData =
    periodo === "semana"
      ? reservationsWeek
      : periodo === "mes"
        ? reservationsMonth
        : reservationsYear;
  return (
    <div className="stats-page">
      <div className="stats-header">
        <h1>Estadísticas del Complejo</h1>

        <p>Monitoreo de rendimiento operativo y financiero en tiempo real.</p>
      </div>

      <div className="period-selector">
        <button
          className={periodo === "semana" ? "active" : ""}
          onClick={() => setPeriodo("semana")}
        >
          Semana
        </button>

        <button
          className={periodo === "mes" ? "active" : ""}
          onClick={() => setPeriodo("mes")}
        >
          Mes
        </button>

        <button
          className={periodo === "año" ? "active" : ""}
          onClick={() => setPeriodo("año")}
        >
          Año
        </button>

        <input type="date" className="date-filter" />

        <input type="date" className="date-filter" />
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-top">
            <div className="icon-box">
              <FiDollarSign />
            </div>

            <span className="success">
              <FiTrendingUp />
              +12.4%
            </span>
          </div>

          <h4>Total Ingresos</h4>

          <h2>$42.500</h2>
        </div>

        <div className="metric-card">
          <div className="metric-top">
            <div className="icon-box">
              <FiCalendar />
            </div>

            <span className="success">
              <FiTrendingUp />
              +8%
            </span>
          </div>

          <h4>Total Reservas</h4>

          <h2>1.248</h2>
        </div>

        <div className="metric-card">
          <div className="metric-top">
            <div className="icon-box">
              <FiCheckCircle />
            </div>

            <span className="danger">-1.2%</span>
          </div>

          <h4>Tasa Confirmación</h4>

          <h2>94.8%</h2>
        </div>

        <div className="metric-card">
          <div className="metric-top">
            <div className="icon-box">
              <FiCreditCard />
            </div>
          </div>

          <h4>Ingresos Estimados por Señas</h4>

          <h2>$12.840</h2>

          <small>Basado en reservas confirmadas</small>
        </div>
      </div>

      <div className="charts-section">
        <div className="chart-card large">
          <h2>Reservas por Semana / Mes</h2>

          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <CartesianGrid stroke="#24324d" />

              <XAxis dataKey="dia" stroke="#94a3b8" />

              <YAxis stroke="#94a3b8" />

              <Tooltip />

              <Area
                type="monotone"
                dataKey="reservas"
                stroke="#9EF01A"
                fill="#9EF01A"
                fillOpacity={0.15}
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card pie-card">
          <h2>Ingresos por Tipo</h2>

          <PieChart width={260} height={250}>
            <Pie
              data={incomeData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              dataKey="value"
            >
              {incomeData.map((item, index) => (
                <Cell key={index} fill={COLORS[index]} />
              ))}
            </Pie>
          </PieChart>

          <div className="pie-info">
            <p>🟢 Pago Completo 70%</p>

            <p>⚫ Señas 30%</p>
          </div>
        </div>
      </div>

      <div className="ranking-card">
        <h2>Ranking de Canchas Más Reservadas</h2>

        <div className="ranking-grid">
          {courts.map((court) => (
            <div className="court-item" key={court.name}>
              <div className="ranking-item">
                <span>{court.name}</span>

                <span>{court.value} reservas</span>
              </div>

              <div className="progress">
                <div
                  style={{
                    width: court.width,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="heatmap-card">
        <h2>Intensidad de Juego / Horas Pico</h2>

        <div className="heatmap-grid">
          {Array.from({ length: 28 }).map((_, i) => (
            <div
              key={i}
              className={`heat-cell ${
                i % 5 === 0 ? "high" : i % 3 === 0 ? "medium" : "low"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="bottom-cards">
        <div className="analysis-card">
          <h3>ANÁLISIS DE OCUPACIÓN</h3>

          <div className="analysis-content">
            <img
              src="https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=900"
              alt="Padel"
            />

            <div className="analysis-text">
              <p>
                Pico máximo:
                <strong>19:00 - 21:00 hs</strong>
              </p>

              <p>La ocupación nocturna incrementó un 15%.</p>

              <p>Recomendación: Revisar tarifas diferenciadas.</p>

              <a href="/">Ver reporte detallado →</a>
            </div>
          </div>
        </div>

        <div className="efficiency-card">
          <FiTrendingUp size={45} />

          <h3>Eficiencia de Operación</h3>

          <h2>8.4/10</h2>

          <p>Basado en reservas y check-ins</p>
        </div>
      </div>
    </div>
  );
}

export default OwnerStats;
