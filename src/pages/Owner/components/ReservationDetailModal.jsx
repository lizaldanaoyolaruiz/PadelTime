import { useState } from 'react';
import { confirmarReserva, rechazarReserva, cancelarReserva } from '../../../services/reservationService';
import './ReservationDetailModal.css';


const STATUS_CONFIG = {
  pending:   { label: 'Pendiente',  cls: 'rdm-badge--pending'   },
  confirmed: { label: 'Confirmada', cls: 'rdm-badge--confirmed' },
  cancelled: { label: 'Cancelada',  cls: 'rdm-badge--cancelled' },
  rejected:  { label: 'Rechazada',  cls: 'rdm-badge--rejected'  },
};

function formatFecha(dateStr) {
  if (!dateStr) return '—';
  const [y, m, d] = dateStr.split('-');
  return `${d}/${m}/${y}`;
}

export default function ReservationDetailModal({ reserva, onClose, onRefresh }) {
  const [cargando,       setCargando]       = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  const jugador = reserva.player?.name ??
    (reserva.jugadorExterno
      ? `${reserva.jugadorExterno.nombre} ${reserva.jugadorExterno.apellido}`
      : 'Sin datos');

  const statusCfg = STATUS_CONFIG[reserva.status] ?? { label: reserva.status, cls: '' };

  const handleConfirmar = async () => {
    setCargando(true);
    try { await confirmarReserva(reserva._id); onRefresh(); }
    catch {} finally { setCargando(false); }
  };

  const handleRechazar = async () => {
    setCargando(true);
    try { await rechazarReserva(reserva._id, 'Rechazada por el administrador'); onRefresh(); }
    catch {} finally { setCargando(false); }
  };

  const handleCancelar = async () => {
    setCargando(true);
    try { await cancelarReserva(reserva._id); onRefresh(); }
    catch {} finally { setCargando(false); }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box rdm-box" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="rdm-header">
          <div className="rdm-header-left">
            <span className="rdm-title">Detalle de Reserva</span>
            <span className={`rdm-badge ${statusCfg.cls}`}>{statusCfg.label}</span>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {/* Player hero */}
        <div className="rdm-player-row">
          <div className="rdm-avatar">
            {jugador.charAt(0).toUpperCase()}
          </div>
          <div className="rdm-player-info">
            <span className="rdm-player-name">{jugador}</span>
            {reserva.jugadorExterno?.email && (
              <span className="rdm-player-email">{reserva.jugadorExterno.email}</span>
            )}
            {reserva.player?.email && (
              <span className="rdm-player-email">{reserva.player.email}</span>
            )}
          </div>
        </div>

        {/* Info grid */}
        <div className="rdm-grid">
          <div className="rdm-field">
            <span className="rdm-label">Cancha</span>
            <span className="rdm-value">{reserva.court?.name ?? '—'}</span>
          </div>
          <div className="rdm-field">
            <span className="rdm-label">Fecha</span>
            <span className="rdm-value">{formatFecha(reserva.date)}</span>
          </div>
          <div className="rdm-field">
            <span className="rdm-label">Horario</span>
            <span className="rdm-value">{reserva.startTime} – {reserva.endTime}</span>
          </div>
        </div>

        {/* Medio de pago con ícono */}
        <div className="detail-row">
          <span>Medio de pago</span>
          <strong>
            {reserva.confirmationMethod === 'mercadopago' && '💳 Mercado Pago'}
            {reserva.confirmationMethod === 'whatsapp'    && '💬 WhatsApp'}
            {reserva.confirmationMethod === 'manual'      && '📋 Manual'}
          </strong>
        </div>

        {/* Desglose de pago */}
        {reserva.confirmationMethod === 'mercadopago' ? (
          <>
            <div className="detail-row">
              <span>Seña abonada online</span>
              <strong style={{ color: '#22c55e' }}>${reserva.depositAmount?.toLocaleString('es-AR')}</strong>
            </div>
            <div className="detail-row">
              <span>Resto a abonar en cancha</span>
              <strong>${(reserva.totalAmount - reserva.depositAmount)?.toLocaleString('es-AR')}</strong>
            </div>
            <div className="detail-row" style={{ borderTop: '1px solid var(--color-border)', paddingTop: 8, marginTop: 4 }}>
              <span>Total</span>
              <strong>${reserva.totalAmount?.toLocaleString('es-AR')}</strong>
            </div>
          </>
        ) : (
          <div className="detail-row">
            <span>Abona total en cancha</span>
            <strong>${reserva.totalAmount?.toLocaleString('es-AR')}</strong>
          </div>
        )}

        {/* Actions */}
        {reserva.status === 'pending' && reserva.confirmationMethod === 'mercadopago' && (
          <div className="rdm-mp-pending">
            <span>⏳ Esperando confirmación de pago por Mercado Pago</span>
          </div>
        )}
        {reserva.status === 'pending' && reserva.confirmationMethod !== 'mercadopago' && (
          <div className="rdm-actions">
            <button className="rdm-btn rdm-btn--confirm" onClick={handleConfirmar} disabled={cargando || confirmAction !== null}>
              Confirmar
            </button>
            <button className="rdm-btn rdm-btn--reject" onClick={() => setConfirmAction('reject')} disabled={cargando || confirmAction !== null}>
              Rechazar
            </button>
          </div>
        )}

        {(reserva.status === 'confirmed' || reserva.status === 'pending') && (
          <div className="rdm-actions rdm-actions--secondary">
            <button className="rdm-btn rdm-btn--cancel" onClick={() => setConfirmAction('cancel')} disabled={cargando || confirmAction !== null}>
              Cancelar reserva
            </button>
          </div>
        )}

        {confirmAction && (
          <div style={{ marginTop: 16, padding: '16px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10 }}>
            <p style={{ color: '#f87171', fontWeight: 600, marginBottom: 12, textAlign: 'center' }}>
              {confirmAction === 'reject'
                ? '¿Confirmás que querés rechazar esta reserva?'
                : '¿Confirmás que querés cancelar esta reserva?'}
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                className="rdm-btn rdm-btn--reject"
                style={{ flex: 1 }}
                disabled={cargando}
                onClick={confirmAction === 'reject' ? handleRechazar : handleCancelar}
              >
                {cargando ? 'Procesando...' : 'Sí, confirmar'}
              </button>
              <button
                style={{ flex: 1, padding: '10px', borderRadius: 8, border: '1px solid #475569', background: 'transparent', color: '#94a3b8', cursor: 'pointer' }}
                onClick={() => setConfirmAction(null)}
                disabled={cargando}
              >
                No, volver
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
