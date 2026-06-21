import { useState } from 'react';
import { eliminarMantenimiento } from '../../../services/reservationService';

export default function MaintenanceModal({ slot, onClose, onEliminado }) {
  const [cargando, setCargando] = useState(false);

  const handleEliminar = async () => {
    setCargando(true);
    try { await eliminarMantenimiento(slot._id); onEliminado(); }
    catch {} finally { setCargando(false); }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Slot de Mantenimiento</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="detail-row"><span>Cancha</span><strong>{slot.court?.name}</strong></div>
          <div className="detail-row"><span>Fecha</span><strong>{slot.date}</strong></div>
          <div className="detail-row"><span>Horario</span><strong>{slot.startTime} – {slot.endTime}</strong></div>
          <div className="detail-row"><span>Motivo</span><strong>{slot.motivo || 'Mantenimiento'}</strong></div>
        </div>
        <div className="modal-actions" style={{ marginTop: 16 }}>
          <button className="btn-rechazar" onClick={handleEliminar} disabled={cargando}>
            {cargando ? 'Eliminando...' : 'Eliminar mantenimiento'}
          </button>
        </div>
      </div>
    </div>
  );
}
