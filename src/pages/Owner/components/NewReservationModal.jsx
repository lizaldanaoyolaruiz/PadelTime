import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useReservationForm } from '../utils/hooks/useReservationForm';
import { generarSlots } from '../utils/constants';
import { blockNonLetters, blockNonPhone } from '../utils/validations';
import { createReserva, crearMantenimiento } from '../../../services/reservationService';
import { getMyCourts } from '../../../services/courtService';
import { getMyComplex } from '../../../services/complexService';
import { successAlert, errorAlert } from '../../../utils/alerts';

const SLOTS = generarSlots();
const DIA_LABELS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

function formatSlotInfo(slotData) {
  const d = new Date(slotData.date + 'T12:00:00');
  const dia   = DIA_LABELS[d.getDay()];
  const startH = String(slotData.hour).padStart(2, '0');
  const endH   = String(slotData.hour + 1).padStart(2, '0');
  return `${dia} ${slotData.date} · ${startH}:00 – ${endH}:00`;
}

function derivarEndTime(horaInicio) {
  if (!horaInicio) return '';
  const [h, m] = horaInicio.split(':').map(Number);
  return `${String(h + 1).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export default function NewReservationModal({ slotData = null, onClose, onCreated }) {
  const [canchas, setCanchas] = useState([]);
  const [modo,    setModo]    = useState('reserva');
  const [motivo,  setMotivo]  = useState('');
  const [mantCanchaId,   setMantCanchaId]   = useState(slotData?.courtId || '');
  const [mantFecha,      setMantFecha]      = useState(slotData?.date    || '');
  const [mantHoraInicio, setMantHoraInicio] = useState(
    slotData?.hour != null ? String(slotData.hour).padStart(2, '0') + ':00' : ''
  );
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } =
    useReservationForm();

  useEffect(() => {
    if (!slotData) return;
    setValue('canchaId', slotData.courtId);
    setValue('fecha', slotData.date);
    setValue('horaInicio', String(slotData.hour).padStart(2, '0') + ':00');
  }, [slotData, setValue]);

  const watchedNombre   = watch('jugadorNombre',   '');
  const watchedApellido = watch('jugadorApellido', '');
  const watchedObs      = watch('observaciones',   '');

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
        const lista  = Array.isArray(courts) ? courts : [];
        setCanchas(lista);

        if (slotData?.courtId) setValue('canchaId', slotData.courtId);
      } catch { /* silencia */ }
    })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Submit reserva ── */
  const onSubmitReserva = async (data) => {
    const payload = {
      ...data,
      canchaId:   slotData?.courtId  || data.canchaId,
      fecha:      slotData?.date     || data.fecha,
      horaInicio: slotData?.hour != null
        ? String(slotData.hour).padStart(2, '0') + ':00'
        : data.horaInicio,
    };
    try {
      await createReserva(payload);
      await successAlert('Reserva creada correctamente.');
      onCreated();
    } catch (err) {
      await errorAlert(err.response?.data?.message || 'Error al crear la reserva.');
    }
  };

  /* ── Submit mantenimiento ── */
  const onSubmitMantenimiento = async (e) => {
    e.preventDefault();
    const courtId   = slotData?.courtId  || mantCanchaId;
    const date      = slotData?.date     || mantFecha;
    const startTime = slotData?.hour != null
      ? String(slotData.hour).padStart(2, '0') + ':00'
      : mantHoraInicio;
    const endTime   = slotData?.hour != null
      ? String(slotData.hour + 1).padStart(2, '0') + ':00'
      : derivarEndTime(mantHoraInicio);

    if (!courtId || !date || !startTime) {
      await errorAlert('Completá cancha, fecha y horario.');
      return;
    }
    setSubmitting(true);
    try {
      await crearMantenimiento({ courtId, date, startTime, endTime, motivo });
      await successAlert('Bloqueo de mantenimiento creado.');
      onCreated();
    } catch (err) {
      await errorAlert(err.response?.data?.message || 'Error al crear el mantenimiento.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box modal-box--wide">
        <div className="modal-header">
          <h3>{modo === 'reserva' ? 'Nueva Reserva' : 'Bloquear Cancha'}</h3>
          <button className="modal-close" onClick={onClose}><X size={18} /></button>
        </div>

        <div style={{ padding: '16px 24px 0' }}>
          <div className="modal-toggle">
            <button
              type="button"
              className={`toggle-btn${modo === 'reserva' ? ' active' : ''}`}
              onClick={() => setModo('reserva')}
            >
              Nueva Reserva
            </button>
            <button
              type="button"
              className={`toggle-btn${modo === 'mantenimiento' ? ' active' : ''}`}
              onClick={() => setModo('mantenimiento')}
            >
              Mantenimiento
            </button>
          </div>
        </div>

        {modo === 'reserva' && (
          <form onSubmit={handleSubmit(onSubmitReserva)} noValidate className="modal-form">
            <p className="modal-section-title">Datos del turno</p>

            <div className="form-group">
              <label className="form-label">Cancha</label>
              <select
                className={`form-input form-select${errors.canchaId ? ' input-error' : ''}`}
                disabled={!!slotData?.courtId}
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

            {slotData ? (
              <div className="form-group">
                <label className="form-label">Turno seleccionado</label>
                <div className="form-input" style={{ color: 'var(--color-text-base)', cursor: 'default' }}>
                  {formatSlotInfo(slotData)}
                </div>
              </div>
            ) : (
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
                    : <span className="form-hint">No puede ser en el pasado</span>}
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
            )}

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
        )}

        {modo === 'mantenimiento' && (
          <form onSubmit={onSubmitMantenimiento} noValidate className="modal-form">
            <p className="modal-section-title">Bloqueo de horario</p>

            <div className="form-group">
              <label className="form-label">Cancha</label>
              <select
                className="form-input form-select"
                value={slotData?.courtId || mantCanchaId}
                onChange={e => setMantCanchaId(e.target.value)}
                disabled={!!slotData?.courtId}
              >
                <option value="">Seleccioná una cancha...</option>
                {canchas.map(c => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Turno: texto si slotData, inputs si no */}
            {slotData ? (
              <div className="form-group">
                <label className="form-label">Horario bloqueado</label>
                <div className="form-input" style={{ color: 'var(--color-text-base)', cursor: 'default' }}>
                  {formatSlotInfo(slotData)}
                </div>
              </div>
            ) : (
              <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                <div className="form-group">
                  <label className="form-label">Fecha</label>
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    className="form-input"
                    value={mantFecha}
                    onChange={e => setMantFecha(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Horario de inicio</label>
                  <select
                    className="form-input form-select"
                    value={mantHoraInicio}
                    onChange={e => setMantHoraInicio(e.target.value)}
                  >
                    <option value="">Seleccioná...</option>
                    {SLOTS.map(s => (
                      <option key={s} value={s}>{s} hs</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Motivo <span style={{ color: 'var(--color-text-muted)', fontWeight: 400 }}>(opcional)</span></label>
              <input
                className="form-input"
                placeholder="Ej: Reparación de piso"
                maxLength={150}
                value={motivo}
                onChange={e => setMotivo(e.target.value)}
              />
            </div>

            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={onClose}>Cancelar</button>
              <button type="submit" className="btn-primary" disabled={submitting}>
                {submitting ? 'Guardando...' : 'Bloquear horario'}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
