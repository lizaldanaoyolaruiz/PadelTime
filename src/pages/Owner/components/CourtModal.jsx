import { X } from 'lucide-react';
import { useCourtForm } from '../utils/hooks/useCourtForm';
import { SUPERFICIES } from '../utils/constants';
import { blockNonDigits } from '../utils/validations';

export default function CourtModal({ cancha, onClose, onSave }) {
  const isEdit = Boolean(cancha?._id);
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useCourtForm(cancha);

  const watchedName = watch('name', '');
  const watchedDesc = watch('description', '');

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div className="modal-header">
          <h3>{isEdit ? 'Editar cancha' : 'Nueva cancha'}</h3>
          <button className="modal-close" onClick={onClose}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit(onSave)} noValidate className="modal-form">
          <div className="form-group">
            <label className="form-label">Nombre de la cancha</label>
            <input
              className={`form-input${errors.name ? ' input-error' : ''}`}
              placeholder="Ej: Cancha 1"
              maxLength={50}
              {...register('name')}
            />
            {errors.name
              ? <span className="error-msg">{errors.name.message}</span>
              : <span className="form-hint">{watchedName.length}/50 — mín. 3 caracteres</span>}
          </div>

          <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <div className="form-group">
              <label className="form-label">Superficie</label>
              <select
                className={`form-input form-select${errors.type ? ' input-error' : ''}`}
                {...register('type')}
              >
                <option value="">Seleccioná...</option>
                {SUPERFICIES.map(s => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
              {errors.type && <span className="error-msg">{errors.type.message}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Precio por hora ($)</label>
              <input
                type="number"
                min="0"
                step="100"
                className={`form-input${errors.pricePerHour ? ' input-error' : ''}`}
                placeholder="Ej: 3000"
                onKeyDown={blockNonDigits}
                {...register('pricePerHour')}
              />
              {errors.pricePerHour
                ? <span className="error-msg">{errors.pricePerHour.message}</span>
                : <span className="form-hint">Solo números — máx. $999.999</span>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Descripción</label>
            <textarea
              className={`form-input form-textarea${errors.description ? ' input-error' : ''}`}
              rows={2}
              maxLength={300}
              placeholder="Ej: Cancha techada con iluminación LED..."
              {...register('description')}
            />
            {errors.description
              ? <span className="error-msg">{errors.description.message}</span>
              : <span className="form-hint">{watchedDesc.length}/300 — mín. 3 caracteres</span>}
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear cancha'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
