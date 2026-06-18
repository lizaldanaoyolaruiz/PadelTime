// src/components/schedule/ScheduleManager.jsx
import React, { useState } from "react";
import { useScheduleStore } from "../../store/scheduleStore";
import { BlockModal } from "./BlockModal";
import { getGlobalMetrics } from "../../utils/timeHelpers";
import "./schedule.css";

// Opciones de hora (formato 12h)
const timeOptions = [];
for (let h = 0; h < 24; h++) {
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  const ampm = h < 12 ? "AM" : "PM";
  timeOptions.push(`${hour12.toString().padStart(2, "0")}:00 ${ampm}`);
}

export const ScheduleManager = () => {
  const store = useScheduleStore();
  const {
    courts,
    hasUnsavedChanges,
    updateCourtDay,
    toggleCourtActive,
    addBlockToCourt,
    updateBlockInCourt,
    deleteBlockFromCourt,
    saveChanges,
    discardChanges,
  } = store;

  const [showModal, setShowModal] = useState(false);
  const [editingBlock, setEditingBlock] = useState(null);
  const [currentCourtId, setCurrentCourtId] = useState(null);

  // Métricas globales
  const { totalHours, totalBlocked, efficiency } = getGlobalMetrics(courts);

  // Abrir modal para nuevo bloqueo
  const handleOpenNewBlock = (courtId) => {
    setCurrentCourtId(courtId);
    setEditingBlock(null);
    setShowModal(true);
  };

  // Abrir modal para editar bloqueo
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

  // Días de la semana
  const daysOfWeek = [
    "lunes",
    "martes",
    "miércoles",
    "jueves",
    "viernes",
    "sábado",
    "domingo",
  ];

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
          {/* Título */}
          <div className="mb-4">
            <h2 className="h4 fw-semibold">Gestión de Horarios</h2>
            <p className="text-secondary small">
              Define la disponibilidad operativa y excepciones por cada pista.
            </p>
          </div>

          {/* TABLA DE DISPONIBILIDAD SEMANAL */}
          <div className="table-responsive mb-4">
            <table className="table-schedule table table-bordered">
              <thead>
                <tr>
                  <th>Cancha</th>
                  {daysOfWeek.map((day) => (
                    <th key={day} className="text-capitalize">
                      {day}
                    </th>
                  ))}
                  <th>Activo</th>
                </tr>
              </thead>
              <tbody>
                {courts.map((court) => (
                  <tr
                    key={court.id}
                    className={!court.active ? "table-secondary" : ""}
                  >
                    <td className="fw-medium">
                      {court.name}
                      <button
                        className="btn btn-sm btn-outline-secondary ms-2"
                        onClick={() => toggleCourtActive(court.id)}
                        title={
                          court.active ? "Desactivar cancha" : "Activar cancha"
                        }
                      >
                        <i
                          className={`fas ${court.active ? "fa-toggle-on" : "fa-toggle-off"}`}
                        ></i>
                      </button>
                    </td>
                    {court.days.map((day, index) => (
                      <td key={day.day}>
                        <div className="d-flex flex-column gap-1">
                          <select
                            className="form-select-custom-sm"
                            value={day.openTime}
                            onChange={(e) =>
                              updateCourtDay(
                                court.id,
                                index,
                                "openTime",
                                e.target.value,
                              )
                            }
                            disabled={!court.active || !day.active}
                          >
                            {timeOptions.map((t) => (
                              <option key={t}>{t}</option>
                            ))}
                          </select>
                          <select
                            className="form-select-custom-sm"
                            value={day.closeTime}
                            onChange={(e) =>
                              updateCourtDay(
                                court.id,
                                index,
                                "closeTime",
                                e.target.value,
                              )
                            }
                            disabled={!court.active || !day.active}
                          >
                            {timeOptions.map((t) => (
                              <option key={t}>{t}</option>
                            ))}
                          </select>
                          <div className="form-check form-switch">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              checked={day.active}
                              onChange={(e) =>
                                updateCourtDay(
                                  court.id,
                                  index,
                                  "active",
                                  e.target.checked,
                                )
                              }
                              disabled={!court.active}
                            />
                          </div>
                        </div>
                      </td>
                    ))}
                    <td>
                      <span
                        className={`badge ${court.active ? "bg-success" : "bg-secondary"}`}
                      >
                        {court.active ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* BLOQUEOS POR CANCHA */}
          <div className="mb-4">
            <h3 className="h5 fw-semibold mb-3">Bloqueos &amp; Siestas</h3>
            <p className="text-secondary small">
              Define franjas donde la pista no puede ser reservada.
            </p>
            <div className="row g-4">
              {courts.map((court) => (
                <div key={court.id} className="col-md-6 col-lg-6">
                  <div className="court-blocks-card">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h6 className="fw-semibold mb-0">{court.name}</h6>
                      <button
                        className="btn btn-sm btn-outline-success"
                        onClick={() => handleOpenNewBlock(court.id)}
                      >
                        <i className="fas fa-plus"></i> Nuevo
                      </button>
                    </div>
                    {court.blocks.length === 0 ? (
                      <div className="text-muted small">
                        Sin bloqueos definidos
                      </div>
                    ) : (
                      <ul className="list-unstyled mb-0">
                        {court.blocks.map((block) => (
                          <li
                            key={block.id}
                            className="block-item-mini d-flex justify-content-between align-items-center"
                          >
                            <div>
                              <span className="block-name">{block.name}</span>
                              <span className="block-detail">
                                {block.recurrence}{" "}
                                {block.day ? `(${block.day})` : ""}{" "}
                                {block.startTime} - {block.endTime}
                              </span>
                            </div>
                            <div className="block-actions">
                              <button
                                className="btn btn-sm btn-outline-primary me-1"
                                onClick={() =>
                                  handleOpenEditBlock(court.id, block)
                                }
                              >
                                <i className="fas fa-pen"></i>
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() =>
                                  deleteBlockFromCourt(court.id, block.id)
                                }
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

          {/* ALERTA DE CAMBIOS */}
          {hasUnsavedChanges ? (
            <div className="alert-changes mb-4">
              <div className="alert-text">
                <i className="fas fa-exclamation-triangle me-2"></i>
                <strong>Cambios detectados</strong> – No has guardado tus
                ajustes recientes.
              </div>
              <div>
                <button
                  className="btn-outline-secondary-custom me-2"
                  onClick={discardChanges}
                >
                  Descartar
                </button>
                <button className="btn-success-custom" onClick={saveChanges}>
                  Guardar Cambios
                </button>
              </div>
            </div>
          ) : (
            <div className="d-flex justify-content-end gap-2 mb-4">
              <button className="btn-disabled">Descartar</button>
              <button className="btn-disabled">Guardar Cambios</button>
            </div>
          )}

          {/* MÉTRICAS GLOBALES */}
          <div className="metrics-container">
            <div className="row g-3">
              <div className="col-md-3">
                <div className="metric-card">
                  <div className="metric-label">Horas semanales</div>
                  <div className="metric-value">{Math.round(totalHours)}h</div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="metric-card">
                  <div className="metric-label">Tiempo bloqueado</div>
                  <div className="metric-value highlight-danger">
                    {Math.round(totalBlocked)}h
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="metric-card">
                  <div className="metric-label">Horas disponibles</div>
                  <div className="metric-value">
                    {Math.round(totalHours - totalBlocked)}h
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="metric-card">
                  <div className="metric-label">Eficiencia global</div>
                  <div className="metric-value highlight-success">
                    {Math.round(efficiency)}%
                  </div>
                  <div className="progress-custom mt-1">
                    <div
                      className="progress-bar-custom"
                      style={{
                        width: `${Math.min(100, Math.round(efficiency))}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer de copyright */}
          <div className="footer-copyright mt-4">
            © 2024 PadelPro SaaS. Todos los derechos reservados.
          </div>
        </div>
      </div>

      {/* Modal de bloqueo */}
      <BlockModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSaveBlock}
        initialData={editingBlock}
      />
    </div>
  );
};
