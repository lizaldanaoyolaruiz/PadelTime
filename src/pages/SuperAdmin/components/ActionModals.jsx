import { useState } from 'react';
import { CheckCircle, XCircle, PauseCircle, Pencil, Trash2, X, Building2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  approveComplex,
  rejectComplex,
  suspendComplex,
  updateComplex,
  deleteComplex,
  sendApprovalEmail,
  sendRejectionEmail,
} from '../../../services/complexService';
import { useComplexForm } from '../utils/hooks/useComplexForm';
import { blockNonLetters, blockNonPhone, blockNonDigits } from '../utils/validations';

function EditComplexForm({ complex, onClose, onStatusUpdate, loading, setLoading }) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useComplexForm(complex);

  const watchedName         = watch('name', complex.name || '');
  const watchedOwner        = watch('owner', complex.owner || '');
  const watchedAddress      = watch('address', complex.address || '');
  const watchedObservations = watch('observations', complex.observations || '');

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await updateComplex(complex.id, { ...data, courts: parseInt(data.courts) });
      onStatusUpdate(complex.id, res.data.data.status, res.data.data);
      toast.success('Complejo actualizado correctamente.');
      onClose();
    } catch {
      toast.error('Error al actualizar el complejo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="gc-modal-overlay" role="dialog" aria-modal="true" aria-label="Editar complejo">
      <div className="gc-new-modal">
        <div className="gc-new-modal-header">
          <div className="gc-new-modal-title-row">
            <div className="gc-new-modal-icon-wrap">
              <Building2 size={20} />
            </div>
            <div>
              <h3 className="gc-new-modal-title">Editar Complejo</h3>
              <p className="gc-new-modal-subtitle">Modificá los datos del complejo.</p>
            </div>
          </div>
          <button className="gc-drawer-close" onClick={onClose} aria-label="Cerrar">
            <X size={20} />
          </button>
        </div>

        <form className="gc-new-modal-body" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="gc-new-field gc-new-field--full">
            <label className="gc-new-label">Nombre del complejo <span className="gc-required">*</span></label>
            <input
              {...register('name')}
              className={`gc-new-input${errors.name ? ' gc-new-input--error' : ''}`}
              placeholder="Ej: Padel Center Norte"
              maxLength={80}
            />
            {errors.name
              ? <span className="gc-new-error">{errors.name.message}</span>
              : <span className="gc-new-hint">{watchedName.length}/80 — mín. 3 caracteres</span>}
          </div>

          <div className="gc-new-field">
            <label className="gc-new-label">Nombre del owner <span className="gc-required">*</span></label>
            <input
              {...register('owner')}
              className={`gc-new-input${errors.owner ? ' gc-new-input--error' : ''}`}
              placeholder="Ej: Juan García"
              maxLength={60}
              onKeyDown={blockNonLetters}
            />
            {errors.owner
              ? <span className="gc-new-error">{errors.owner.message}</span>
              : <span className="gc-new-hint">{watchedOwner.length}/60 — solo letras</span>}
          </div>

          <div className="gc-new-field">
            <label className="gc-new-label">Email del owner <span className="gc-required">*</span></label>
            <input
              {...register('email')}
              className={`gc-new-input${errors.email ? ' gc-new-input--error' : ''}`}
              type="email"
              placeholder="juan@ejemplo.com"
              maxLength={100}
            />
            {errors.email && <span className="gc-new-error">{errors.email.message}</span>}
          </div>

          <div className="gc-new-field">
            <label className="gc-new-label">Teléfono <span className="gc-required">*</span></label>
            <input
              {...register('phone')}
              className={`gc-new-input${errors.phone ? ' gc-new-input--error' : ''}`}
              type="tel"
              placeholder="+34 911 000 000"
              maxLength={18}
              onKeyDown={blockNonPhone}
            />
            {errors.phone
              ? <span className="gc-new-error">{errors.phone.message}</span>
              : <span className="gc-new-hint">Mín. 10 dígitos — solo números y +</span>}
          </div>

          <div className="gc-new-field">
            <label className="gc-new-label">Número de pistas <span className="gc-required">*</span></label>
            <input
              {...register('courts')}
              className={`gc-new-input${errors.courts ? ' gc-new-input--error' : ''}`}
              type="number"
              min="1"
              max="50"
              placeholder="Ej: 8"
              onKeyDown={blockNonDigits}
            />
            {errors.courts
              ? <span className="gc-new-error">{errors.courts.message}</span>
              : <span className="gc-new-hint">Entre 1 y 50</span>}
          </div>

          <div className="gc-new-field gc-new-field--full">
            <label className="gc-new-label">Dirección <span className="gc-required">*</span></label>
            <input
              {...register('address')}
              className={`gc-new-input${errors.address ? ' gc-new-input--error' : ''}`}
              placeholder="Ej: Av. Diagonal 123"
              maxLength={120}
            />
            {errors.address
              ? <span className="gc-new-error">{errors.address.message}</span>
              : <span className="gc-new-hint">{watchedAddress.length}/120 — mín. 5 caracteres</span>}
          </div>

          <div className="gc-new-field">
            <label className="gc-new-label">Ciudad <span className="gc-required">*</span></label>
            <input
              {...register('city')}
              className={`gc-new-input${errors.city ? ' gc-new-input--error' : ''}`}
              placeholder="Ej: Barcelona"
              maxLength={50}
              onKeyDown={blockNonLetters}
            />
            {errors.city
              ? <span className="gc-new-error">{errors.city.message}</span>
              : <span className="gc-new-hint">Solo letras — mín. 3</span>}
          </div>

          <div className="gc-new-field">
            <label className="gc-new-label">Provincia <span className="gc-required">*</span></label>
            <input
              {...register('province')}
              className={`gc-new-input${errors.province ? ' gc-new-input--error' : ''}`}
              placeholder="Ej: Cataluña"
              maxLength={50}
              onKeyDown={blockNonLetters}
            />
            {errors.province
              ? <span className="gc-new-error">{errors.province.message}</span>
              : <span className="gc-new-hint">Solo letras — mín. 3</span>}
          </div>

          <div className="gc-new-field gc-new-field--full">
            <label className="gc-new-label">
              Observaciones <span className="gc-optional">(opcional)</span>
            </label>
            <textarea
              {...register('observations')}
              className={`gc-new-input gc-new-textarea${errors.observations ? ' gc-new-input--error' : ''}`}
              placeholder="Notas internas sobre este complejo..."
              rows={3}
              maxLength={300}
            />
            {errors.observations
              ? <span className="gc-new-error">{errors.observations.message}</span>
              : <span className="gc-new-hint">{watchedObservations.length}/300</span>}
          </div>

          <div className="gc-new-modal-footer">
            <p className="gc-new-footer-note"><span className="gc-required">*</span> Campos obligatorios</p>
            <div className="gc-new-footer-actions">
              <button
                type="button"
                className="gc-modal-btn gc-modal-btn--cancel"
                onClick={onClose}
                disabled={isSubmitting || loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="gc-modal-btn gc-modal-btn--approve"
                disabled={isSubmitting || loading}
              >
                {isSubmitting || loading ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export function ActionModals({ modal, onClose, onStatusUpdate, onDelete }) {
  const [rejectReason, setRejectReason] = useState('');
  const [loading, setLoading]           = useState(false);

  const { open, type, complex } = modal;
  if (!open || !complex) return null;

  if (type === 'edit') {
    return (
      <EditComplexForm
        complex={complex}
        onClose={onClose}
        onStatusUpdate={onStatusUpdate}
        loading={loading}
        setLoading={setLoading}
      />
    );
  }

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

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteComplex(complex.id);
      onDelete(complex.id);
      toast.success('Complejo eliminado correctamente.');
      onClose();
    } catch {
      toast.error('Error al eliminar el complejo.');
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

        {type === 'delete' && (
          <>
            <div className="gc-modal-icon gc-modal-icon--reject">
              <Trash2 size={30} />
            </div>
            <h3 className="gc-modal-title">Eliminar Complejo</h3>
            <p className="gc-modal-text">
              Esta acción es <strong>irreversible</strong>.
              ¿Confirmas que deseas eliminar <strong>{complex.name}</strong>?
            </p>
            <div className="gc-modal-actions">
              <button className="gc-modal-btn gc-modal-btn--cancel" onClick={onClose} disabled={loading}>
                Cancelar
              </button>
              <button className="gc-modal-btn gc-modal-btn--reject" onClick={handleDelete} disabled={loading}>
                {loading ? 'Eliminando...' : 'Sí, eliminar'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
