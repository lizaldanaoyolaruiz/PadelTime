import {
  X, MapPin, Calendar, Users, Mail, Phone, Building2,
  CheckCircle, XCircle, PauseCircle,
} from 'lucide-react';
import { StatusBadge }   from './StatusBadge';
import { ComplexAvatar } from './ComplexAvatar';
import { formatDate }    from '../utils/utils';

export function DetailDrawer({ complex, onClose, onAction }) {
  return (
    <>
      <div className="gc-overlay" onClick={onClose} aria-hidden="true" />
      <aside className="gc-drawer" role="dialog" aria-label="Detalle del complejo">
        <div className="gc-drawer-header">
          <div className="gc-drawer-title-row">
            <ComplexAvatar name={complex.name} />
            <div>
              <h3 className="gc-drawer-name">{complex.name}</h3>
              <StatusBadge status={complex.status} />
            </div>
          </div>
          <button className="gc-drawer-close" onClick={onClose} aria-label="Cerrar">
            <X size={20} />
          </button>
        </div>

        <div className="gc-drawer-body">
          <div className="gc-drawer-section">
            <h4 className="gc-drawer-section-title">Información del Complejo</h4>
            <div className="gc-drawer-grid">
              <div className="gc-drawer-field">
                <span className="gc-drawer-field-label">Nombre</span>
                <span className="gc-drawer-field-value">{complex.name}</span>
              </div>
              <div className="gc-drawer-field">
                <span className="gc-drawer-field-label">Pistas</span>
                <span className="gc-drawer-field-value">{complex.courts}</span>
              </div>
              <div className="gc-drawer-field gc-drawer-field--full">
                <span className="gc-drawer-field-label"><MapPin size={12} /> Dirección</span>
                <span className="gc-drawer-field-value">{complex.address}</span>
              </div>
              <div className="gc-drawer-field">
                <span className="gc-drawer-field-label">Ciudad</span>
                <span className="gc-drawer-field-value">{complex.city}</span>
              </div>
              <div className="gc-drawer-field">
                <span className="gc-drawer-field-label">Provincia</span>
                <span className="gc-drawer-field-value">{complex.province}</span>
              </div>
              <div className="gc-drawer-field">
                <span className="gc-drawer-field-label"><Calendar size={12} /> Fecha Registro</span>
                <span className="gc-drawer-field-value">{formatDate(complex.registeredAt)}</span>
              </div>
              <div className="gc-drawer-field">
                <span className="gc-drawer-field-label">Estado Actual</span>
                <StatusBadge status={complex.status} />
              </div>
            </div>
          </div>

          <div className="gc-drawer-section">
            <h4 className="gc-drawer-section-title">Datos del Owner</h4>
            <div className="gc-drawer-grid">
              <div className="gc-drawer-field">
                <span className="gc-drawer-field-label"><Users size={12} /> Nombre</span>
                <span className="gc-drawer-field-value">{complex.owner}</span>
              </div>
              <div className="gc-drawer-field">
                <span className="gc-drawer-field-label"><Mail size={12} /> Email</span>
                <span className="gc-drawer-field-value">{complex.email}</span>
              </div>
              <div className="gc-drawer-field">
                <span className="gc-drawer-field-label"><Phone size={12} /> Teléfono</span>
                <span className="gc-drawer-field-value">{complex.phone}</span>
              </div>
            </div>
          </div>

          {complex.observations && (
            <div className="gc-drawer-section">
              <h4 className="gc-drawer-section-title">Observaciones</h4>
              <p className="gc-drawer-observations">{complex.observations}</p>
            </div>
          )}

          <div className="gc-drawer-section">
            <h4 className="gc-drawer-section-title">Fotos del Complejo</h4>
            <div className="gc-photos-placeholder">
              <Building2 size={28} />
              <span>Las fotos estarán disponibles una vez conectado al backend.</span>
            </div>
          </div>
        </div>

        <div className="gc-drawer-footer">
          {complex.status === 'PENDING' && (
            <>
              <button
                className="gc-drawer-action-btn gc-drawer-action-btn--approve"
                onClick={() => onAction('approve', complex)}
              >
                <CheckCircle size={15} /> Aprobar
              </button>
              <button
                className="gc-drawer-action-btn gc-drawer-action-btn--reject"
                onClick={() => onAction('reject', complex)}
              >
                <XCircle size={15} /> Rechazar
              </button>
            </>
          )}
          {complex.status === 'APPROVED' && (
            <button
              className="gc-drawer-action-btn gc-drawer-action-btn--suspend"
              onClick={() => onAction('suspend', complex)}
            >
              <PauseCircle size={15} /> Suspender
            </button>
          )}
          <button className="gc-drawer-action-btn gc-drawer-action-btn--close" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </aside>
    </>
  );
}
