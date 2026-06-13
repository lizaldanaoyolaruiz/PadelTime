import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useReservationForm } from '../utils/hooks/useReservationForm';
import { generarSlots } from '../utils/constants';
import { blockNonLetters, blockNonPhone } from '../utils/validations';
import { createReserva } from '../../../api/reservasApi';
import { getMyCourts } from '../../../api/courtApi';
import { getMyComplex } from '../../../api/complexApi';
import { successAlert, errorAlert } from '../../../utils/alerts';

const SLOTS = generarSlots();

export default function NewReservationModal({ onClose, onCreated }) {
  const [canchas, setCanchas] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        let complexId;
        try {
          const res = await getMyComplex();
          complexId = res.data.complex?._id || res.data._id;
        } catch { /* sigue sin complexId */ }

        const res = await getMyCourts(complexId);
        const courts = res.data.courts || res.data || [];
        setCanchas(Array.isArray(courts) ? courts : []);
      } catch { /* silencia errores de dev */ }
    })();
  }, []);

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useReservationForm();

  const watchedNombre   = watch('jugadorNombre', '');
  const watchedApellido = watch('jugadorApellido', '');
  const watchedObs      = watch('observaciones', '');

  const onSubmit = async (data) => {
    try {
      await createReserva(data);
      await successAlert('Reserva creada correctamente.');
      onCreated();
    } catch (err) {
      await errorAlert(err.response?.data?.message || 'Error al crear la reserva.');
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box modal-box--wide">
        <div className="modal-header">
          <h3>Nueva Reserva</h3>
          <button className="modal-close" onClick={onClose}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="modal-form">
          <p className="modal-section-title">Datos del turno</p>

          <div className="form-group">
            <label className="form-label">Cancha</label>
            <select
              className={`form-input form-select${errors.canchaId ? ' input-error' : ''}`}
              {...register('canchaId')}
            >
              <option value="">Seleccioná una cancha...</option>
              {canchas.map(c => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
            {errors.canchaId
              ? <span className="error-msg">{errors.canchaId.message}</span>
              : <span className="form-hint">Campo requerido</span>}
          </div>

          <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <div className="form-group">
              <label className="form-label">Fecha</label>
              <input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                className={`form-input${errors.fecha ? ' input-error' : ''}`}
                {...register('fecha')}
              />
              {errors.fecha
                ? <span className="error-msg">{errors.fecha.message}</span>
                : <span className="form-hint">Campo requerido — no puede ser en el pasado</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Horario de inicio</label>
              <select
                className={`form-input form-select${errors.horaInicio ? ' input-error' : ''}`}
                {...register('horaInicio')}
              >
                <option value="">Seleccioná...</option>
                {SLOTS.map(s => (
                  <option key={s} value={s}>{s} hs</option>
                ))}
              </select>
              {errors.horaInicio
                ? <span className="error-msg">{errors.horaInicio.message}</span>
                : <span className="form-hint">Campo requerido</span>}
            </div>
          </div>

          <p className="modal-section-title">Datos del jugador</p>

          <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <div className="form-group">
              <label className="form-label">Nombre</label>
              <input
                className={`form-input${errors.jugadorNombre ? ' input-error' : ''}`}
                placeholder="Juan"
                maxLength={50}
                onKeyDown={blockNonLetters}
                {...register('jugadorNombre')}
              />
              {errors.jugadorNombre
                ? <span className="error-msg">{errors.jugadorNombre.message}</span>
                : <span className="form-hint">{watchedNombre.length}/50 — solo letras, mín. 3</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Apellido</label>
              <input
                className={`form-input${errors.jugadorApellido ? ' input-error' : ''}`}
                placeholder="Pérez"
                maxLength={50}
                onKeyDown={blockNonLetters}
                {...register('jugadorApellido')}
              />
              {errors.jugadorApellido
                ? <span className="error-msg">{errors.jugadorApellido.message}</span>
                : <span className="form-hint">{watchedApellido.length}/50 — solo letras, mín. 3</span>}
            </div>
          </div>

          <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                className={`form-input${errors.jugadorEmail ? ' input-error' : ''}`}
                placeholder="juan@email.com"
                maxLength={100}
                {...register('jugadorEmail')}
              />
              {errors.jugadorEmail
                ? <span className="error-msg">{errors.jugadorEmail.message}</span>
                : <span className="form-hint">Formato: nombre@dominio.com</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Teléfono</label>
              <input
                type="tel"
                className={`form-input${errors.jugadorTelefono ? ' input-error' : ''}`}
                placeholder="+54 9 11 1234-5678"
                maxLength={18}
                onKeyDown={blockNonPhone}
                {...register('jugadorTelefono')}
              />
              {errors.jugadorTelefono
                ? <span className="error-msg">{errors.jugadorTelefono.message}</span>
                : <span className="form-hint">Solo números y + — 7 a 15 dígitos</span>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Observaciones</label>
            <textarea
              className={`form-input form-textarea${errors.observaciones ? ' input-error' : ''}`}
              rows={2}
              maxLength={200}
              placeholder="Ej: Viene con 4 personas, pide cancha techada..."
              {...register('observaciones')}
            />
            {errors.observaciones
              ? <span className="error-msg">{errors.observaciones.message}</span>
              : <span className="form-hint">{watchedObs.length}/200 — mín. 3 caracteres</span>}
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Creando...' : 'Crear Reserva'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
