import { useState, useEffect, useRef } from "react";
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
  PlayCircle,
  Star,
  Upload,
  ImagePlus,
} from "lucide-react";
import Swal from "sweetalert2";
import { StatusBadge } from "./StatusBadge";
import { ComplexAvatar } from "./ComplexAvatar";
import { formatDate } from "../utils/utils";
import {
  toggleFeatured,
  uploadComplexPhotos,
  deleteComplexPhoto,
  setComplexPrincipalPhoto,
} from "../../../services/complexService";

const MAX_PHOTOS = 5;

export function DetailDrawer({
  complex,
  onClose,
  onAction,
  onFeaturedToggle,
  onPhotosUpdate,
}) {
  const [featured, setFeatured] = useState(!!complex.isFeatured);
  const [loadingFeatured, setLoadingFeatured] = useState(false);

  const [images, setImages] = useState(complex.photos || []);
  const [principalUrl, setPrincipalUrl] = useState(
    complex.image || complex.photos?.[0] || null,
  );
  const [uploadingImg, setUploadingImg] = useState(false);
  const [deletingImgUrl, setDeletingImgUrl] = useState(null);
  const fileRef = useRef(null);

  useEffect(() => {
    setImages(complex.photos || []);
    setPrincipalUrl(complex.image || complex.photos?.[0] || null);
  }, [complex._id]);

  const notifyPhotos = (photos, image) => {
    onPhotosUpdate?.(complex._id, { photos, image });
  };

  const handleFiles = async (e) => {
    const files = Array.from(e.target.files);
    if (fileRef.current) fileRef.current.value = "";
    if (!files.length) return;

    if (images.length + files.length > MAX_PHOTOS) {
      Swal.fire({
        title: `Máximo ${MAX_PHOTOS} imágenes permitidas.`,
        icon: "warning",
        background: "#1E293B",
        color: "#F8FAFC",
        confirmButtonColor: "#BEF264",
      });
      return;
    }

    setUploadingImg(true);
    try {
      const res = await uploadComplexPhotos(complex._id, files);
      const updatedPhotos = res.data.photos || [];
      setImages(updatedPhotos);
      const nextPrincipal = principalUrl || updatedPhotos[0] || null;
      setPrincipalUrl(nextPrincipal);
      notifyPhotos(updatedPhotos, nextPrincipal);
    } catch {
      Swal.fire({
        title: "Error al subir las fotos.",
        text: "Intentá de nuevo.",
        icon: "error",
        background: "#1E293B",
        color: "#F8FAFC",
        confirmButtonColor: "#BEF264",
      });
    } finally {
      setUploadingImg(false);
    }
  };

  const handleRemoveImage = async (url) => {
    setDeletingImgUrl(url);
    try {
      await deleteComplexPhoto(complex._id, url);
      const next = images.filter((u) => u !== url);
      setImages(next);
      const nextPrincipal = principalUrl === url ? next[0] || null : principalUrl;
      setPrincipalUrl(nextPrincipal);
      notifyPhotos(next, nextPrincipal);
    } catch {
      Swal.fire({
        title: "Error al eliminar la foto.",
        icon: "error",
        background: "#1E293B",
        color: "#F8FAFC",
        confirmButtonColor: "#BEF264",
      });
    } finally {
      setDeletingImgUrl(null);
    }
  };

  const handleSetPrincipal = async (url) => {
    if (url === principalUrl) return;
    const prev = principalUrl;
    setPrincipalUrl(url);
    try {
      const res = await setComplexPrincipalPhoto(complex._id, url);
      const finalUrl = res.data.image || url;
      setPrincipalUrl(finalUrl);
      notifyPhotos(images, finalUrl);
    } catch {
      setPrincipalUrl(prev);
      Swal.fire({
        title: "Error al marcar como foto principal.",
        icon: "error",
        background: "#1E293B",
        color: "#F8FAFC",
        confirmButtonColor: "#BEF264",
      });
    }
  };

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
                <span className="gc-drawer-field-value">{complex.location}</span>
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
                  {formatDate(complex.createdAt)}
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
            <div className="gc-photos-grid">
              {images.map((url, i) => {
                const isPrincipal = principalUrl === url;
                return (
                  <div
                    key={url}
                    className={`gc-photo-thumb${isPrincipal ? " gc-photo-thumb--principal" : ""}`}
                  >
                    <img src={url} alt={`Foto ${i + 1}`} />
                    <button
                      type="button"
                      className="gc-photo-remove"
                      onClick={() => handleRemoveImage(url)}
                      title="Eliminar"
                      disabled={!!deletingImgUrl}
                    >
                      <X size={14} />
                    </button>
                    {isPrincipal ? (
                      <span className="gc-photo-badge">
                        <Star size={9} /> Principal
                      </span>
                    ) : (
                      <button
                        type="button"
                        className="gc-photo-set-principal"
                        onClick={() => handleSetPrincipal(url)}
                        title="Marcar como foto principal"
                      >
                        <Star size={12} />
                      </button>
                    )}
                  </div>
                );
              })}

              {images.length < MAX_PHOTOS && (
                <button
                  type="button"
                  className="gc-photo-add"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploadingImg}
                >
                  {uploadingImg ? (
                    <Upload size={22} className="gc-photo-spin" />
                  ) : (
                    <ImagePlus size={22} />
                  )}
                  <span>{uploadingImg ? "Subiendo..." : "Agregar foto"}</span>
                </button>
              )}

              {images.length === 0 && !uploadingImg && (
                <div className="gc-photos-empty-hint">
                  <Building2 size={20} />
                  <span>Todavía no hay fotos cargadas.</span>
                </div>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              style={{ display: "none" }}
              onChange={handleFiles}
            />
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
          {complex.status === "suspended" && (
            <>
              <button
                className="gc-drawer-action-btn gc-drawer-action-btn--approve"
                onClick={() => onAction("approve", complex)}
              >
                <PlayCircle size={15} /> Reactivar
              </button>
              <button
                className="gc-drawer-action-btn gc-drawer-action-btn--reject"
                onClick={() => onAction("reject", complex)}
              >
                <XCircle size={15} /> Rechazar
              </button>
            </>
          )}
          {complex.status === "rejected" && (
            <button
              className="gc-drawer-action-btn gc-drawer-action-btn--approve"
              onClick={() => onAction("approve", complex)}
            >
              <PlayCircle size={15} /> Reactivar
            </button>
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
