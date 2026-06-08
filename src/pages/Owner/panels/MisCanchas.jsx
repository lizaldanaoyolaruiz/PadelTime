import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { getMisCanchas, createCancha, updateCancha, deleteCancha } from '../../../services/ownerService';
import './MisCanchas.css';

const schema = z.object({
  nombre:           z.string().min(2, 'Mínimo 2 caracteres'),
  tipo_superficie:  z.string().min(1, 'Seleccioná una superficie'),
  precio_hora:      z.coerce.number({ invalid_type_error: 'Ingresá un precio' }).positive('Debe ser mayor a 0'),
  descripcion:      z.string().optional(),
});

const SUPERFICIES = [
  { value: 'cristal',  label: 'Cristal Pro' },
  { value: 'cesped',   label: 'Césped Sintético' },
  { value: 'hormigon', label: 'Hormigón' },
  { value: 'outdoor',  label: 'Outdoor' },
  { value: 'otro',     label: 'Otro' },
];

function CanchaModal({ cancha, onClose, onSave }) {
  const isEdit = Boolean(cancha?.id);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: cancha
      ? { nombre: cancha.nombre, tipo_superficie: cancha.tipo_superficie, precio_hora: cancha.precio_hora, descripcion: cancha.descripcion || '' }
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
              className={`form-input${errors.nombre ? ' input-error' : ''}`}
              placeholder="Ej: Cancha 1 — Cristal Pro"
              {...register('nombre')}
            />
            {errors.nombre && <span className="error-msg">{errors.nombre.message}</span>}
          </div>

          <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <div className="form-group">
              <label className="form-label">Superficie</label>
              <select className={`form-input form-select${errors.tipo_superficie ? ' input-error' : ''}`} {...register('tipo_superficie')}>
                <option value="">Seleccioná...</option>
                {SUPERFICIES.map(s => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
              {errors.tipo_superficie && <span className="error-msg">{errors.tipo_superficie.message}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Precio por hora ($)</label>
              <input
                type="number"
                min="0"
                step="100"
                className={`form-input${errors.precio_hora ? ' input-error' : ''}`}
                placeholder="Ej: 3000"
                {...register('precio_hora')}
              />
              {errors.precio_hora && <span className="error-msg">{errors.precio_hora.message}</span>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Descripción <span style={{ color: 'var(--color-text-muted)', fontWeight: 400, fontSize: 'var(--text-xs)' }}>(opcional)</span></label>
            <textarea
              className="form-input form-textarea"
              rows={2}
              placeholder="Ej: Cancha techada con iluminación LED..."
              {...register('descripcion')}
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

export default function MisCanchas() {
  const [canchas,     setCanchas]     = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [modal,       setModal]       = useState(null); // null | { cancha? }
  const [deletingId,  setDeletingId]  = useState(null);

  useEffect(() => {
    getMisCanchas()
      .then(setCanchas)
      .catch(() => toast.error('Error cargando las canchas'))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (data) => {
    try {
      if (modal?.cancha?.id) {
        const updated = await updateCancha(modal.cancha.id, data);
        setCanchas(prev => prev.map(c => c.id === updated.id ? updated : c));
        toast.success('Cancha actualizada');
      } else {
        const created = await createCancha(data);
        setCanchas(prev => [...prev, created]);
        toast.success('Cancha creada');
      }
      setModal(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al guardar');
    }
  };

  const toggleHabilitada = async (cancha) => {
    try {
      const updated = await updateCancha(cancha.id, { habilitada: !cancha.habilitada });
      setCanchas(prev => prev.map(c => c.id === updated.id ? updated : c));
    } catch {
      toast.error('Error actualizando estado');
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await deleteCancha(id);
      setCanchas(prev => prev.filter(c => c.id !== id));
      toast.success('Cancha eliminada');
    } catch {
      toast.error('Error eliminando la cancha');
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
            <div key={cancha.id} className={`cancha-card${!cancha.habilitada ? ' cancha-card--disabled' : ''}`}>
              <div className="cancha-info">
                <div className="cancha-name-row">
                  <span className="cancha-name">{cancha.nombre}</span>
                  <span className="cancha-superficie">{superficieLabel(cancha.tipo_superficie)}</span>
                  {!cancha.habilitada && <span className="status-badge status-inactivo" style={{ marginLeft: 8 }}>Deshabilitada</span>}
                </div>
                {cancha.descripcion && (
                  <p className="cancha-desc">{cancha.descripcion}</p>
                )}
                <span className="cancha-precio">${cancha.precio_hora?.toLocaleString('es-AR')} / hora</span>
              </div>

              <div className="cancha-actions">
                <label className="toggle-switch" title={cancha.habilitada ? 'Deshabilitar' : 'Habilitar'}>
                  <input
                    type="checkbox"
                    checked={cancha.habilitada ?? true}
                    onChange={() => toggleHabilitada(cancha)}
                  />
                  <span className="toggle-track" />
                </label>
                <button
                  className="icon-btn icon-btn--edit"
                  onClick={() => setModal({ cancha })}
                  title="Editar"
                >
                  <Pencil size={15} />
                </button>
                <button
                  className="icon-btn icon-btn--delete"
                  onClick={() => handleDelete(cancha.id)}
                  disabled={deletingId === cancha.id}
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
