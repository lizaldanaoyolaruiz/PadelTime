import { useState, useEffect, useCallback } from "react";
import api from "../../../services/axios";
import { getMyCourts } from "../../../services/courtService";
import { getMyComplex } from "../../../services/complexService";
import "./Reports.css";

const STATUS_OPTIONS = [
  { value: "", label: "Todos los estados" },
  { value: "pending", label: "Pendiente" },
  { value: "confirmed", label: "Confirmada" },
  { value: "cancelled", label: "Cancelada" },
  { value: "rejected", label: "Rechazada" },
];

const STATUS_CLASS = {
  pending: "pendiente",
  confirmed: "completada",
  cancelled: "cancelada",
  rejected: "cancelada",
};

export default function Reports({ complexId }) {
  const [canchas, setCanchas] = useState([]);
  const [data, setData] = useState([]);
  const [summary, setSummary] = useState({
    ingresos: 0,
    completadas: 0,
    cancelaciones: 0,
  });
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  });
  const [complexIdLocal, setComplexIdLocal] = useState(complexId || null);

  const [filters, setFilters] = useState({
    courtId: "",
    startDate: "",
    endDate: "",
    status: "",
  });

  useEffect(() => {
    (async () => {
      try {
        let cId = complexId;
        if (!cId) {
          const res = await getMyComplex();
          cId = res.data.complex?._id || res.data._id;
          setComplexIdLocal(cId);
        }
        if (!cId) return;
        const res = await getMyCourts(cId);
        setCanchas(res.data.courts || res.data || []);
      } catch {}
    })();
  }, [complexId]);

  const fetchData = useCallback(
    async (page = 1) => {
      if (!complexIdLocal) return;
      setLoading(true);
      try {
        const params = { complexId: complexIdLocal, page, limit: 10 };
        if (filters.courtId) params.courtId = filters.courtId;
        if (filters.startDate) params.startDate = filters.startDate;
        if (filters.endDate) params.endDate = filters.endDate;
        if (filters.status) params.status = filters.status;

        const res = await api.get("/reports/bookings", { params });
        setData(res.data.bookings || []);
        setSummary(
          res.data.summary || { ingresos: 0, completadas: 0, cancelaciones: 0 },
        );
        setPagination({
          page: res.data.page,
          totalPages: res.data.totalPages,
          total: res.data.total,
        });
      } catch {
      } finally {
        setLoading(false);
      }
    },
    [complexIdLocal, filters],
  );

  useEffect(() => {
    fetchData(1);
  }, [complexIdLocal]);

  const handleApplyFilters = () => fetchData(1);
  const handlePageChange = (p) => fetchData(p);

  const descargar = (format) => {
    if (!complexIdLocal) return;
    const params = new URLSearchParams({ complexId: complexIdLocal, format });
    if (filters.courtId) params.set("courtId", filters.courtId);
    if (filters.startDate) params.set("startDate", filters.startDate);
    if (filters.endDate) params.set("endDate", filters.endDate);
    if (filters.status) params.set("status", filters.status);
    const token = localStorage.getItem("token");
    fetch(`/api/reports/export?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `reservas.${format}`;
        a.click();
        URL.revokeObjectURL(url);
      });
  };

  const formatFecha = (f) => (f?.includes("T") ? f.split("T")[0] : f || "-");

  return (
    <div className="reports-container">
      <div className="reports-header">
        <div className="reports-title-section">
          <h1>Reportes y Exportación</h1>
          <p>Gestiona y descarga el historial de actividad de tu complejo.</p>
        </div>
        <div className="reports-actions">
          <button className="btn-export-csv" onClick={() => descargar("csv")}>
            Descargar CSV
          </button>
          <button className="btn-export-pdf" onClick={() => descargar("pdf")}>
            Descargar PDF
          </button>
        </div>
      </div>

      <div className="reports-filters">
        <div className="filter-group">
          <label>Cancha</label>
          <select
            value={filters.courtId}
            onChange={(e) =>
              setFilters((f) => ({ ...f, courtId: e.target.value }))
            }
          >
            <option value="">Todas las canchas</option>
            {canchas.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label>Desde</label>
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) =>
              setFilters((f) => ({ ...f, startDate: e.target.value }))
            }
          />
        </div>
        <div className="filter-group">
          <label>Hasta</label>
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) =>
              setFilters((f) => ({ ...f, endDate: e.target.value }))
            }
          />
        </div>
        <div className="filter-group">
          <label>Estado</label>
          <select
            value={filters.status}
            onChange={(e) =>
              setFilters((f) => ({ ...f, status: e.target.value }))
            }
          >
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <button className="btn-apply-filters" onClick={handleApplyFilters}>
          Aplicar Filtros
        </button>
      </div>

      <div className="reports-table-container">
        <table className="reports-table">
          <thead>
            <tr>
              <th>CLIENTE</th>
              <th>CANCHA</th>
              <th>FECHA Y HORA</th>
              <th>ESTADO</th>
              <th>PAGO</th>
              <th>TOTAL</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan="6"
                  style={{ textAlign: "center", padding: "2rem" }}
                >
                  Cargando...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  style={{
                    textAlign: "center",
                    padding: "2rem",
                    color: "#8892a4",
                  }}
                >
                  Sin reservas para los filtros seleccionados
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr key={row._id}>
                  <td data-label="Cliente">
                    <div className="client-info">
                      <div className="avatar placeholder-avatar"></div>
                      <div>
                        <strong>{row.nombre}</strong>
                        <span>{row.email}</span>
                      </div>
                    </div>
                  </td>
                  <td data-label="Cancha">{row.cancha}</td>
                  <td data-label="Fecha y Hora">
                    <div className="date-time-info">
                      <strong>{formatFecha(row.fecha)}</strong>
                      <span className="time-accent">{row.horario}</span>
                    </div>
                  </td>
                  <td data-label="Estado">
                    <span
                      className={`status-badge ${STATUS_CLASS[row.status] || row.status}`}
                    >
                      {row.statusLabel}
                    </span>
                  </td>
                  <td data-label="Pago" className="payment-method">
                    {row.pago}
                  </td>
                  <td data-label="Total">
                    <strong>${row.total?.toLocaleString("es-AR")}</strong>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="reports-pagination">
          <span>
            Mostrando {data.length} de {pagination.total} registros
          </span>
          <div className="pagination-controls">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
            >
              &lt;
            </button>
            <button className="active">{pagination.page}</button>
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
            >
              &gt;
            </button>
          </div>
        </div>
      </div>

      <div className="reports-summary-cards">
        <div className="summary-card incomes">
          <div className="card-header">
            <span>Ingresos Totales</span>
          </div>
          <h3>${summary.ingresos?.toLocaleString("es-AR")}</h3>
          <p>Acumulado en el período seleccionado</p>
        </div>
        <div className="summary-card completed">
          <div className="card-header">
            <span>Reservas Confirmadas</span>
          </div>
          <h3>{summary.completadas}</h3>
        </div>
        <div className="summary-card cancellations">
          <div className="card-header">
            <span>Cancelaciones</span>
          </div>
          <h3>{summary.cancelaciones}</h3>
        </div>
      </div>
    </div>
  );
}
