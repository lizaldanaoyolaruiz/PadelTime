import { Users, XCircle, CheckCircle2 } from 'lucide-react';
import Swal from 'sweetalert2';
import { confirmarReserva, rechazarReserva } from '../../../services/reservationService';

const BASE = { background: '#1f2937', color: '#ffffff' };

export default function PendingList({ pending, onRefresh }) {
  const handleConfirmar = async (reserva) => {
    const result = await Swal.fire({
      ...BASE,
      title: '¿Confirmar turno?',
      text: `${reserva.player?.name ?? (reserva.jugadorExterno ? `${reserva.jugadorExterno.nombre} ${reserva.jugadorExterno.apellido}` : 'Sin nombre')} — ${reserva.court?.name} ${reserva.startTime}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, confirmar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#84CC16',
      cancelButtonColor: '#374151',
    });
    if (!result.isConfirmed) return;
    try {
      await confirmarReserva(reserva._id);
      Swal.fire({ ...BASE, icon: 'success', title: 'Turno confirmado', timer: 1500, showConfirmButton: false });
      onRefresh();
    } catch {
      Swal.fire({ ...BASE, icon: 'error', title: 'Error al confirmar', confirmButtonColor: '#374151' });
    }
  };

  const handleRechazar = async (reserva) => {
    const { value: nota, isConfirmed } = await Swal.fire({
      ...BASE,
      title: 'Rechazar turno',
      input: 'text',
      inputLabel: 'Motivo (opcional)',
      inputPlaceholder: 'Ej: Cancha en mantenimiento',
      showCancelButton: true,
      confirmButtonText: 'Rechazar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#374151',
    });
    if (!isConfirmed) return;
    try {
      await rechazarReserva(reserva._id, nota || '');
      Swal.fire({ ...BASE, icon: 'success', title: 'Turno rechazado', timer: 1500, showConfirmButton: false });
      onRefresh();
    } catch {
      Swal.fire({ ...BASE, icon: 'error', title: 'Error al rechazar', confirmButtonColor: '#374151' });
    }
  };

  return (
    <div className="pg-card pg-card--confirmaciones">
      <div className="confirmaciones-header">
        <h3 className="pg-card-title" style={{ margin: 0 }}>Turnos por Confirmar</h3>
        {pending.length > 0 && <span className="badge-pending">{pending.length} Pendientes</span>}
      </div>
      <div className="confirmaciones-list">
        {pending.length === 0 ? (
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', margin: '24px 0', textAlign: 'center' }}>
            No hay turnos pendientes
          </p>
        ) : pending.map(t => (
          <div key={t._id} className="turno-row">
            <div className="turno-icon"><Users size={18} /></div>
            <div className="turno-info">
              <span className="turno-nombre">
                {t.player?.name ?? (t.jugadorExterno ? `${t.jugadorExterno.nombre} ${t.jugadorExterno.apellido}` : 'Sin nombre')}
              </span>
              <span className="turno-detalle">{t.court?.name} • {t.startTime} - {t.endTime}</span>
            </div>
            <span className="turno-estado estado-pendiente">${t.totalAmount}</span>
            <div className="turno-actions">
              <button className="action-btn action-btn--reject" onClick={() => handleRechazar(t)}>
                <XCircle size={18} />
              </button>
              <button className="action-btn action-btn--confirm" onClick={() => handleConfirmar(t)}>
                <CheckCircle2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
