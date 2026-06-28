import { X } from 'lucide-react';
import { useTournamentForm } from '../utils/hooks/useTournamentForm';
import { CATEGORIAS, ESTADOS } from '../utils/schemas/tournamentSchema';
import './Tournaments.css';

export default function TournamentsForm({ torneo, onClose, onSave }) {
  const isEdit = Boolean(torneo?._id);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useTournamentForm(torneo);

  const today             = new Date().toISOString().split('T')[0];
  const watchedNombre     = watch('nombre', '');
  const watchedDesc       = watch('descripcion', '');
  const watchedFechaIni   = watch('fechaInicio', '');

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box modal-box--wide">
        <div className="modal-header">
          <h3>{isEdit ? 'Editar torneo' : 'Nuevo torneo'}</h3>
          <button className="modal-close" onClick={onClose}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit(onSave)} noValidate className="modal-form">

          <div className="form-group">
            <label className="form-label">Nombre del torneo</label>
            <input
              className={`form-input${errors.nombre ? ' input-error' : ''}`}
              placeholder="Ej: Open Verano 2024"
              maxLength={100}
              {...register('nombre')}
            />
            {errors.nombre
              ? <span className="error-msg">{errors.nombre.message}</span>
              : <span className="form-hint">{watchedNombre.length}/100 — mín. 3 caracteres</span>}
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Fecha de inicio</label>
              <input
                type="date"
                lang="es"
                min={!isEdit ? today : undefined}
                className={`form-input${errors.fechaInicio ? ' input-error' : ''}`}
                {...register('fechaInicio')}
              />
              {errors.fechaInicio && <span className="error-msg">{errors.fechaInicio.message}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Fecha de fin</label>
              <input
                type="date"
                lang="es"
                min={watchedFechaIni || (!isEdit ? today : undefined)}
                className={`form-input${errors.fechaFin ? ' input-error' : ''}`}
                {...register('fechaFin')}
              />
              {errors.fechaFin && <span className="error-msg">{errors.fechaFin.message}</span>}
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Ubicación</label>
              <input
                className={`form-input${errors.ubicacion ? ' input-error' : ''}`}
                placeholder="Ej: Club Palermo, Buenos Aires"
                maxLength={100}
                {...register('ubicacion')}
              />
              {errors.ubicacion && <span className="error-msg">{errors.ubicacion.message}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Cupo máximo</label>
              <input
                type="number"
                min="1"
                max="9999"
                className={`form-input${errors.cupoMaximo ? ' input-error' : ''}`}
                placeholder="Ej: 32"
                {...register('cupoMaximo')}
              />
              {errors.cupoMaximo && <span className="error-msg">{errors.cupoMaximo.message}</span>}
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Categoría</label>
              <select
                className={`form-input form-select${errors.categoria ? ' input-error' : ''}`}
                {...register('categoria')}
              >
                <option value="">Seleccioná...</option>
                {CATEGORIAS.map(c => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
              {errors.categoria && <span className="error-msg">{errors.categoria.message}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Estado</label>
              <select
                className={`form-input form-select${errors.estado ? ' input-error' : ''}`}
                {...register('estado')}
              >
                {ESTADOS.map(e => (
                  <option key={e.value} value={e.value}>{e.label}</option>
                ))}
              </select>
              {errors.estado && <span className="error-msg">{errors.estado.message}</span>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              WhatsApp de contacto
              <span className="form-optional"> (opcional)</span>
            </label>
            <input
              type="tel"
              className={`form-input${errors.whatsapp ? ' input-error' : ''}`}
              placeholder="Ej: 5493815001122"
              maxLength={20}
              {...register('whatsapp')}
            />
            {errors.whatsapp
              ? <span className="error-msg">{errors.whatsapp.message}</span>
              : <span className="form-hint">Número sin espacios ni guiones — se usará para el botón de reserva</span>}
          </div>

          <div className="form-group">
            <label className="form-label">
              Descripción y reglas
              <span className="form-optional"> (opcional)</span>
            </label>
            <textarea
              className={`form-input form-textarea${errors.descripcion ? ' input-error' : ''}`}
              rows={3}
              maxLength={500}
              placeholder="Ej: Torneo dobles mixtos, formato round robin..."
              {...register('descripcion')}
            />
            {errors.descripcion
              ? <span className="error-msg">{errors.descripcion.message}</span>
              : <span className="form-hint">{(watchedDesc || '').length}/500</span>}
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear torneo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
