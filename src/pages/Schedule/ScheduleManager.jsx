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


const daysOfWeek = [
  { key: 'lunes', label: 'Lunes', short: 'L' },
  { key: 'martes', label: 'Martes', short: 'M' },
  { key: 'miércoles', label: 'Miércoles', short: 'X' },
  { key: 'jueves', label: 'Jueves', short: 'J' },
  { key: 'viernes', label: 'Viernes', short: 'V' },
  { key: 'sábado', label: 'Sábado', short: 'S' },
  { key: 'domingo', label: 'Domingo', short: 'D' },
];

export const ScheduleManager = () => {
  const { user } = useAuthStore();
  const complexId = user?.complexId;
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
    setPublicBooking,
  } = store;

  const [showModal, setShowModal] = useState(false);
  const [editingBlock, setEditingBlock] = useState(null);
  const [currentCourtId, setCurrentCourtId] = useState(null);

  useEffect(() => {
    if (complexId) {
      loadSchedule(complexId);
    }
  }, [complexId, loadSchedule]);

  
  const referenceCourt = courts.length > 0 ? courts[0] : null;

  
  const allBlocks = courts.flatMap(court =>
    court.blocks.map(block => ({ ...block, courtId: court.courtId, courtName: court.courtName }))
  );

  
  const totalHours = courts.reduce((acc, c) => acc + (c.metrics?.weeklyHours || 0), 0);
  const totalBlocked = courts.reduce((acc, c) => acc + (c.metrics?.blockedHours || 0), 0);
  const efficiency = totalHours > 0 ? ((totalHours - totalBlocked) / totalHours) * 100 : 0;


  const handleOpenNewBlock = () => {
    if (!referenceCourt) return;
    setCurrentCourtId(referenceCourt.courtId);
    setEditingBlock(null);
    setShowModal(true);
  };

  const handleOpenEditBlock = (block) => {
    setCurrentCourtId(block.courtId);
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

  const handleDeleteBlock = (block) => {
    deleteBlockFromCourt(block.courtId, block.id);
  };

  const handleTimeChange = (dayIndex, field, value) => {
    if (!referenceCourt) return;
    updateCourtDay(referenceCourt.courtId, dayIndex, field, value);
  };

  const handleDayActiveToggle = (dayIndex, checked) => {
    if (!referenceCourt) return;
    updateCourtDay(referenceCourt.courtId, dayIndex, 'active', checked);
  };

  if (isLoading) {
    return <div className="text-center p-5 text-light">Cargando horarios...</div>;
  }
  if (error) {
    return <div className="alert alert-danger">Error: {error}</div>;
  }

  return (
    <div className="schedule-manager">
      <div className="main-card">
        {/* Header */}
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

          <div className="toggles-container d-flex flex-wrap gap-4 mb-4">
            <div className="toggle-item d-flex align-items-center gap-2">
              <label className="fw-semibold mb-0">Estado Online</label>
              <div className="form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={onlineStatus}
                  onChange={() => setOnlineStatus(!onlineStatus)}
                />
              </div>
            </div>
            <div className="toggle-item d-flex align-items-center gap-2">
              <label className="fw-semibold mb-0">Habilitar reservas para el público</label>
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

          <div className="weekly-schedule-card mb-4">
            <div className="weekly-header">
              <h5 className="weekly-title">Disponibilidad Semanal</h5>
              <span className="weekly-subtitle">Los cambios afectarán a las próximas 4 semanas</span>
            </div>
            <div className="weekly-body">
              <table className="weekly-table">
                <thead>
                  <tr>
                    <th></th>
                    <th></th>
                    <th>APERTURA</th>
                    <th>CIERRE</th>
                    <th>ACTIVO</th>
                  </tr>
                </thead>
                <tbody>
                  {referenceCourt?.days.map((day, idx) => {
                    const dayInfo = daysOfWeek.find(d => d.key === day.day);
                    const isActive = day.active;
                    const isClosed = !isActive;
                    return (
                      <tr key={day.day} className={isClosed ? 'inactive-row' : ''}>
                        <td className="day-short">{dayInfo?.short}</td>
                        <td className="day-label">{dayInfo?.label}</td>
                        <td>
                          {isClosed ? (
                            <span className="closed-text">Cerrado por mantenimiento</span>
                          ) : (
                            <select
                              className="form-select-custom-sm"
                              value={day.openTime}
                              onChange={(e) => handleTimeChange(idx, 'openTime', e.target.value)}
                              disabled={!referenceCourt.active}
                            >
                              {timeOptions.map(t => <option key={t}>{t}</option>)}
                            </select>
                          )}
                        </td>
                        <td>
                          {isClosed ? (
                            <span className="closed-text">-</span>
                          ) : (
                            <select
                              className="form-select-custom-sm"
                              value={day.closeTime}
                              onChange={(e) => handleTimeChange(idx, 'closeTime', e.target.value)}
                              disabled={!referenceCourt.active}
                            >
                              {timeOptions.map(t => <option key={t}>{t}</option>)}
                            </select>
                          )}
                        </td>
                        <td>
                          <div className="form-switch">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              checked={isActive}
                              onChange={(e) => handleDayActiveToggle(idx, e.target.checked)}
                              disabled={!referenceCourt.active}
                            />
                          </div>
                          {isClosed && <span className="badge bg-secondary ms-1">Inactivo</span>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="mt-2">
                <span className={`badge ${referenceCourt?.active ? 'bg-success' : 'bg-secondary'}`}>
                  {referenceCourt?.active ? 'Complejo Activo' : 'Complejo Inactivo'}
                </span>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <h3 className="h5 fw-semibold mb-3">Bloqueos &amp; Siestas</h3>
            <p className="text-secondary small">Define franjas donde la pista no puede ser reservada. ¡Mantenimiento, clases fijas, etc!</p>

            <div className="blocks-list">
              {allBlocks.length === 0 ? (
                <div className="text-muted">Sin bloqueos definidos</div>
              ) : (
                <ul className="list-unstyled">
                  {allBlocks.map(block => (
                    <li key={block.id} className="block-item">
                      <div className="block-info">
                        <span className="block-name">{block.name}</span>
                        <span className="block-detail">
                          {block.recurrence}
                          {block.day && ` (${block.day})`}
                          : {block.startTime} - {block.endTime}
                          {block.courtName && <span className="badge bg-secondary ms-2">Cancha: {block.courtName}</span>}
                        </span>
                      </div>
                      <div className="block-actions">
                        <button
                          className="btn btn-sm btn-outline-primary me-1"
                          onClick={() => handleOpenEditBlock(block)}
                        >
                          <i className="fas fa-pen"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDeleteBlock(block)}
                        >
                          <i className="fas fa-trash-alt"></i>
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              <button className="btn btn-success mt-3" onClick={handleOpenNewBlock}>
                <i className="fas fa-plus me-1"></i> Nuevo Bloqueo
              </button>
            </div>
          </div>

          {hasUnsavedChanges ? (
            <div className="alert-changes d-flex flex-wrap justify-content-between align-items-center mb-4">
              <div className="alert-text">
                <i className="fas fa-exclamation-triangle me-2"></i>
                <strong>Cambios detectados</strong> – No has guardado tus ajustes recientes.
              </div>
              <div>
                <button className="btn-outline-secondary-custom me-2" onClick={() => discardChanges(complexId)}>
                  Descartar
                </button>
                <button className="btn-success-custom" onClick={() => saveChanges(complexId)}>
                  Guardar Cambios
                </button>
              </div>
            </div>
          ) : (
            <div className="d-flex justify-content-end gap-2 mb-4">
              <button className="btn-disabled" disabled>Descartar</button>
              <button className="btn-disabled" disabled>Guardar Cambios</button>
            </div>
          )}

          <div className="metrics-container">
            <div className="row g-4">
              <div className="col-12 col-sm-6 col-lg-4">
                <div className="metric-card">
                  <div className="metric-content">
                    <div className="metric-label">HORAS SEMANALES</div>
                    <div className="metric-value">{Math.round(totalHours)}h</div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-6 col-lg-4">
                <div className="metric-card">
                  <div className="metric-content">
                    <div className="metric-label">TIEMPO BLOQUEADO</div>
                    <div className="metric-value highlight-danger">{Math.round(totalBlocked)}h</div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-6 col-lg-4">
                <div className="metric-card metric-card-special">
                  <div className="metric-content">
                    <div className="metric-label">DISPONIBILIDAD</div>
                    <div className="metric-value highlight-success">{Math.round(efficiency)}%</div>
                    <div className="progress-custom">
                      <div
                        className="progress-bar-custom"
                        style={{ width: `${Math.min(100, Math.round(efficiency))}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="footer-copyright mt-4 text-center text-muted small">
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
