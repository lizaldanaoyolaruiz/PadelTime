import React, { useState } from 'react';
import { useScheduleStore } from '../../store/scheduleStore';
import { BlockModal } from './BlockModal';
import { getBaseWeeklyHours, getBlockedHoursPerWeek } from '../../utils/timeHelpers';
import './schedule.css'; // estilos personalizados

const timeOptions = [];
for (let h = 0; h < 24; h++) {
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  const ampm = h < 12 ? 'AM' : 'PM';
  timeOptions.push(`${hour12.toString().padStart(2, '0')}:00 ${ampm}`);
}

export const ScheduleManager = () => {
  const store = useScheduleStore();
  const {
    onlineStatus,
    publicBookingEnabled,
    dayConfig,
    blocks,
    hasUnsavedChanges,
    setOnlineStatus,
    setPublicBooking,
    updateDayConfig,
    addBlock,
    updateBlock,
    deleteBlock,
    saveChanges,
    discardChanges
  } = store;

  const [showModal, setShowModal] = useState(false);
  const [editingBlock, setEditingBlock] = useState(null);

  const weeklyHours = getBaseWeeklyHours(dayConfig);
  const blockedHours = getBlockedHoursPerWeek(blocks, dayConfig);
  const efficiency = weeklyHours > 0 ? ((weeklyHours - blockedHours) / weeklyHours) * 100 : 0;

  const handleOpenNewBlock = () => {
    setEditingBlock(null);
    setShowModal(true);
  };

  const handleOpenEditBlock = (block) => {
    setEditingBlock(block);
    setShowModal(true);
  };

  const handleSaveBlock = (formData) => {
    if (editingBlock) {
      updateBlock(editingBlock.id, formData);
    } else {
      addBlock(formData);
    }
    setShowModal(false);
  };

  const days = [
    { id: 'lunes', label: 'Lunes' },
    { id: 'martes', label: 'Martes' },
    { id: 'domingo', label: 'Domingo' }
  ];

  return (
    <>
      <div className="card shadow-lg border-0 rounded-4 overflow-hidden">

          
          <div className="mb-4">
            <h2 className="h4 fw-semibold">Gestión de Horarios</h2>
            <p className="text-secondary small">Define la disponibilidad operativa y excepciones por cada pista.</p>
          </div>

          
          <div className="mb-5">
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
              <h3 className="h5 fw-semibold">Disponibilidad Semanal</h3>
              <span className="badge bg-warning-subtle text-warning-emphasis px-3 py-2">
                <i className="fas fa-clock me-1"></i> Los cambios afectarán a las próximas 4 semanas
              </span>
            </div>

            <div className="table-responsive border rounded-3">
              <table className="table table-hover table-bordered mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="py-3">Día</th>
                    <th className="py-3">APERTURA</th>
                    <th className="py-3">CIERRE</th>
                    <th className="py-3">Activo</th>
                  </tr>
                </thead>
                <tbody>
                  {days.map((day) => {
                    const config = dayConfig[day.id];
                    return (
                      <tr key={day.id}>
                        <td className="fw-medium">{day.label}</td>
                        <td>
                          <select
                            className="form-select form-select-sm"
                            value={config.openTime}
                            onChange={(e) => updateDayConfig(day.id, 'openTime', e.target.value)}
                            disabled={!config.active}
                            style={{ width: 'auto' }}
                          >
                            {timeOptions.map(t => <option key={t}>{t}</option>)}
                          </select>
                        </td>
                        <td>
                          <select
                            className="form-select form-select-sm"
                            value={config.closeTime}
                            onChange={(e) => updateDayConfig(day.id, 'closeTime', e.target.value)}
                            disabled={!config.active}
                            style={{ width: 'auto' }}
                          >
                            {timeOptions.map(t => <option key={t}>{t}</option>)}
                          </select>
                        </td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              checked={config.active}
                              onChange={(e) => updateDayConfig(day.id, 'active', e.target.checked)}
                            />
                            {!config.active && (
                              <span className="badge bg-secondary-subtle text-secondary-emphasis">Cerrado por mantenimiento</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body">
              <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
                <h3 className="h5 fw-semibold d-flex align-items-center gap-2">
                  <i className="fas fa-ban text-danger"></i> Bloqueos &amp; Siestas
                </h3>
                <span className="small text-secondary">Define franjas donde la pista no puede ser reservada</span>
              </div>
              <div className="list-group list-group-flush">
                {blocks.map(block => (
                  <div key={block.id} className="list-group-item d-flex justify-content-between align-items-center border-start border-4 border-warning">
                    <div>
                      <div className="fw-medium">{block.name}</div>
                      <div className="small text-secondary">
                        {block.recurrence === 'daily' ? 'Diario' : `${block.day}: `} {block.startTime} - {block.endTime}
                      </div>
                    </div>
                    <div>
                      <button
                        className="btn btn-outline-primary btn-sm me-2"
                        onClick={() => handleOpenEditBlock(block)}
                      >
                        <i className="fas fa-pen"></i>
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => deleteBlock(block.id)}
                      >
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  className="btn btn-outline-success btn-sm w-100 mt-3 border-dashed"
                  onClick={handleOpenNewBlock}
                >
                  <i className="fas fa-plus-circle me-1"></i> Nuevo Bloqueo
                </button>
              </div>
            </div>
          </div>

          
          <div className="bg-light p-3 rounded-3 mb-4 d-flex flex-wrap gap-4">
            <div className="d-flex align-items-center gap-2">
              <span className="fw-medium">Estado Online</span>
              <div className="form-check form-switch mb-0">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={onlineStatus}
                  onChange={() => setOnlineStatus(!onlineStatus)}
                />
              </div>
            </div>
            <div className="d-flex align-items-center gap-2">
              <span className="fw-medium">Habilitar reservas para el público</span>
              <div className="form-check form-switch mb-0">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={publicBookingEnabled}
                  onChange={() => setPublicBooking(!publicBookingEnabled)}
                />
              </div>
            </div>
          </div>

          {/* Alerta de cambios */}
          {hasUnsavedChanges ? (
            <div className="alert alert-warning d-flex flex-wrap justify-content-between align-items-center">
              <div>
                <i className="fas fa-exclamation-triangle me-2"></i>
                <strong>Cambios detectados</strong> – No has guardado tus ajustes recientes.
              </div>
              <div>
                <button className="btn btn-outline-secondary btn-sm me-2" onClick={discardChanges}>Descartar</button>
                <button className="btn btn-success btn-sm" onClick={saveChanges}>Guardar Cambios</button>
              </div>
            </div>
          ) : (
            <div className="d-flex justify-content-end gap-2 mb-4">
              <button className="btn btn-light btn-sm" disabled>Descartar</button>
              <button className="btn btn-secondary btn-sm" disabled>Guardar Cambios</button>
            </div>
          )}

          
          <div className="row g-3">
            <div className="col-md-9">
              <div className="card bg-emerald-soft border-0 h-100">
                <div className="card-body">
                  <div className="row g-3">
                    <div className="col-sm-4">
                      <div className="bg-white p-3 rounded-3 shadow-sm">
                        <div className="text-uppercase small text-secondary">Horas semanales</div>
                        <div className="h2 fw-bold">{Math.round(weeklyHours)}h</div>
                      </div>
                    </div>
                    <div className="col-sm-4">
                      <div className="bg-white p-3 rounded-3 shadow-sm">
                        <div className="text-uppercase small text-secondary">Tiempo bloqueado</div>
                        <div className="h2 fw-bold text-danger">{Math.round(blockedHours)}h</div>
                      </div>
                    </div>
                    <div className="col-sm-4">
                      <div className="bg-white p-3 rounded-3 shadow-sm">
                        <div className="text-uppercase small text-secondary">Eficiencia de disponibilidad</div>
                        <div className="h2 fw-bold text-success">{Math.round(efficiency)}%</div>
                        <div className="progress" style={{ height: '6px' }}>
                          <div
                            className="progress-bar bg-success"
                            style={{ width: `${Math.min(100, Math.round(efficiency))}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card bg-emerald-soft border-0 h-100 d-flex justify-content-center align-items-center">
                <button className="btn btn-success btn-lg w-100">
                  <i className="fas fa-plus-circle me-2"></i> Nueva Reserva
                </button>
              </div>
            </div>
          </div>
        </div>
    
      <BlockModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSaveBlock}
        initialData={editingBlock}
      />
    </>
  );
};