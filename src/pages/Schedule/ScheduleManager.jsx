import { useState, useEffect, useCallback } from 'react';
import { Clock, Plus, Trash2, Pencil, AlertTriangle, X } from 'lucide-react';
import Swal from 'sweetalert2';
import {
  getCourtsSchedule,
  updateCourtSchedule,
  getBlockouts,
  createBlockout,
  updateBlockout,
  deleteBlockout,
} from '../../services/scheduleService';
import { getMyComplex } from '../../services/complexService';
import { confirmDelete, confirmSave, successAlert, errorAlert } from '../../utils/alerts';
import './schedule.css';

const DAYS = [
  { key: 'monday',    label: 'Lunes',      short: 'L' },
  { key: 'tuesday',   label: 'Martes',     short: 'M' },
  { key: 'wednesday', label: 'Miércoles',  short: 'X' },
  { key: 'thursday',  label: 'Jueves',     short: 'J' },
  { key: 'friday',    label: 'Viernes',    short: 'V' },
  { key: 'saturday',  label: 'Sábado',     short: 'S' },
  { key: 'sunday',    label: 'Domingo',    short: 'D' },
];

const DAY_ES = {
  lunes: 'Lun', martes: 'Mar', miercoles: 'Mié',
  jueves: 'Jue', viernes: 'Vie', sabado: 'Sáb', domingo: 'Dom',
};

const fmtDate = (iso) => {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y.slice(2)}`;
};

function parseMinutes(t) {
  if (!t || t === '--') return 0;
  const [h, m] = t.split(':').map(Number);
  return h * 60 + (m || 0);
}

function calcWeeklyHours(days) {
  return days.reduce((acc, d) => {
    if (!d.active || d.openTime === '--' || d.closeTime === '--') return acc;
    return acc + (parseMinutes(d.closeTime) - parseMinutes(d.openTime)) / 60;
  }, 0);
}

function calcBlockedHours(blocks) {
  return blocks.reduce((acc, b) => {
    const h = (parseMinutes(b.endTime) - parseMinutes(b.startTime)) / 60;
    return acc + (b.recurrence === 'daily' ? h * 7 : h);
  }, 0);
}

const BLOCK_REASONS = [
  'Mantenimiento',
  'Día feriado',
  'Clase / Entrenamiento',
  'Evento privado',
  'Limpieza',
  'Otro',
];

const EMPTY_FORM = {
  name: '', customName: '', recurrence: 'once', dayOfWeek: '', date: '', startTime: '14:00', endTime: '16:00', courtId: '',
};

const NAME_REGEX = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9\s\-\/]+$/;

function validateForm(form, todayStr, currentTime, complexHours) {
  const errors = {};

  // Motivo
  if (!form.name) {
    errors.name = 'Seleccioná un motivo.';
  } else if (form.name === 'Otro') {
    const cn = form.customName.trim();
    if (!cn) errors.customName = 'Ingresá una descripción.';
    else if (cn.length < 3) errors.customName = 'Mínimo 3 caracteres.';
    else if (cn.length > 50) errors.customName = 'Máximo 50 caracteres.';
    else if (!NAME_REGEX.test(cn)) errors.customName = 'Solo letras, números, espacios y guiones.';
  }

  // Fecha específica
  if (form.recurrence === 'once') {
    if (!form.date) {
      errors.date = 'Seleccioná una fecha.';
    } else if (form.date < todayStr) {
      errors.date = 'La fecha no puede ser en el pasado.';
    } else {
      const maxDate = new Date();
      maxDate.setFullYear(maxDate.getFullYear() + 1);
      if (form.date > maxDate.toISOString().split('T')[0])
        errors.date = 'La fecha no puede superar 1 año en el futuro.';
    }
  }

  // Día semana
  if (form.recurrence === 'weekly' && !form.dayOfWeek) {
    errors.dayOfWeek = 'Seleccioná un día de la semana.';
  }

  // Court closed on the selected day
  if (complexHours?.closed) {
    errors.startTime = 'La cancha está cerrada ese día. No se puede crear un bloqueo.';
    return errors;
  }

  // Horario inicio
  if (!form.startTime) {
    errors.startTime = 'Ingresá la hora de inicio.';
  } else if (form.recurrence === 'once' && form.date === todayStr && form.startTime < currentTime) {
    errors.startTime = 'La hora de inicio no puede ser en el pasado.';
  } else if (complexHours?.open && form.startTime < complexHours.open) {
    errors.startTime = `No puede ser antes de las ${complexHours.open} (apertura del complejo).`;
  } else if (complexHours?.close && form.startTime >= complexHours.close) {
    errors.startTime = `No puede ser a las ${complexHours.close} o después (cierre del complejo).`;
  }

  // Horario fin
  if (!form.endTime) {
    errors.endTime = 'Ingresá la hora de fin.';
  } else if (form.startTime && form.endTime <= form.startTime) {
    errors.endTime = 'El fin debe ser posterior al inicio.';
  } else if (complexHours?.close && form.endTime > complexHours.close) {
    errors.endTime = `No puede superar las ${complexHours.close} (cierre del complejo).`;
  } else if (form.startTime && form.endTime) {
    const [sh, sm] = form.startTime.split(':').map(Number);
    const [eh, em] = form.endTime.split(':').map(Number);
    if ((eh * 60 + em) - (sh * 60 + sm) < 30)
      errors.endTime = 'El bloqueo debe durar al menos 30 minutos.';
  }

  return errors;
}

function mapBlockToForm(block) {
  if (!block) return EMPTY_FORM;
  const isCustom = !BLOCK_REASONS.includes(block.name);
  return {
    name: isCustom ? 'Otro' : block.name,
    customName: isCustom ? block.name : '',
    recurrence: block.recurrence || 'once',
    dayOfWeek: block.dayOfWeek || '',
    date: block.date || '',
    startTime: block.startTime || '14:00',
    endTime: block.endTime || '16:00',
    courtId: block.courtId || '',
  };
}

const DAY_KEY_MAP = {
  lunes: 'monday', martes: 'tuesday', miercoles: 'wednesday',
  jueves: 'thursday', viernes: 'friday', sabado: 'saturday', domingo: 'sunday',
};
const JS_TO_KEY = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];

function getTimeRange(courts, complexHours, courtId, recurrence, date, dayOfWeek) {
  const complexOpen  = complexHours?.open  || '00:00';
  const complexClose = complexHours?.close || '23:59';

  const intersect = (courtOpen, courtClose) => ({
    open:  courtOpen  > complexOpen  ? courtOpen  : complexOpen,
    close: courtClose < complexClose ? courtClose : complexClose,
  });

  const court = courts.find(c => String(c.courtId) === String(courtId));
  if (!court) return { open: complexOpen, close: complexClose };

  if (recurrence === 'once' && date) {
    const dayKey = JS_TO_KEY[new Date(date + 'T12:00:00').getDay()];
    const dayData = court.days?.find(d => d.day === dayKey);
    if (dayData && !dayData.active) return { closed: true };
    if (dayData?.active && dayData.openTime && dayData.openTime !== '--')
      return intersect(dayData.openTime, dayData.closeTime);
  }

  if (recurrence === 'weekly' && dayOfWeek) {
    const dayKey = DAY_KEY_MAP[dayOfWeek];
    const dayData = court.days?.find(d => d.day === dayKey);
    if (dayData && !dayData.active) return { closed: true };
    if (dayData?.active && dayData.openTime && dayData.openTime !== '--')
      return intersect(dayData.openTime, dayData.closeTime);
  }

  if (recurrence === 'daily') {
    const activeDays = court.days?.filter(d => d.active && d.openTime && d.openTime !== '--') || [];
    if (activeDays.length) {
      const open  = activeDays.reduce((max, d) => d.openTime  > max ? d.openTime  : max, '00:00');
      const close = activeDays.reduce((min, d) => d.closeTime < min ? d.closeTime : min, '23:59');
      return intersect(open, close);
    }
  }

  return { open: complexOpen, close: complexClose };
}

function BlockModal({ isOpen, onClose, onSave, courts, editingBlock, complexHours }) {
  const isEditing = !!editingBlock;
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) { setForm(mapBlockToForm(editingBlock)); setErrors({}); }
  }, [isOpen, editingBlock]);

  if (!isOpen) return null;

  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  const currentTime = now.toTimeString().slice(0, 5);
  const isToday = form.date === todayStr;

  const timeRange = getTimeRange(courts, complexHours, form.courtId, form.recurrence, form.date, form.dayOfWeek);
  const minStartTime = isToday ? currentTime : timeRange.open;
  const maxStartTime = timeRange.close;
  const minEndTime = form.startTime || (isToday ? currentTime : timeRange.open);
  const maxEndTime = timeRange.close;

  const maxDateStr = (() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() + 1);
    return d.toISOString().split('T')[0];
  })();

  const set = (field, value) => {
    setForm(f => ({ ...f, [field]: value }));
    setErrors(e => ({ ...e, [field]: undefined }));
  };

  const handleSave = async () => {
    const errs = validateForm(form, todayStr, currentTime, timeRange);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    const finalName = form.name === 'Otro' ? form.customName.trim() : form.name;

    if (isEditing) {
      const confirm = await Swal.fire({
        background: '#1f2937', color: '#ffffff',
        confirmButtonColor: '#a3e635', cancelButtonColor: '#374151',
        title: '¿Actualizar bloqueo?',
        text: 'Se guardarán los cambios del bloqueo.',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, actualizar',
        cancelButtonText: 'Cancelar',
      });
      if (!confirm.isConfirmed) return;
    }

    setSaving(true);
    try {
      await onSave({ ...form, name: finalName });
    } finally {
      setSaving(false);
    }
  };

  const ic = (field) => `sm-input${errors[field] ? ' sm-input--error' : ''}`;

  return (
    <div className="sm-backdrop" onClick={onClose}>
      <form className="sm-modal" onClick={e => e.stopPropagation()} onSubmit={e => { e.preventDefault(); handleSave(); }} noValidate>
        <div className="sm-modal-head">
          <span>{isEditing ? 'Editar Bloqueo' : 'Nuevo Bloqueo'}</span>
          <button type="button" className="sm-modal-close" onClick={onClose}><X size={16} /></button>
        </div>

        <div className="sm-modal-body">
          <p className="sm-required-legend"><span className="sm-required">*</span> Campos obligatorios</p>

          <label className="sm-label">Motivo <span className="sm-required">*</span></label>
          <select required className={ic('name')} value={form.name}
            onChange={e => { set('name', e.target.value); setErrors(er => ({ ...er, customName: undefined })); }}>
            <option value="">Seleccionar motivo</option>
            {BLOCK_REASONS.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          {errors.name && <span className="sm-error-msg">{errors.name}</span>}

          {form.name === 'Otro' && (
            <>
              <label className="sm-label">Descripción <span className="sm-required">*</span></label>
              <input required className={ic('customName')} placeholder="Describí el motivo (3–50 caracteres)"
                maxLength={50} minLength={3}
                value={form.customName}
                onChange={e => set('customName', e.target.value)} />
              {errors.customName && <span className="sm-error-msg">{errors.customName}</span>}
            </>
          )}

          <label className="sm-label">Tipo de bloqueo <span className="sm-required">*</span></label>
          <select required className="sm-input" value={form.recurrence}
            onChange={e => { setForm(f => ({ ...f, recurrence: e.target.value, dayOfWeek: '', date: '' })); setErrors({}); }}>
            <option value="once">Fecha específica (un día puntual)</option>
            <option value="weekly">Semanal (todos los lunes, martes, etc.)</option>
            <option value="daily">Diario (todos los días)</option>
          </select>

          {form.recurrence === 'once' && (
            <>
              <label className="sm-label">Fecha <span className="sm-required">*</span></label>
              <input required type="date" className={ic('date')} value={form.date}
                min={todayStr} max={maxDateStr}
                onChange={e => { set('date', e.target.value); setForm(f => ({ ...f, date: e.target.value, startTime: '14:00', endTime: '16:00' })); }} />
              {errors.date && <span className="sm-error-msg">{errors.date}</span>}
            </>
          )}

          {form.recurrence === 'weekly' && (
            <>
              <label className="sm-label">Día de la semana <span className="sm-required">*</span></label>
              <select required className={ic('dayOfWeek')} value={form.dayOfWeek}
                onChange={e => set('dayOfWeek', e.target.value)}>
                <option value="">Seleccionar día</option>
                {['lunes','martes','miercoles','jueves','viernes','sabado','domingo'].map(d => (
                  <option key={d} value={d}>{DAY_ES[d]}</option>
                ))}
              </select>
              {errors.dayOfWeek && <span className="sm-error-msg">{errors.dayOfWeek}</span>}
            </>
          )}

          {timeRange.closed && (
            <div style={{ background: '#7f1d1d', color: '#fca5a5', borderRadius: 8, padding: '10px 14px', marginBottom: 8, fontSize: 13 }}>
              La cancha está cerrada ese día. Elegí otra fecha o cancha.
            </div>
          )}

          <div className="sm-row2">
            <div>
              <label className="sm-label">Inicio <span className="sm-required">*</span></label>
              <input required type="time" className={ic('startTime')}
                value={form.startTime} min={minStartTime} max={maxStartTime}
                onChange={e => set('startTime', e.target.value)} />
              {errors.startTime && <span className="sm-error-msg">{errors.startTime}</span>}
            </div>
            <div>
              <label className="sm-label">Fin <span className="sm-required">*</span></label>
              <input required type="time" className={ic('endTime')}
                value={form.endTime} min={minEndTime} max={maxEndTime}
                onChange={e => set('endTime', e.target.value)} />
              {errors.endTime && <span className="sm-error-msg">{errors.endTime}</span>}
            </div>
          </div>

          <label className="sm-label">Cancha (opcional)</label>
          <select className="sm-input" value={form.courtId}
            onChange={e => set('courtId', e.target.value)}>
            <option value="">Todas las canchas</option>
            {courts.map(c => <option key={c.courtId} value={c.courtId}>{c.courtName}</option>)}
          </select>
        </div>

        <div className="sm-modal-foot">
          <button type="button" className="sm-btn-ghost" onClick={onClose}>Cancelar</button>
          <button type="submit" className="sm-btn-save" disabled={saving}>
            {saving ? 'Guardando...' : isEditing ? 'Actualizar' : 'Guardar'}
          </button>
        </div>
      </form>
    </div>
  );
}

export const ScheduleManager = () => {
  const [courts, setCourts]             = useState([]);
  const [blockouts, setBlockouts]       = useState([]);
  const [complexHours, setComplexHours] = useState({ open: null, close: null });
  const [selectedCourtId, setSelectedCourtId] = useState(null);
  const [scheduleChanges, setScheduleChanges] = useState({});
  const [onlineStatus, setOnlineStatus] = useState(true);
  const [loading, setLoading]           = useState(true);
  const [saving, setSaving]             = useState(false);
  const [error, setError]               = useState(null);
  const [showModal, setShowModal]       = useState(false);
  const [editingBlock, setEditingBlock] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [schedRes, blockRes, complexRes] = await Promise.all([
        getCourtsSchedule(),
        getBlockouts().catch(() => ({ data: [] })),
        getMyComplex().catch(() => null),
      ]);
      const courtsData = Array.isArray(schedRes.data) ? schedRes.data : [];
      setCourts(courtsData);
      if (courtsData.length) setSelectedCourtId(c => c ?? courtsData[0].courtId);
      setBlockouts(Array.isArray(blockRes.data) ? blockRes.data : []);
      if (complexRes) {
        const cx = complexRes.data?.complex || complexRes.data;
        setComplexHours({ open: cx?.openTime || null, close: cx?.closeTime || null });
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Error al cargar horarios');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const selectedCourt = courts.find(c => String(c.courtId) === String(selectedCourtId));
  const courtSchedule = scheduleChanges[selectedCourtId] ?? {
    active: selectedCourt?.active ?? true,
    days: selectedCourt?.days ?? [],
  };
  const hasChanges = Object.keys(scheduleChanges).length > 0;

  const updateDay = (idx, field, value) => {
    setScheduleChanges(prev => {
      const base = prev[selectedCourtId] ?? {
        active: selectedCourt.active,
        days: selectedCourt.days.map(d => ({ ...d })),
      };
      return {
        ...prev,
        [selectedCourtId]: {
          ...base,
          days: base.days.map((d, i) => i === idx ? { ...d, [field]: value } : d),
        },
      };
    });
  };

  const handleSave = async () => {
    const confirm = await confirmSave();
    if (!confirm.isConfirmed) return;
    setSaving(true);
    try {
      await Promise.all(
        Object.entries(scheduleChanges).map(([cId, data]) => updateCourtSchedule(cId, data))
      );
      setScheduleChanges({});
      await loadData();
      await successAlert('Horarios guardados correctamente.');
    } catch (err) {
      await errorAlert(err?.response?.data?.message || err?.message || 'Error al guardar los cambios.');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveBlock = async (form) => {
    const payload = {
      name: form.name,
      recurrence: form.recurrence,
      dayOfWeek: form.recurrence === 'weekly' ? form.dayOfWeek : null,
      date: form.recurrence === 'once' ? form.date : null,
      startTime: form.startTime,
      endTime: form.endTime,
      courtId: form.courtId || null,
    };
    try {
      if (editingBlock) {
        await updateBlockout(editingBlock._id, payload);
      } else {
        await createBlockout(payload);
      }
      setShowModal(false);
      setEditingBlock(null);
      await loadData();
      await successAlert(editingBlock ? 'Bloqueo actualizado correctamente.' : 'Bloqueo creado correctamente.');
    } catch (err) {
      if (err?.response?.status === 409 && err?.response?.data?.bookings?.length) {
        const reservas = err.response.data.bookings;
        const lista = reservas.map(b =>
          `<li style="margin-bottom:6px">📅 <strong>${b.date}</strong> · ${b.startTime}–${b.endTime} · ${b.court?.name || 'Cancha'} · ${b.player?.name || 'Sin jugador'}</li>`
        ).join('');
        await Swal.fire({
          background: '#1f2937',
          color: '#ffffff',
          icon: 'warning',
          title: 'No se puede bloquear',
          html: `<p style="margin-bottom:10px">Hay <strong>${reservas.length}</strong> reserva${reservas.length > 1 ? 's' : ''} en ese horario. Cancelalas primero.</p><ul style="text-align:left;padding-left:16px;max-height:200px;overflow-y:auto">${lista}</ul>`,
          confirmButtonColor: '#a3e635',
          confirmButtonText: 'Entendido',
        });
      } else {
        await errorAlert(err?.response?.data?.message || err?.message || 'Error al guardar el bloqueo.');
      }
    }
  };

  const handleOpenEdit = (block) => {
    setEditingBlock(block);
    setShowModal(true);
  };

  const handleOpenNew = () => {
    setEditingBlock(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingBlock(null);
  };

  const handleDeleteBlock = async (id, name) => {
    const result = await confirmDelete(`Se eliminará el bloqueo "${name}".`);
    if (!result.isConfirmed) return;
    try {
      await deleteBlockout(id);
      await loadData();
      await successAlert('Bloqueo eliminado correctamente.');
    } catch (err) {
      await errorAlert(err?.response?.data?.message || err?.message || 'Error al eliminar el bloqueo.');
    }
  };

  const courtBlockouts = blockouts.filter(
    b => !b.courtId || String(b.courtId) === String(selectedCourtId)
  );

  const weeklyHours  = calcWeeklyHours(courtSchedule.days);
  const blockedHours = calcBlockedHours(courtBlockouts);
  const efficiency   = weeklyHours > 0
    ? Math.round(((weeklyHours - blockedHours) / weeklyHours) * 100)
    : 0;

  if (loading) {
    return (
      <div className="sm-state">
        <Clock size={28} className="sm-spin" />
        <p>Cargando horarios...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="sm-state sm-state--error">
        <AlertTriangle size={24} />
        <p>{error}</p>
        <button className="sm-btn-save" onClick={loadData}>Reintentar</button>
      </div>
    );
  }

  return (
    <div className="sm-root">
      {/* Header */}
      <div className="sm-header">
        <div className="sm-header-text">
          <h1 className="sm-title">Gestión de Horarios</h1>
          <p className="sm-subtitle">Define la disponibilidad operativa y excepciones por cada pista.</p>
        </div>
        <div className="sm-online-box">
          <div className="sm-online-top">
            <span className="sm-online-label">Estado Online</span>
            <button
              className={`sm-toggle ${onlineStatus ? 'sm-toggle--on' : ''}`}
              onClick={() => setOnlineStatus(v => !v)}
            >
              <span className="sm-knob" />
            </button>
          </div>
          <span className="sm-online-sub">Habilitar reservas para el público</span>
        </div>
      </div>

      {/* Court tabs */}
      <div className="sm-tabs">
        {courts.map(c => (
          <button
            key={c.courtId}
            className={`sm-tab ${String(c.courtId) === String(selectedCourtId) ? 'sm-tab--active' : ''}`}
            onClick={() => setSelectedCourtId(c.courtId)}
          >
            {c.courtName}
            {scheduleChanges[c.courtId] && <span className="sm-tab-dot" />}
          </button>
        ))}
      </div>

      {selectedCourt && (
        <>
          {/* Two-column body */}
          <div className="sm-body">
            {/* Left: schedule */}
            <div className="sm-schedule-col">
              <div className="sm-section-header">
                <span className="sm-section-title">Disponibilidad Semanal</span>
                <span className="sm-section-note">
                  {complexHours.open && complexHours.close
                    ? `Horario del complejo: ${complexHours.open} – ${complexHours.close}`
                    : 'Los cambios afectarán a las próximas 4 semanas'}
                </span>
              </div>

              {courtSchedule.days.map((day, idx) => {
                const info = DAYS[idx];
                return (
                  <div key={day.day} className={`sm-day-card ${!day.active ? 'sm-day-card--off' : ''}`}>
                    <div className="sm-day-badge">{info.short}</div>
                    <div className="sm-day-name">{info.label}</div>

                    {day.active ? (
                      <>
                        <div className="sm-day-times">
                          <div className="sm-time-group">
                            <span className="sm-time-label">APERTURA</span>
                            <input
                              type="time"
                              className="sm-time-input"
                              value={day.openTime === '--' ? '' : day.openTime}
                              min={complexHours.open || undefined}
                              max={complexHours.close || undefined}
                              onChange={e => updateDay(idx, 'openTime', e.target.value)}
                            />
                          </div>
                          <div className="sm-time-group">
                            <span className="sm-time-label">CIERRE</span>
                            <input
                              type="time"
                              className="sm-time-input"
                              value={day.closeTime === '--' ? '' : day.closeTime}
                              min={complexHours.open || undefined}
                              max={complexHours.close || undefined}
                              onChange={e => updateDay(idx, 'closeTime', e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="sm-day-status">
                          <span className="sm-status-text sm-status-text--on">Activo</span>
                          <button
                            className="sm-toggle sm-toggle--on sm-toggle--sm"
                            onClick={() => updateDay(idx, 'active', false)}
                          >
                            <span className="sm-knob" />
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <span className="sm-closed-label">Cerrado</span>
                        <div className="sm-day-status">
                          <span className="sm-status-text">Inactivo</span>
                          <button
                            className="sm-toggle sm-toggle--sm"
                            onClick={() => updateDay(idx, 'active', true)}
                          >
                            <span className="sm-knob" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Right: blockouts */}
            <div className="sm-blocks-col">
              <div className="sm-blocks-head">
                <Clock size={16} className="sm-blocks-icon" />
                <span className="sm-blocks-title">Bloqueos &amp; Siestas</span>
              </div>
              <p className="sm-blocks-desc">
                Define franjas donde la pista no puede ser reservada (mantenimiento, clases fijas, etc.)
              </p>

              <div className="sm-block-list">
                {courtBlockouts.map(b => (
                  <div key={b._id} className="sm-block-item">
                    <div className="sm-block-info">
                      <span className="sm-block-name">{b.name}</span>
                      <span className="sm-block-meta">
                        {b.recurrence === 'daily' && `Todos los días · ${b.startTime}–${b.endTime}`}
                        {b.recurrence === 'weekly' && `Cada ${DAY_ES[b.dayOfWeek] ?? b.dayOfWeek} · ${b.startTime}–${b.endTime}`}
                        {b.recurrence === 'once' && `${fmtDate(b.date)} · ${b.startTime}–${b.endTime}`}
                      </span>
                    </div>
                    <div className="sm-block-actions">
                      <button className="sm-edit-btn" title="Editar" onClick={() => handleOpenEdit(b)}>
                        <Pencil size={14} />
                      </button>
                      <button className="sm-del-btn" title="Eliminar" onClick={() => handleDeleteBlock(b._id, b.name)}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button className="sm-add-block" onClick={handleOpenNew}>
                <Plus size={14} />
                Nuevo Bloqueo
              </button>
            </div>
          </div>

          {/* Save bar */}
          <div className={`sm-save-bar ${hasChanges ? 'sm-save-bar--active' : 'sm-save-bar--idle'}`}>
            <div className="sm-save-info">
              <span className="sm-save-title">
                {hasChanges ? 'Cambios detectados' : 'Todo guardado'}
              </span>
              {hasChanges && (
                <span className="sm-save-note">No has guardado tus ajustes recientes.</span>
              )}
            </div>
            <div className="sm-save-actions">
              <button
                className="sm-btn-discard"
                onClick={() => setScheduleChanges({})}
                disabled={!hasChanges}
              >
                Descartar
              </button>
              <button
                className="sm-btn-save"
                onClick={handleSave}
                disabled={!hasChanges || saving}
              >
                {saving ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </div>

          {/* Metrics */}
          <div className="sm-metrics">
            <span>Horas semanales: <strong>{Math.round(weeklyHours)}h</strong></span>
            <span>Tiempo bloqueado: <strong>{Math.round(blockedHours)}h</strong></span>
            <span>Eficiencia de disponibilidad: <strong>{efficiency}%</strong></span>
          </div>
        </>
      )}

      {courts.length === 0 && (
        <div className="sm-state">
          <p>No hay canchas registradas para este complejo.</p>
        </div>
      )}

      <BlockModal
        isOpen={showModal}
        onClose={handleCloseModal}
        onSave={handleSaveBlock}
        courts={courts}
        editingBlock={editingBlock}
        complexHours={complexHours}
      />
    </div>
  );
};
