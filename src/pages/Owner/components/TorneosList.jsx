import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Trophy, CalendarDays, MapPin, Users } from 'lucide-react';
import { getTorneos, createTorneo, updateTorneo, deleteTorneo } from '../../../services/torneosService';
import { confirmDelete, successAlert, errorAlert } from '../../../utils/alerts';
import { CATEGORIAS, ESTADOS } from '../utils/schemas/torneoSchema';
import TorneosForm from './TorneosForm';
import './Torneos.css';

const ESTADO_BADGE = {
  activo:     'torneo-badge--activo',
  finalizado: 'torneo-badge--finalizado',
  cancelado:  'torneo-badge--cancelado',
};

function fmtDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('es-ES', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

export default function TorneosList() {
  const [torneos,    setTorneos]    = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [modal,      setModal]      = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [filter,     setFilter]     = useState('todos');

  useEffect(() => { fetchTorneos(); }, []);

  const fetchTorneos = async () => {
    try {
      setLoading(true);
      const res = await getTorneos();
      setTorneos(res.data.torneos || res.data || []);
    } catch (err) {
      await errorAlert(err.response?.data?.message || 'Error cargando torneos.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (data) => {
    try {
      if (modal?.torneo?._id) {
        const res = await updateTorneo(modal.torneo._id, data);
        const updated = res.data.torneo || res.data;
        setTorneos(prev => prev.map(t => t._id === updated._id ? updated : t));
        setModal(null);
        await successAlert('Torneo actualizado correctamente.');
      } else {
        const res = await createTorneo(data);
        const created = res.data.torneo || res.data;
        setTorneos(prev => [...prev, created]);
        setModal(null);
        await successAlert('Torneo creado correctamente.');
      }
    } catch (err) {
      await errorAlert(err.response?.data?.message || 'Error al guardar el torneo.');
    }
  };

  const handleDelete = async (id) => {
    const result = await confirmDelete('El torneo se eliminará permanentemente.');
    if (!result.isConfirmed) return;
    setDeletingId(id);
    try {
      await deleteTorneo(id);
      setTorneos(prev => prev.filter(t => t._id !== id));
      await successAlert('Torneo eliminado.');
    } catch {
      await errorAlert('Error al eliminar el torneo.');
    } finally {
      setDeletingId(null);
    }
  };

  const catLabel = (v) => CATEGORIAS.find(c => c.value === v)?.label ?? v;

  const filtered = filter === 'todos'
    ? torneos
    : torneos.filter(t => t.estado === filter);

  if (loading) return <div className="panel-loading">Cargando torneos...</div>;

  return (
    <div className="panel-wrap">
      <div className="panel-header">
        <div>
          <h2>Torneos</h2>
          <p className="panel-subtitle">
            Gestioná los torneos del club. Los activos aparecen en el portal público.
          </p>
        </div>
        <button className="btn-primary" onClick={() => setModal({})}>
          <Plus size={16} style={{ marginRight: 6 }} />
          Nuevo torneo
        </button>
      </div>

      {/* Filtros */}
      <div className="torneos-filters">
        {[
          { key: 'todos',     label: 'Todos'     },
          { key: 'activo',    label: 'Activos'   },
          { key: 'finalizado',label: 'Finalizados'},
          { key: 'cancelado', label: 'Cancelados'},
        ].map(f => (
          <button
            key={f.key}
            className={`torneos-filter-btn${filter === f.key ? ' torneos-filter-btn--active' : ''}`}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
        <span className="torneos-count">
          {filtered.length} torneo{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Lista vacía */}
      {filtered.length === 0 ? (
        <div className="canchas-empty">
          <Trophy size={36} className="torneos-empty-icon" />
          <p>
            {filter === 'todos'
              ? 'Todavía no hay torneos creados.'
              : `No hay torneos con ese estado.`}
          </p>
          {filter === 'todos' && (
            <button className="btn-primary" onClick={() => setModal({})}>
              Crear primer torneo
            </button>
          )}
        </div>
      ) : (
        <div className="torneos-list">
          {filtered.map(torneo => (
            <div key={torneo._id} className="torneo-card">
              <div className="torneo-card-main">
                <div className="torneo-icon-wrap">
                  <Trophy size={18} />
                </div>
                <div className="torneo-info">
                  <div className="torneo-name-row">
                    <span className="torneo-name">{torneo.nombre}</span>
                    <span className={`torneo-badge ${ESTADO_BADGE[torneo.estado] || ''}`}>
                      {ESTADOS.find(e => e.value === torneo.estado)?.label || torneo.estado}
                    </span>
                    <span className="torneo-categoria">{catLabel(torneo.categoria)}</span>
                  </div>
                  <div className="torneo-meta">
                    <span className="torneo-meta-item">
                      <CalendarDays size={12} />
                      {fmtDate(torneo.fechaInicio)} → {fmtDate(torneo.fechaFin)}
                    </span>
                    <span className="torneo-meta-item">
                      <MapPin size={12} />
                      {torneo.ubicacion}
                    </span>
                    <span className="torneo-meta-item">
                      <Users size={12} />
                      Cupo: {torneo.cupoMaximo}
                    </span>
                  </div>
                  {torneo.descripcion && (
                    <p className="torneo-desc">{torneo.descripcion}</p>
                  )}
                </div>
              </div>
              <div className="torneo-actions">
                <button
                  className="icon-btn icon-btn--edit"
                  onClick={() => setModal({ torneo })}
                  title="Editar torneo"
                >
                  <Pencil size={15} />
                </button>
                <button
                  className="icon-btn icon-btn--delete"
                  onClick={() => handleDelete(torneo._id)}
                  disabled={deletingId === torneo._id}
                  title="Eliminar torneo"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal !== null && (
        <TorneosForm
          torneo={modal.torneo}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
