import React, { useState, useEffect } from 'react';
import './Reports.css';

const Reports = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState({ incomes: 0, completed: 0, cancellations: 0 });
  
  const [filters, setFilters] = useState({
    court: 'all',
    dateRange: '',
    status: 'all'
  });

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 32,
    totalRecords: 128
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const mockResponse = [
        { id: 1, name: 'Javier Méndez', email: 'javier.m@example.com', court: 'Pista Central', date: '24 Oct, 2023', time: '18:00 - 19:30', status: 'COMPLETADA', payment: 'Mercado Pago', total: '$45.00' },
        { id: 2, name: 'Sofía Ruiz', email: 'sofia.r@example.com', court: 'Pista 2', date: '25 Oct, 2023', time: '10:00 - 11:30', status: 'CANCELADA', payment: 'Efectivo', total: '$40.00' },
        { id: 3, name: 'Marcos Galván', email: 'm.galvan@example.com', court: 'Pista Central', date: '25 Oct, 2023', time: '20:00 - 21:30', status: 'PENDIENTE', payment: 'Tarjeta Débito', total: '$45.00' },
        { id: 4, name: 'Elena Torres', email: 'elena.t@example.com', court: 'Pista 3', date: '26 Oct, 2023', time: '17:00 - 18:30', status: 'COMPLETADA', payment: 'Mercado Pago', total: '$35.00' },
      ];
      
      setData(mockResponse);
      setSummary({ incomes: 4850, completed: 112, cancellations: 8 });
      setPagination(prev => ({ ...prev, totalRecords: 128, totalPages: 32 }));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [pagination.currentPage]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleApplyFilters = () => {
    setPagination(prev => ({ ...prev, currentPage: 1 }));
    fetchData();
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, currentPage: newPage }));
    }
  };

  const exportCSV = () => {
    console.log("Exportando CSV con filtros:", filters);
  };

  const exportPDF = () => {
    console.log("Exportando PDF con filtros:", filters);
  };

  return (
    <div className="reports-container">
      <div className="reports-header">
        <div className="reports-title-section">
          <h1>Reportes y Exportación</h1>
          <p>Gestiona y descarga el historial de actividad de tu complejo con filtros avanzados y múltiples formatos de salida.</p>
        </div>
        <div className="reports-actions">
          <button className="btn-export-csv" onClick={exportCSV}>Descargar CSV</button>
          <button className="btn-export-pdf" onClick={exportPDF}>Descargar PDF</button>
        </div>
      </div>

      <div className="reports-filters">
        <div className="filter-group">
          <label>Cancha</label>
          <select name="court" value={filters.court} onChange={handleFilterChange}>
            <option value="all">Todas las pistas</option>
            <option value="pista_central">Pista Central</option>
            <option value="pista_2">Pista 2</option>
            <option value="pista_3">Pista 3</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Rango de Fechas</label>
          <input 
            type="text" 
            name="dateRange" 
            placeholder="24 Oct - 31 Oct, 2023" 
            value={filters.dateRange} 
            onChange={handleFilterChange} 
          />
        </div>
        <div className="filter-group">
          <label>Estado de Reserva</label>
          <select name="status" value={filters.status} onChange={handleFilterChange}>
            <option value="all">Todos los estados</option>
            <option value="completada">Completada</option>
            <option value="pendiente">Pendiente</option>
            <option value="cancelada">Cancelada</option>
          </select>
        </div>
        <button className="btn-apply-filters" onClick={handleApplyFilters}>Aplicar Filtros</button>
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
                <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>Cargando datos...</td>
              </tr>
            ) : (
              data.map((row) => (
                <tr key={row.id}>
                  <td className="client-info">
                    <div className="avatar placeholder-avatar"></div>
                    <div>
                      <strong>{row.name}</strong>
                      <span>{row.email}</span>
                    </div>
                  </td>
                  <td>{row.court}</td>
                  <td className="date-time-info">
                    <strong>{row.date}</strong>
                    <span className="time-accent">{row.time}</span>
                  </td>
                  <td>
                    <span className={`status-badge ${row.status.toLowerCase()}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="payment-method">{row.payment}</td>
                  <td><strong>{row.total}</strong></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        
        <div className="reports-pagination">
          <span>Mostrando {data.length} de {pagination.totalRecords} registros</span>
          <div className="pagination-controls">
            <button 
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
            >
              &lt;
            </button>
            <button className="active">{pagination.currentPage}</button>
            <button 
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
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
            <span className="trend positive">+12%</span>
          </div>
          <h3>${summary.incomes.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h3>
          <p>Acumulado en el período seleccionado</p>
        </div>
        <div className="summary-card completed">
          <div className="card-header">
            <span>Reservas Completadas</span>
          </div>
          <h3>{summary.completed}</h3>
          <p>94% de efectividad de asistencia</p>
        </div>
        <div className="summary-card cancellations">
          <div className="card-header">
            <span>Cancelaciones</span>
          </div>
          <h3>{summary.cancellations}</h3>
          <p>Reducción del 5% vs mes anterior</p>
        </div>
      </div>
    </div>
  );
};

export default Reports;