import React, { useState, useEffect } from 'react';
import { useScheduleStore } from '../../store/scheduleStore';
import { BlockModal } from './BlockModal';
import useAuthStore from '../../store/authStore';
import './schedule.css';

const timeOptions = [];
for (let h = 0; h < 24; h++) {
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  const ampm = h < 12 ? 'AM' : 'PM';
  timeOptions.push(`${hour12.toString().padStart(2, '0')}:00 ${ampm}`);
}

export const ScheduleManager = ({  }) => {
  const {user} = useAuthStore()
  const complexId = user?.complexId  
  const store = useScheduleStore();
  const {
    courts,
    onlineStatus,
    publicBookingEnabled,
    hasUnsavedChanges,
    isLoading,
    error,
    loadSchedule,
    updateCourtDay,
    toggleCourtActive,
    addBlockToCourt,
    updateBlockInCourt,
    deleteBlockFromCourt,
    saveChanges,
    discardChanges,
    setOnlineStatus,
    setPublicBooking
  } = store;

  const [showModal, setShowModal] = useState(false);
  const [editingBlock, setEditingBlock] = useState(null);
  const [currentCourtId, setCurrentCourtId] = useState(null);

  useEffect(() => {
    if (complexId) {
      loadSchedule(complexId);
    }
  }, [complexId]);

  // Métricas globales
  const totalHours = courts.reduce((acc, c) => acc + (c.metrics?.weeklyHours || 0), 0);
  const totalBlocked = courts.reduce((acc, c) => acc + (c.metrics?.blockedHours || 0), 0);
  const efficiency = totalHours > 0 ? ((totalHours - totalBlocked) / totalHours) * 100 : 0;

  const handleOpenNewBlock = (courtId) => {
    setCurrentCourtId(courtId);
    setEditingBlock(null);
    setShowModal(true);
  };

  const handleOpenEditBlock = (courtId, block) => {
    setCurrentCourtId(courtId);
    setEditingBlock(block);
    setShowModal(true);
  };

  const handleSaveBlock = (formData) => {
    if (editingBlock) {
      updateBlockInCourt(currentCourtId, editingBlock.id, formData);
    } else {
      addBlockToCourt(currentCourtId, formData);
    }
    setShowModal(false);
  };

  const daysOfWeek = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];

  if (isLoading) {
    return <div className="text-center p-5 text-light">Cargando horarios...</div>;
  }
  if (error) {
    return <div className="alert alert-danger">Error: {error}</div>;
  }

  return (
    <div className="schedule-manager">
      <div className="main-card">
        {/* Header interno */}
        <div className="card-header-custom d-flex flex-wrap justify-content-between align-items-center">
          <div>
            <h1 className="m-0">PadelPro Admin</h1>
            <p className="subtitle m-0">Gestión de Alto Rendimiento</p>
          </div>
          <div className="mt-2 mt-md-0">
            <span className="badge-dashboard">
              <i className="fas fa-chart-line me-1"></i> Dashboard Operativo
            </span>
          </div>
        </div>

        <div className="p-4">
          <div className="mb-4">
            <h2 className="h4 fw-semibold">Gestión de Horarios</h2>
            <p className="text-secondary small">Define la disponibilidad operativa y excepciones por cada pista.</p>
          </div>

          {/* Tabla */}
          <div className="table-responsive mb-4">
            <table className="table-schedule table table-bordered">
              <thead>
                <tr>
                  <th>Cancha</th>
                  {daysOfWeek.map(day => (
                    <th key={day} className="text-capitalize">{day}</th>
                  ))}
                  <th>Activo</th>
                </tr>
              </thead>
              <tbody>
                {courts.map(court => (
                  <tr key={court.courtId} className={!court.active ? 'table-secondary' : ''}>
                    <td className="fw-medium">
                      {court.courtName}
                      <button
                        className="btn btn-sm btn-outline-secondary ms-2"
                        onClick={() => toggleCourtActive(court.courtId)}
                        title={court.active ? 'Desactivar cancha' : 'Activar cancha'}
                      >
                        <i className={`fas ${court.active ? 'fa-toggle-on' : 'fa-toggle-off'}`}></i>
                      </button>
                    </td>
                    {court.days.map((day, index) => (
                      <td key={day.day}>
                        <div className="d-flex flex-column gap-1">
                          <select
                            className="form-select-custom-sm"
                            value={day.openTime}
                            onChange={(e) => updateCourtDay(court.courtId, index, 'openTime', e.target.value)}
                            disabled={!court.active || !day.active}
                          >
                            {timeOptions.map(t => <option key={t}>{t}</option>)}
                          </select>
                          <select
                            className="form-select-custom-sm"
                            value={day.closeTime}
                            onChange={(e) => updateCourtDay(court.courtId, index, 'closeTime', e.target.value)}
                            disabled={!court.active || !day.active}
                          >
                            {timeOptions.map(t => <option key={t}>{t}</option>)}
                          </select>
                          <div className="form-check form-switch">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              checked={day.active}
                              onChange={(e) => updateCourtDay(court.courtId, index, 'active', e.target.checked)}
                              disabled={!court.active}
                            />
                          </div>
                        </div>
                      </td>
                    ))}
                    <td>
                      <span className={`badge ${court.active ? 'bg-success' : 'bg-secondary'}`}>
                        {court.active ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Bloqueos */}
          <div className="mb-4">
            <h3 className="h5 fw-semibold mb-3">Bloqueos &amp; Siestas</h3>
            <p className="text-secondary small">Define franjas donde la pista no puede ser reservada.</p>
            <div className="row g-4 justify-content-center">
              {courts.map(court => (
                <div key={court.courtId} className="col-md-6 col-lg-5 mt-3 mx-auto">
                  <div className="court-blocks-card">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h6 className="fw-semibold mb-0">{court.courtName}</h6>
                      <button
                        className="btn btn-sm btn-outline-success"
                        onClick={() => handleOpenNewBlock(court.courtId)}
                      >
                        <i className="fas fa-plus"></i> Nuevo
                      </button>
                    </div>
                    {court.blocks.length === 0 ? (
                      <div className="text-muted small">Sin bloqueos definidos</div>
                    ) : (
                      <ul className="list-unstyled mb-0">
                        {court.blocks.map(block => (
                          <li key={block.id} className="block-item-mini d-flex justify-content-between align-items-center">
                            <div>
                              <span className="block-name">{block.name}</span>
                              <span className="block-detail">
                                {block.recurrence} {block.day ? `(${block.day})` : ''} {block.startTime} - {block.endTime}
                              </span>
                            </div>
                            <div className="block-actions">
                              <button
                                className="btn btn-sm btn-outline-primary me-1"
                                onClick={() => handleOpenEditBlock(court.courtId, block)}
                              >
                                <i className="fas fa-pen"></i>
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => deleteBlockFromCourt(court.courtId, block.id)}
                              >
                                <i className="fas fa-trash-alt"></i>
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Toggles */}
          <div className="toggles-container mb-4">
            <div className="toggle-item">
              <label>Estado Online</label>
              <div className="form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={onlineStatus}
                  onChange={() => setOnlineStatus(!onlineStatus)}
                />
              </div>
            </div>
            <div className="toggle-item">
              <label>Habilitar reservas para el público</label>
              <div className="form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={publicBookingEnabled}
                  onChange={() => setPublicBooking(!publicBookingEnabled)}
                />
              </div>
            </div>
          </div>

          {/* Alerta */}
          {hasUnsavedChanges ? (
            <div className="alert-changes mb-4">
              <div className="alert-text">
                <i className="fas fa-exclamation-triangle me-2"></i>
                <strong>Cambios detectados</strong> – No has guardado tus ajustes recientes.
              </div>
              <div>
                <button className="btn-outline-secondary-custom me-2" onClick={() => discardChanges(complexId)}>Descartar</button>
                <button className="btn-success-custom" onClick={() => saveChanges(complexId)}>Guardar Cambios</button>
              </div>
            </div>
          ) : (
            <div className="d-flex justify-content-end gap-2 mb-4">
              <button className="btn-disabled" disabled>Descartar</button>
              <button className="btn-disabled" disabled>Guardar Cambios</button>
            </div>
          )}

          {/* Métricas */}
          <div className="metrics-container">
            <div className="row g-4 justify-content-center">
              <div className="col-12 col-sm-6 col-lg-3 d-flex">
                <div className="metric-card w-100 text-center">
                  <div className="metric-label">HORAS SEMANALES</div>
                  <div className="metric-value">{Math.round(totalHours)}h</div>
                </div>
              </div>
              <div className="col-12 col-sm-6 col-lg-3 d-flex">
                <div className="metric-card w-100 text-center">
                  <div className="metric-label">HORAS DISPONIBLES</div>
                  <div className="metric-value">{Math.round(totalHours - totalBlocked)}h</div>
                </div>
              </div>
              <div className="col-12 col-sm-6 col-lg-3 d-flex">
                <div className="metric-card w-100 text-center">
                  <div className="metric-label">TIEMPO BLOQUEADO</div>
                  <div className="metric-value highlight-danger">{Math.round(totalBlocked)}h</div>
                </div>
              </div>
              <div className="col-12 col-sm-6 col-lg-3 d-flex">
                <div className="metric-card w-100 text-center">
                  <div className="metric-label">EFICIENCIA GLOBAL</div>
                  <div className="metric-value highlight-success">{Math.round(efficiency)}%</div>
                  <div className="progress-custom mt-2">
                    <div
                      className="progress-bar-custom"
                      style={{ width: `${Math.min(100, Math.round(efficiency))}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="footer-copyright mt-4">
            © 2024 PadelPro SaaS. Todos los derechos reservados.
          </div>
        </div>
      </div>

      <BlockModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSaveBlock}
        initialData={editingBlock}
      />
    </div>
  );
};
