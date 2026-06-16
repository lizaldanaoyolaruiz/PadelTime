import { Eye, CheckCircle, XCircle, PauseCircle, Pencil, Trash2, Users, Calendar, MapPin } from 'lucide-react';
import { StatusBadge }       from './StatusBadge';
import { ComplexAvatar }     from './ComplexAvatar';
import { SkeletonMobileCard } from './Skeletons';
import { EmptyState }         from './EmptyState';
import { formatDate }         from '../utils/utils';

export function ComplexMobileList({ filtered, loading, onDetail, onAction }) {
  if (loading) {
    return (
      <div className="gc-mobile-list">
        {[...Array(4)].map((_, i) => <SkeletonMobileCard key={i} />)}
      </div>
    );
  }

  if (filtered.length === 0) {
    return <div className="gc-mobile-list"><EmptyState /></div>;
  }

  return (
    <div className="gc-mobile-list">
      {filtered.map(complex => (
        <div
          key={complex._id}
          className="gc-mobile-card"
          onClick={() => onDetail(complex)}
        >
          <div className="gc-mobile-card-top">
            <ComplexAvatar name={complex.name} />
            <div className="gc-mobile-card-info">
              <span className="gc-mobile-card-name">{complex.name}</span>
              <span className="gc-mobile-card-location">
                <MapPin size={11} /> {complex.city}, {complex.province}
              </span>
            </div>
            <StatusBadge status={complex.status} />
          </div>
          <div className="gc-mobile-card-meta">
            <span><Users size={11} /> {complex.owner?.name}</span>
            <span><Calendar size={11} /> {formatDate(complex.registeredAt)}</span>
          </div>
          <div className="gc-mobile-card-actions" onClick={e => e.stopPropagation()}>
            <button className="gc-action-btn gc-action-btn--view" onClick={() => onDetail(complex)}>
              <Eye size={13} /> Ver
            </button>
            {complex.status === 'pending' && (
              <>
                <button className="gc-action-btn gc-action-btn--approve" onClick={() => onAction('approve', complex)}>
                  <CheckCircle size={13} /> Aprobar
                </button>
                <button className="gc-action-btn gc-action-btn--reject" onClick={() => onAction('reject', complex)}>
                  <XCircle size={13} /> Rechazar
                </button>
              </>
            )}
            {complex.status === 'approved' && (
              <button className="gc-action-btn gc-action-btn--suspend" onClick={() => onAction('suspend', complex)}>
                <PauseCircle size={13} /> Suspender
              </button>
            )}
            <button className="gc-action-btn gc-action-btn--edit" onClick={() => onAction('edit', complex)}>
              <Pencil size={13} /> Editar
            </button>
            <button className="gc-action-btn gc-action-btn--delete" onClick={() => onAction('delete', complex)}>
              <Trash2 size={13} /> Eliminar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
