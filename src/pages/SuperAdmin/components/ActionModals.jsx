import { useState } from 'react';
import { CheckCircle, XCircle, PauseCircle } from 'lucide-react';
import { toast } from 'sonner';
import {
  approveComplex,
  rejectComplex,
  suspendComplex,
  sendApprovalEmail,
  sendRejectionEmail,
} from '../../../services/complexService';

export function ActionModals({ modal, onClose, onStatusUpdate }) {
  const [rejectReason, setRejectReason] = useState('');
  const [loading, setLoading]           = useState(false);

  const { open, type, complex } = modal;
  if (!open || !complex) return null;

  const handleApprove = async () => {
    setLoading(true);
    try {
      await approveComplex(complex.id);
      await sendApprovalEmail(complex.id);
      onStatusUpdate(complex.id, 'APPROVED');
      toast.success('Complejo aprobado correctamente.');
      toast.success('Email enviado al owner notificando aprobación.');
      onClose();
    } catch {
      toast.error('Error al aprobar el complejo.');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    setLoading(true);
    try {
      await rejectComplex(complex.id, rejectReason);
      await sendRejectionEmail(complex.id);
      onStatusUpdate(complex.id, 'REJECTED', { observations: rejectReason });
      toast.success('Complejo rechazado.');
      toast.success('Email enviado al owner notificando rechazo.');
      onClose();
    } catch {
      toast.error('Error al rechazar el complejo.');
    } finally {
      setLoading(false);
    }
  };

  const handleSuspend = async () => {
    setLoading(true);
    try {
      await suspendComplex(complex.id);
      onStatusUpdate(complex.id, 'SUSPENDED');
      toast.success('Complejo suspendido correctamente.');
      onClose();
    } catch {
      toast.error('Error al suspender el complejo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="gc-modal-overlay" role="dialog" aria-modal="true">
      <div className="gc-modal">
        {type === 'approve' && (
          <>
            <div className="gc-modal-icon gc-modal-icon--approve">
              <CheckCircle size={30} />
            </div>
            <h3 className="gc-modal-title">Aprobar Complejo</h3>
            <p className="gc-modal-text">
              ¿Desea aprobar <strong>{complex.name}</strong>?
              Se enviará un email de confirmación al owner.
            </p>
            <div className="gc-modal-actions">
              <button className="gc-modal-btn gc-modal-btn--cancel" onClick={onClose} disabled={loading}>
                Cancelar
              </button>
              <button className="gc-modal-btn gc-modal-btn--approve" onClick={handleApprove} disabled={loading}>
                {loading ? 'Aprobando...' : 'Sí, aprobar'}
              </button>
            </div>
          </>
        )}

        {type === 'reject' && (
          <>
            <div className="gc-modal-icon gc-modal-icon--reject">
              <XCircle size={30} />
            </div>
            <h3 className="gc-modal-title">Rechazar Complejo</h3>
            <p className="gc-modal-text">
              Vas a rechazar <strong>{complex.name}</strong>.
              Puedes incluir el motivo de rechazo (opcional).
            </p>
            <textarea
              className="gc-modal-textarea"
              placeholder="Motivo del rechazo (opcional)..."
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              rows={3}
              aria-label="Motivo del rechazo"
            />
            <div className="gc-modal-actions">
              <button className="gc-modal-btn gc-modal-btn--cancel" onClick={onClose} disabled={loading}>
                Cancelar
              </button>
              <button className="gc-modal-btn gc-modal-btn--reject" onClick={handleReject} disabled={loading}>
                {loading ? 'Rechazando...' : 'Sí, rechazar'}
              </button>
            </div>
          </>
        )}

        {type === 'suspend' && (
          <>
            <div className="gc-modal-icon gc-modal-icon--suspend">
              <PauseCircle size={30} />
            </div>
            <h3 className="gc-modal-title">Suspender Complejo</h3>
            <p className="gc-modal-text">
              Este complejo dejará de visualizarse en el portal <strong>inmediatamente</strong>.
              ¿Confirmas la suspensión de <strong>{complex.name}</strong>?
            </p>
            <div className="gc-modal-actions">
              <button className="gc-modal-btn gc-modal-btn--cancel" onClick={onClose} disabled={loading}>
                Cancelar
              </button>
              <button className="gc-modal-btn gc-modal-btn--suspend" onClick={handleSuspend} disabled={loading}>
                {loading ? 'Suspendiendo...' : 'Sí, suspender'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
