import { useState } from "react";
import {
  X,
  MapPin,
  Calendar,
  Users,
  Mail,
  Phone,
  Building2,
  CheckCircle,
  XCircle,
  PauseCircle,
  Star,
} from "lucide-react";
import Swal from "sweetalert2";
import { StatusBadge } from "./StatusBadge";
import { ComplexAvatar } from "./ComplexAvatar";
import { formatDate } from "../utils/utils";
import { toggleFeatured } from "../../../services/complexService";

export function DetailDrawer({ complex, onClose, onAction, onFeaturedToggle }) {
  const [featured, setFeatured] = useState(!!complex.isFeatured);
  const [loadingFeatured, setLoadingFeatured] = useState(false);

  const handleFeatured = async () => {
    if (featured) {
      const result = await Swal.fire({
        title: "¿Quitar destacado?",
        text: `"${complex.name}" dejará de aparecer como complejo destacado en la página principal.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, quitar",
        cancelButtonText: "Cancelar",
        background: "#1E293B",
        color: "#F8FAFC",
        iconColor: "#F59E0B",
        confirmButtonColor: "#BEF264",
        cancelButtonColor: "#334155",
        customClass: {
          confirmButton: "swal-confirm-dark",
          cancelButton: "swal-cancel-dark",
        },
      });
      if (!result.isConfirmed) return;
    }

    try {
      setLoadingFeatured(true);
      const res = await toggleFeatured(complex._id);
      const next = res.data.isFeatured;
      setFeatured(next);
      onFeaturedToggle?.(complex._id, next);
    } catch (err) {
      console.error("Error al cambiar destacado:", err);
    } finally {
      setLoadingFeatured(false);
    }
  };

  return (
    <>
      <div className="gc-overlay" onClick={onClose} aria-hidden="true" />
      <aside
        className="gc-drawer"
        role="dialog"
        aria-label="Detalle del complejo"
      >
        <div className="gc-drawer-header">
          <div className="gc-drawer-title-row">
            <ComplexAvatar name={complex.name} />
            <div>
              <h3 className="gc-drawer-name">{complex.name}</h3>
              <StatusBadge status={complex.status} />
            </div>
          </div>
          <button
            className="gc-drawer-close"
            onClick={onClose}
            aria-label="Cerrar"
          >
            <X size={20} />
          </button>
        </div>

        <div className="gc-drawer-body">
          <div className="gc-drawer-section">
            <h4 className="gc-drawer-section-title">
              Información del Complejo
            </h4>
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
                <span className="gc-drawer-field-label">
                  <MapPin size={12} /> Dirección
                </span>
                <span className="gc-drawer-field-value">{complex.address}</span>
              </div>
              <div className="gc-drawer-field">
                <span className="gc-drawer-field-label">Ciudad</span>
                <span className="gc-drawer-field-value">{complex.city}</span>
              </div>
              <div className="gc-drawer-field">
                <span className="gc-drawer-field-label">Provincia</span>
                <span className="gc-drawer-field-value">
                  {complex.province}
                </span>
              </div>
              <div className="gc-drawer-field">
                <span className="gc-drawer-field-label">
                  <Calendar size={12} /> Fecha Registro
                </span>
                <span className="gc-drawer-field-value">
                  {formatDate(complex.registeredAt)}
                </span>
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
                <span className="gc-drawer-field-label">
                  <Users size={12} /> Nombre
                </span>
                <span className="gc-drawer-field-value">
                  {complex.owner?.name}
                </span>
              </div>
              <div className="gc-drawer-field">
                <span className="gc-drawer-field-label">
                  <Mail size={12} /> Email
                </span>
                <span className="gc-drawer-field-value">
                  {complex.owner?.email}
                </span>
              </div>
              <div className="gc-drawer-field">
                <span className="gc-drawer-field-label">
                  <Phone size={12} /> Teléfono
                </span>
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
              <span>
                Las fotos estarán disponibles una vez conectado al backend.
              </span>
            </div>
          </div>
        </div>

        <div className="gc-drawer-footer">
          {complex.status === "pending" && (
            <>
              <button
                className="gc-drawer-action-btn gc-drawer-action-btn--approve"
                onClick={() => onAction("approve", complex)}
              >
                <CheckCircle size={15} /> Aprobar
              </button>
              <button
                className="gc-drawer-action-btn gc-drawer-action-btn--reject"
                onClick={() => onAction("reject", complex)}
              >
                <XCircle size={15} /> Rechazar
              </button>
            </>
          )}
          {complex.status === "approved" && (
            <>
              <button
                className="gc-drawer-action-btn gc-drawer-action-btn--suspend"
                onClick={() => onAction("suspend", complex)}
              >
                <PauseCircle size={15} /> Suspender
              </button>
              <button
                className="gc-drawer-action-btn"
                style={{
                  color: featured ? "#facc15" : undefined,
                  borderColor: featured ? "#facc15" : undefined,
                }}
                onClick={handleFeatured}
                disabled={loadingFeatured}
              >
                <Star size={15} fill={featured ? "#facc15" : "none"} />
                {featured ? "Quitar destacado" : "Marcar destacado"}
              </button>
            </>
          )}
          <button
            className="gc-drawer-action-btn gc-drawer-action-btn--close"
            onClick={onClose}
          >
            Cerrar
          </button>
        </div>
      </aside>
    </>
  );
}
