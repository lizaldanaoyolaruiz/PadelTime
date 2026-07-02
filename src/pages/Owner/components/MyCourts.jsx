import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import {
  getMyCourts,
  createCourt,
  updateCourt,
  deleteCourt,
  uploadCourtPhotos,
  setCourtPrincipalPhoto,
} from "../../../services/courtService";
import { getMyComplex } from "../../../services/complexService";
import {
  confirmDelete,
  confirmDisable,
  successAlert,
  errorAlert,
} from "../../../utils/alerts";
import { SUPERFICIES } from "../utils/constants";
import CourtModal from "./CourtModal";
import "./MyCourts.css";

export default function MyCourts() {
  const [canchas, setCanchas] = useState([]);
  const [complexId, setComplexId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    getMyComplex()
      .then((res) => {
        const id = res.data.complex?._id || res.data._id;
        setComplexId(id);
        return getMyCourts(id);
      })
      .then((res) => setCanchas(res.data.courts || res.data))
      .catch((err) => {
        const status = err.response?.status;
        if (status && ![404, 401, 403].includes(status))
          errorAlert("Error cargando las canchas.");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (data, newFiles, principalUrl, currentImages) => {
    try {
      if (modal?.cancha?._id) {
        const courtId = modal.cancha._id;
        const res = await updateCourt(courtId, { ...data, complexId });
        let updated = res.data.court || res.data;

        if (principalUrl && principalUrl !== (modal.cancha.photo || null)) {
          await setCourtPrincipalPhoto(courtId, principalUrl);
        }

        updated = {
          ...updated,
          photos: currentImages,
          photo: principalUrl || updated.photo,
        };
        setCanchas((prev) =>
          prev.map((c) => (c._id === updated._id ? updated : c)),
        );
        setModal(null);
        await successAlert("Cancha actualizada correctamente.");
      } else {
        const res = await createCourt({ ...data, complexId });
        let created = res.data.court || res.data;

        if (newFiles?.length) {
          const uploadRes = await uploadCourtPhotos(created._id, newFiles);
          created = {
            ...created,
            photos: uploadRes.data.photos,
            photo: uploadRes.data.photo,
          };
        }

        setCanchas((prev) => [...prev, created]);
        setModal(null);
        await successAlert("Cancha creada correctamente.");
      }
    } catch (err) {
      await errorAlert(
        err.response?.data?.message || "Error al guardar la cancha.",
      );
    }
  };

  const toggleHabilitada = async (cancha) => {
    if (cancha.enabled) {
      const result = await confirmDisable();
      if (!result.isConfirmed) return;
    }
    try {
      const res = await updateCourt(
        cancha._id,
        { enabled: !cancha.enabled },
        null,
      );
      const updated = res.data.court || res.data;
      setCanchas((prev) =>
        prev.map((c) => (c._id === updated._id ? updated : c)),
      );
    } catch {
      await errorAlert("Error actualizando el estado de la cancha.");
    }
  };

  const handleDelete = async (id) => {
    const result = await confirmDelete(
      "La cancha se eliminará permanentemente.",
    );
    if (!result.isConfirmed) return;
    setDeletingId(id);
    try {
      await deleteCourt(id);
      setCanchas((prev) => prev.filter((c) => c._id !== id));
      await successAlert("Cancha eliminada.");
    } catch {
      await errorAlert("Error eliminando la cancha.");
    } finally {
      setDeletingId(null);
    }
  };

  const superficieLabel = (val) =>
    SUPERFICIES.find((s) => s.value === val)?.label ?? val;

  if (loading) return <div className="panel-loading">Cargando canchas...</div>;

  return (
    <div className="panel-wrap">
      <div className="panel-header">
        <div>
          <h2>Mis Canchas</h2>
          <p className="panel-subtitle">
            Gestioná las canchas de tu complejo. Las deshabilitadas no aparecen
            en el portal público.
          </p>
        </div>
        <button className="btn-primary" onClick={() => setModal({})}>
          <Plus size={16} style={{ marginRight: 6 }} />
          Nueva cancha
        </button>
      </div>

      {canchas.length === 0 ? (
        <div className="canchas-empty">
          <p>Todavía no tenés canchas configuradas.</p>
          <button className="btn-primary" onClick={() => setModal({})}>
            Crear primera cancha
          </button>
        </div>
      ) : (
        <div className="canchas-list">
          {canchas.map((cancha) => (
            <div
              key={cancha._id}
              className={`cancha-card${!cancha.enabled ? " cancha-card--disabled" : ""}`}
            >
              {(cancha.photos?.[0] || cancha.photo) && (
                <img
                  src={cancha.photos?.[0] || cancha.photo}
                  alt={cancha.name}
                  className="cancha-thumb"
                />
              )}
              <div className="cancha-info">
                <div className="cancha-name-row">
                  <span className="cancha-name">{cancha.name}</span>
                  <span className="cancha-superficie">
                    {superficieLabel(cancha.type)}
                  </span>
                  {!cancha.enabled && (
                    <span
                      className="status-badge status-inactivo"
                      style={{ marginLeft: 4 }}
                    >
                      Deshabilitada
                    </span>
                  )}
                </div>
                {cancha.description && (
                  <p className="cancha-desc">{cancha.description}</p>
                )}
                <span className="cancha-precio">
                  ${cancha.pricePerHour?.toLocaleString("es-AR")} / hora
                </span>
              </div>

              <div className="cancha-actions">
                <label
                  className="toggle-switch"
                  title={cancha.enabled ? "Deshabilitar" : "Habilitar"}
                >
                  <input
                    type="checkbox"
                    checked={cancha.enabled ?? true}
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
        <CourtModal
          cancha={modal.cancha}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
