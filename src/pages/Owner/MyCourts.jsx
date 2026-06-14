import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { getMyCourts, createCourt, updateCourt, deleteCourt } from '../../api/courtApi';
import { getMyComplex } from '../../api/complexApi';
import { confirmDelete, confirmDisable, successAlert, errorAlert } from '../../utils/alerts';
import './MyCourts.css';

const schema = z.object({
  name:         z.string().min(2, 'Mínimo 2 caracteres'),
  type:         z.string().min(1, 'Seleccioná una superficie'),
  pricePerHour: z.coerce.number({ invalid_type_error: 'Ingresá un precio' }).positive('Debe ser mayor a 0'),
  description:  z.string().optional(),
});

const SUPERFICIES = [
  { value: 'crystal',   label: 'Cristal' },
  { value: 'panoramic', label: 'Panorámica' },
];

function CanchaModal({ cancha, onClose, onSave }) {
  const isEdit = Boolean(cancha?._id);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: cancha
      ? { name: cancha.name, type: cancha.type, pricePerHour: cancha.pricePerHour, description: cancha.description || '' }
      : {},
  });

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
              {...register('name')}
            />
            {errors.name && <span className="error-msg">{errors.name.message}</span>}
          </div>

          <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <div className="form-group">
              <label className="form-label">Superficie</label>
              <select className={`form-input form-select${errors.type ? ' input-error' : ''}`} {...register('type')}>
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
                {...register('pricePerHour')}
              />
              {errors.pricePerHour && <span className="error-msg">{errors.pricePerHour.message}</span>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Descripción <span style={{ color: 'var(--color-text-muted)', fontWeight: 400, fontSize: 'var(--text-xs)' }}>(opcional)</span></label>
            <textarea
              className="form-input form-textarea"
              rows={2}
              placeholder="Ej: Cancha techada con iluminación LED..."
              {...register('description')}
            />
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

export default function MyCourts() {
  const [canchas,    setCanchas]    = useState([]);
  const [complexId,  setComplexId]  = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [modal,      setModal]      = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    getMyComplex()
      .then(res => {
        const id = res.data.complex?._id || res.data._id;
        setComplexId(id);
        return getMyCourts(id);
      })
      .then(res => setCanchas(res.data.courts || res.data))
      .catch(() => toast.error('Error cargando las canchas'))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (data) => {
    try {
      if (modal?.cancha?._id) {
        const res = await updateCourt(modal.cancha._id, { ...data, complexId }, null);
        const updated = res.data.court || res.data;
        setCanchas(prev => prev.map(c => c._id === updated._id ? updated : c));
        setModal(null);
        await successAlert('Cancha actualizada correctamente.');
      } else {
        const res = await createCourt({ ...data, complexId }, null);
        const created = res.data.court || res.data;
        setCanchas(prev => [...prev, created]);
        setModal(null);
        await successAlert('Cancha creada correctamente.');
      }
    } catch (err) {
      await errorAlert(err.response?.data?.message || 'Error al guardar la cancha.');
    }
  };

  const toggleHabilitada = async (cancha) => {
    if (!cancha.isActive) {
      const result = await confirmDisable();
      if (!result.isConfirmed) return;
    }
    try {
      const res = await updateCourt(cancha._id, { isActive: !cancha.isActive }, null);
      const updated = res.data.court || res.data;
      setCanchas(prev => prev.map(c => c._id === updated._id ? updated : c));
    } catch {
      await errorAlert('Error actualizando el estado de la cancha.');
    }
  };

  const handleDelete = async (id) => {
    const result = await confirmDelete('La cancha se eliminará permanentemente.');
    if (!result.isConfirmed) return;
    setDeletingId(id);
    try {
      await deleteCourt(id);
      setCanchas(prev => prev.filter(c => c._id !== id));
      await successAlert('Cancha eliminada.');
    } catch {
      await errorAlert('Error eliminando la cancha.');
    } finally {
      setDeletingId(null);
    }
  };

  const superficieLabel = (val) => SUPERFICIES.find(s => s.value === val)?.label ?? val;

  if (loading) return <div className="panel-loading">Cargando canchas...</div>;

  return (
    <div className="panel-wrap">
      <div className="panel-header">
        <div>
          <h2>Mis Canchas</h2>
          <p className="panel-subtitle">Gestioná las canchas de tu complejo. Las deshabilitadas no aparecen en el portal público.</p>
        </div>
        <button className="btn-primary" onClick={() => setModal({})}>
          <Plus size={16} style={{ marginRight: 6 }} />
          Nueva cancha
        </button>
      </div>

      {canchas.length === 0 ? (
        <div className="canchas-empty">
          <p>Todavía no tenés canchas configuradas.</p>
          <button className="btn-primary" onClick={() => setModal({})}>Crear primera cancha</button>
        </div>
      ) : (
        <div className="canchas-list">
          {canchas.map(cancha => (
            <div key={cancha._id} className={`cancha-card${!cancha.isActive ? ' cancha-card--disabled' : ''}`}>
              <div className="cancha-info">
                <div className="cancha-name-row">
                  <span className="cancha-name">{cancha.name}</span>
                  <span className="cancha-superficie">{superficieLabel(cancha.type)}</span>
                  {!cancha.isActive && <span className="status-badge status-inactivo" style={{ marginLeft: 8 }}>Deshabilitada</span>}
                </div>
                {cancha.description && <p className="cancha-desc">{cancha.description}</p>}
                <span className="cancha-precio">${cancha.pricePerHour?.toLocaleString('es-AR')} / hora</span>
              </div>

              <div className="cancha-actions">
                <label className="toggle-switch" title={cancha.isActive ? 'Deshabilitar' : 'Habilitar'}>
                  <input
                    type="checkbox"
                    checked={cancha.isActive ?? true}
                    onChange={() => toggleHabilitada(cancha)}
                  />
                  <span className="toggle-track" />
                </label>
                <button className="icon-btn icon-btn--edit" onClick={() => setModal({ cancha })} title="Editar">
                  <Pencil size={15} />
                </button>
                <button
                  className="icon-btn icon-btn--delete"
                  onClick={() => handleDelete(cancha._id)}
                  disabled={deletingId === cancha._id}
                  title="Eliminar"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal !== null && (
        <CanchaModal
          cancha={modal.cancha}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
