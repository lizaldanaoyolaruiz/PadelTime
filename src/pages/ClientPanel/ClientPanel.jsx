import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronRight,
  LogOut,
  Pencil,
  Trash2,
  X,
  Calendar,
  Clock,
  Camera,
} from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import useAuthStore from "../../store/authStore";
import api from "../../services/axios";
import Swal from "sweetalert2";
import { confirmLogout } from "../../utils/alerts";
import "./ClientPanel.css";

const STATUS_MAP = {
  pending: { label: "Pendiente", cls: "pendiente" },
  confirmed: { label: "Confirmado", cls: "confirmado" },
  rejected: { label: "Rechazado", cls: "rechazado" },
  cancelled: { label: "Cancelado", cls: "cancelado" },
  completed: { label: "Finalizado", cls: "finalizado" },
};

const fmt = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr + "T00:00:00").toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const getCountdown = (date, startTime) => {
  if (!date || !startTime) return null;
  const target = new Date(`${date}T${startTime}:00`);
  const diff = target - Date.now();
  if (diff <= 0) return null;
  const totalMins = Math.floor(diff / 60000);
  return { hours: Math.floor(totalMins / 60), mins: totalMins % 60 };
};

const getInitials = (name = "") =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

// ── Component ─────────────────────────────────────────────────────────────────

export default function ClientPanel() {
  const { user, logout, setAuth } = useAuthStore();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favoritos, setFavoritos] = useState([]);
  const [favLoading, setFavLoading] = useState(false);
  const [tab, setTab] = useState("reservas");
  const [filter, setFilter] = useState("todos");

  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [formErr, setFormErr] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);

  // Booking edit modal
  const [editingBooking, setEditingBooking] = useState(null);
  const [bookingForm, setBookingForm] = useState({
    date: "",
    startTime: "",
    endTime: "",
  });
  const [bookingErr, setBookingErr] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);

  const fileInputRef = useRef(null);

  // ── Fetch ───────────────────────────────────────────────────────────────────

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/bookings");
      setBookings(res.data.bookings || []);
    } catch (err) {
      console.error("Error cargando reservas:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchFavoritos = useCallback(async () => {
    try {
      setFavLoading(true);
      const res = await api.get("/favorites");
      setFavoritos(res.data.favoritos || []);
    } catch (err) {
      console.error("Error cargando favoritos:", err);
    } finally {
      setFavLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  useEffect(() => {
    const handleVisibility = () => {
      if (!document.hidden) fetchBookings();
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, [fetchBookings]);

  useEffect(() => {
    if (tab === "favoritos") fetchFavoritos();
  }, [tab, fetchFavoritos]);

  const today = new Date().toISOString().split("T")[0];

  const nextMatch =
    bookings
      .filter(
        (b) => b.date >= today && ["pending", "confirmed"].includes(b.status),
      )
      .sort(
        (a, b) =>
          a.date.localeCompare(b.date) ||
          a.startTime.localeCompare(b.startTime),
      )[0] || null;

  const countdown = nextMatch
    ? getCountdown(nextMatch.date, nextMatch.startTime)
    : null;
  const totalPartidos = bookings.length;
  const victorias = bookings.filter((b) => b.status === "completed").length;

  const filtered =
    filter === "activos"
      ? bookings.filter((b) => ["pending", "confirmed"].includes(b.status))
      : bookings;

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setAvatarLoading(true);
      const formData = new FormData();
      formData.append("photo", file);
      const res = await api.post("/auth/me/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setAuth(res.data.user, localStorage.getItem("token"));
    } catch (err) {
      console.error("Error subiendo avatar:", err);
    } finally {
      setAvatarLoading(false);
      e.target.value = "";
    }
  };

  const openEdit = () => {
    setForm({
      name: user?.name || "",
      email: user?.email || "",
      password: "",
      confirmPassword: "",
    });
    setFormErr("");
    setModal("edit");
  };
  const closeModal = () => {
    setModal(null);
    setFormErr("");
  };

  const handleUpdate = async () => {
    if (!form.name || !form.email) {
      setFormErr("Nombre y email son obligatorios.");
      return;
    }
    if (form.password && form.password.length < 8) {
      setFormErr("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setFormErr("Las contraseñas no coinciden.");
      return;
    }

    const confirm = await Swal.fire({
      title: "¿Guardar cambios?",
      text: "Se actualizará tu información de perfil.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, guardar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#bef264",
      cancelButtonColor: "#334155",
      background: "#0e1c42",
      color: "#f8fafc",
    });
    if (!confirm.isConfirmed) return;

    try {
      setFormLoading(true);
      const payload = { name: form.name, email: form.email };
      if (form.password) payload.password = form.password;
      const res = await api.put("/auth/me", payload);
      const updated = res.data.user;
      setAuth(updated, localStorage.getItem("token"));
      closeModal();
      Swal.fire({
        title: "¡Actualizado!",
        text: "Tu perfil fue actualizado correctamente.",
        icon: "success",
        confirmButtonColor: "#bef264",
        background: "#0e1c42",
        color: "#f8fafc",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err) {
      setFormErr(
        err.response?.data?.message || "Error al actualizar el perfil.",
      );
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    const confirm = await Swal.fire({
      title: "¿Eliminar cuenta?",
      html: "Esta acción <strong>no se puede deshacer</strong>.<br/>Perderás todos tus datos permanentemente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#334155",
      background: "#0e1c42",
      color: "#f8fafc",
    });
    if (!confirm.isConfirmed) return;

    try {
      setFormLoading(true);
      await api.delete("/auth/me");
      logout();
      navigate("/");
    } catch (err) {
      setFormErr(err.response?.data?.message || "Error al eliminar la cuenta.");
    } finally {
      setFormLoading(false);
    }
  };

  const openEditBooking = (b) => {
    setEditingBooking(b);
    setBookingForm({
      date: b.date,
      startTime: b.startTime,
      endTime: b.endTime,
    });
    setBookingErr("");
  };

  const closeEditBooking = () => {
    setEditingBooking(null);
    setBookingErr("");
  };

  const handleEditBooking = async () => {
    if (!bookingForm.date || !bookingForm.startTime || !bookingForm.endTime) {
      setBookingErr("Completá todos los campos.");
      return;
    }
    const confirm = await Swal.fire({
      title: "¿Modificar reserva?",
      text: "Se actualizará la fecha y horario de tu turno.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, modificar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#bef264",
      cancelButtonColor: "#334155",
      background: "#0e1c42",
      color: "#f8fafc",
    });
    if (!confirm.isConfirmed) return;

    try {
      setBookingLoading(true);
      const res = await api.patch(
        `/bookings/${editingBooking._id}`,
        bookingForm,
      );
      const updated = res.data.booking;
      setBookings((prev) =>
        prev.map((b) =>
          b._id === editingBooking._id ? { ...b, ...updated } : b,
        ),
      );
      closeEditBooking();
      Swal.fire({
        title: "¡Reserva modificada!",
        text: "Tu turno fue actualizado correctamente.",
        icon: "success",
        confirmButtonColor: "#bef264",
        background: "#0e1c42",
        color: "#f8fafc",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err) {
      setBookingErr(
        err.response?.data?.message || "Error al modificar la reserva.",
      );
    } finally {
      setBookingLoading(false);
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    const confirm = await Swal.fire({
      title: "¿Eliminar reserva?",
      text: "Se eliminará permanentemente del historial.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#334155",
      background: "#0e1c42",
      color: "#f8fafc",
    });
    if (!confirm.isConfirmed) return;

    try {
      await api.delete(`/bookings/${bookingId}`);
      setBookings((prev) => prev.filter((b) => b._id !== bookingId));
      Swal.fire({
        title: "Eliminada",
        text: "La reserva fue eliminada del historial.",
        icon: "success",
        confirmButtonColor: "#bef264",
        background: "#0e1c42",
        color: "#f8fafc",
        timer: 1800,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({
        title: "Error",
        text: err.response?.data?.message || "No se pudo eliminar la reserva.",
        icon: "error",
        confirmButtonColor: "#ef4444",
        background: "#0e1c42",
        color: "#f8fafc",
      });
    }
  };

  const handleCancelBooking = async (bookingId) => {
    const confirm = await Swal.fire({
      title: "¿Cancelar reserva?",
      text: "Se cancelará tu turno. Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, cancelar",
      cancelButtonText: "Volver",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#334155",
      background: "#0e1c42",
      color: "#f8fafc",
    });
    if (!confirm.isConfirmed) return;

    try {
      await api.patch(`/bookings/${bookingId}/cancel`);
      setBookings((prev) =>
        prev.map((b) =>
          b._id === bookingId ? { ...b, status: "cancelled" } : b,
        ),
      );
      Swal.fire({
        title: "Reserva cancelada",
        text: "Tu turno fue cancelado correctamente.",
        icon: "success",
        confirmButtonColor: "#bef264",
        background: "#0e1c42",
        color: "#f8fafc",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({
        title: "Error",
        text: err.response?.data?.message || "No se pudo cancelar la reserva.",
        icon: "error",
        confirmButtonColor: "#ef4444",
        background: "#0e1c42",
        color: "#f8fafc",
      });
    }
  };

  const handleRemoveFavorito = async (complexId, nombre) => {
    const confirm = await Swal.fire({
      title: "¿Quitar de favoritos?",
      text: `Se quitará "${nombre}" de tus favoritos.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, quitar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#334155",
      background: "#0e1c42",
      color: "#f8fafc",
    });
    if (!confirm.isConfirmed) return;

    try {
      await api.delete(`/favorites/${complexId}`);
      setFavoritos((prev) => prev.filter((f) => f._id !== complexId));
      Swal.fire({
        title: "Eliminado",
        text: `"${nombre}" fue quitado de tus favoritos.`,
        icon: "success",
        confirmButtonColor: "#bef264",
        background: "#0e1c42",
        color: "#f8fafc",
        timer: 1800,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error("Error quitando favorito:", err);
    }
  };

  const handleLogout = async () => {
    const result = await confirmLogout();
    if (!result.isConfirmed) return;
    logout();
    navigate("/");
  };

  return (
    <div className="cp-page">
      <Navbar />

      <div className="cp-layout">
        <aside className="cp-left">
          <div className="cp-card cp-profile">
            <div
              className="cp-avatar-wrap"
              onClick={() => fileInputRef.current?.click()}
              title="Cambiar foto de perfil"
            >
              {user?.avatar ? (
                <img src={user.avatar} alt="avatar" className="cp-avatar-img" />
              ) : (
                <div className="cp-avatar">{getInitials(user?.name)}</div>
              )}
              <div className="cp-avatar-overlay">
                {avatarLoading ? "..." : <Camera size={18} />}
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleAvatarChange}
            />
            <div className="cp-profile-info">
              <h2>{user?.name || "Usuario"}</h2>
              <p>Jugador · PadelTime</p>
            </div>
            <div className="cp-stats-row">
              <div className="cp-stat">
                <span>RESERVAS</span>
                <strong>{totalPartidos}</strong>
              </div>
            </div>
          </div>

          {nextMatch ? (
            <div className="cp-next-match">
              <div className="cp-next-tag-wrap">
                <span className="cp-next-tag">PRÓXIMO PARTIDO</span>
              </div>
              <h1>
                {fmt(nextMatch.date)}, {nextMatch.startTime}
              </h1>
              <p>
                {nextMatch.complex?.name || "—"} ·{" "}
                {nextMatch.court?.name || "—"}
              </p>
            </div>
          ) : (
            <div className="cp-next-match cp-next-empty">
              <span className="cp-next-tag">PRÓXIMO PARTIDO</span>
              <p className="cp-no-match">No tenés partidos próximos</p>
            </div>
          )}

          <div className="cp-card cp-settings">
            <h3>Configuración de Cuenta</h3>
            <ul>
              <li onClick={openEdit}>
                <span className="cp-li-icon">
                  <Pencil size={15} />
                </span>
                Editar Información
                <ChevronRight size={15} className="cp-chevron" />
              </li>
              <li
                className="cp-li-danger"
                onClick={() => {
                  setFormErr("");
                  setModal("delete");
                }}
              >
                <span className="cp-li-icon">
                  <Trash2 size={15} />
                </span>
                Eliminar Cuenta
                <ChevronRight size={15} className="cp-chevron" />
              </li>
              <li className="cp-li-logout" onClick={handleLogout}>
                <span className="cp-li-icon">
                  <LogOut size={15} />
                </span>
                Cerrar Sesión
              </li>
            </ul>
          </div>
        </aside>

        <main className="cp-right">
          <div className="cp-tabs">
            {[
              { id: "reservas", label: "Mis Reservas" },
              { id: "favoritos", label: "Mis Favoritos" },
            ].map((t) => (
              <button
                key={t.id}
                className={`cp-tab ${tab === t.id ? "active" : ""}`}
                onClick={() => setTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>

          {tab === "reservas" && (
            <>
              <div className="cp-section-head">
                <h2>Historial de Actividad</h2>
                <div className="cp-filters">
                  <button
                    className={`cp-filter-btn ${filter === "todos" ? "active" : ""}`}
                    onClick={() => setFilter("todos")}
                  >
                    Todos
                  </button>
                  <button
                    className={`cp-filter-btn ${filter === "activos" ? "active" : ""}`}
                    onClick={() => setFilter("activos")}
                  >
                    Activos
                  </button>
                </div>
              </div>

              {loading ? (
                <p className="cp-empty">Cargando reservas...</p>
              ) : filtered.length === 0 ? (
                <p className="cp-empty">No tenés reservas aún.</p>
              ) : (
                <div className="cp-bookings">
                  {filtered.map((b) => {
                    const st = STATUS_MAP[b.status] || {
                      label: b.status,
                      cls: "",
                    };
                    return (
                      <div key={b._id} className="cp-booking-card">
                        <div className="cp-booking-img">
                          {b.complex?.image ? (
                            <img src={b.complex.image} alt={b.complex?.name} />
                          ) : (
                            <div className="cp-img-placeholder" />
                          )}
                        </div>
                        <div className="cp-booking-info">
                          <h3>{b.complex?.name || "Complejo"}</h3>
                          <p>
                            <Calendar size={12} /> {fmt(b.date)}
                          </p>
                          <p>
                            <Clock size={12} /> {b.startTime} - {b.endTime}
                          </p>
                          {b.court?.name && (
                            <p className="cp-court">{b.court.name}</p>
                          )}
                        </div>
                        <div className="cp-booking-actions">
                          <span className={`cp-status ${st.cls}`}>
                            {st.label}
                          </span>

                          {["pending", "confirmed"].includes(b.status) && (
                            <button
                              className="cp-edit-btn"
                              onClick={() => openEditBooking(b)}
                            >
                              Editar
                            </button>
                          )}

                          {["pending", "confirmed"].includes(b.status) && (
                            <button
                              className="cp-cancel-btn"
                              onClick={() => handleCancelBooking(b._id)}
                            >
                              Cancelar
                            </button>
                          )}

                          {["cancelled", "rejected", "completed"].includes(
                            b.status,
                          ) && (
                            <button
                              className="cp-delete-btn"
                              onClick={() => handleDeleteBooking(b._id)}
                            >
                              Eliminar
                            </button>
                          )}

                          {["cancelled", "completed", "rejected"].includes(
                            b.status,
                          ) &&
                            b.complex?._id && (
                              <button
                                className="cp-rebook-btn"
                                onClick={() =>
                                  navigate(`/complejo/${b.complex._id}`)
                                }
                              >
                                Reservar de nuevo
                              </button>
                            )}

                          {b.status === "cancelled" && (
                            <span className="cp-reembolso">Reembolsado</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {tab === "favoritos" && (
            <>
              <div className="cp-section-head">
                <h2>Mis Favoritos</h2>
              </div>
              {favLoading ? (
                <p className="cp-empty">Cargando favoritos...</p>
              ) : favoritos.length === 0 ? (
                <p className="cp-empty">No tenés clubes guardados aún.</p>
              ) : (
                <div className="cp-favoritos">
                  {favoritos.map((club) => (
                    <div key={club._id} className="cp-fav-card">
                      <div className="cp-fav-img">
                        {club.image ? (
                          <img src={club.image} alt={club.name} />
                        ) : (
                          <div className="cp-img-placeholder" />
                        )}
                      </div>
                      <div className="cp-fav-info">
                        <h3>{club.name}</h3>
                        <p>{club.city || club.location || "—"}</p>
                        {club.ratingAverage > 0 && (
                          <p className="cp-fav-rating">
                            ★ {club.ratingAverage.toFixed(1)}
                          </p>
                        )}
                        {club.price > 0 && (
                          <p className="cp-fav-price">${club.price} / hora</p>
                        )}
                      </div>
                      <button
                        className="cp-fav-remove"
                        title="Quitar de favoritos"
                        onClick={() =>
                          handleRemoveFavorito(club._id, club.name)
                        }
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>

      <Footer />

      {editingBooking && (
        <div className="cp-overlay" onClick={closeEditBooking}>
          <div className="cp-modal" onClick={(e) => e.stopPropagation()}>
            <div className="cp-modal-head">
              <h3>Editar Reserva</h3>
              <button onClick={closeEditBooking}>
                <X size={17} />
              </button>
            </div>
            <div className="cp-modal-body">
              {bookingErr && <div className="cp-form-error">{bookingErr}</div>}
              <p className="cp-modal-hint">
                {editingBooking.complex?.name} · {editingBooking.court?.name}
              </p>
              <label>Nueva fecha</label>
              <input
                type="date"
                value={bookingForm.date}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) =>
                  setBookingForm((f) => ({ ...f, date: e.target.value }))
                }
              />
              <label>Hora de inicio</label>
              <select
                value={bookingForm.startTime}
                onChange={(e) =>
                  setBookingForm((f) => ({ ...f, startTime: e.target.value }))
                }
              >
                {Array.from({ length: 15 }, (_, i) => i + 8).map((h) => {
                  const val = `${String(h).padStart(2, "0")}:00`;
                  return (
                    <option key={h} value={val}>
                      {val}
                    </option>
                  );
                })}
              </select>
              <label>Hora de fin</label>
              <select
                value={bookingForm.endTime}
                onChange={(e) =>
                  setBookingForm((f) => ({ ...f, endTime: e.target.value }))
                }
              >
                {Array.from({ length: 15 }, (_, i) => i + 8).map((h) => {
                  const val = `${String(h).padStart(2, "0")}:00`;
                  return (
                    <option key={h} value={val}>
                      {val}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="cp-modal-foot">
              <button className="cp-btn-cancel" onClick={closeEditBooking}>
                Cancelar
              </button>
              <button
                className="cp-btn-primary"
                onClick={handleEditBooking}
                disabled={bookingLoading}
              >
                {bookingLoading ? "Guardando..." : "Guardar cambios"}
              </button>
            </div>
          </div>
        </div>
      )}

      {modal === "edit" && (
        <div className="cp-overlay" onClick={closeModal}>
          <div className="cp-modal" onClick={(e) => e.stopPropagation()}>
            <div className="cp-modal-head">
              <h3>Editar Información</h3>
              <button onClick={closeModal}>
                <X size={17} />
              </button>
            </div>
            <div className="cp-modal-body">
              {formErr && <div className="cp-form-error">{formErr}</div>}
              <label>Nombre</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="Tu nombre"
              />
              <label>Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm((f) => ({ ...f, email: e.target.value }))
                }
                placeholder="tu@email.com"
              />
              <label>Nueva contraseña (opcional)</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) =>
                  setForm((f) => ({ ...f, password: e.target.value }))
                }
                placeholder="Mínimo 8 caracteres"
              />
              <label>Confirmar nueva contraseña</label>
              <input
                type="password"
                value={form.confirmPassword}
                onChange={(e) =>
                  setForm((f) => ({ ...f, confirmPassword: e.target.value }))
                }
                placeholder="Repetí la contraseña"
                style={{
                  borderColor:
                    form.password &&
                    form.confirmPassword &&
                    form.password !== form.confirmPassword
                      ? "#f87171"
                      : undefined,
                }}
              />
            </div>
            <div className="cp-modal-foot">
              <button className="cp-btn-cancel" onClick={closeModal}>
                Cancelar
              </button>
              <button
                className="cp-btn-primary"
                onClick={handleUpdate}
                disabled={formLoading}
              >
                {formLoading ? "Guardando..." : "Guardar Cambios"}
              </button>
            </div>
          </div>
        </div>
      )}

      {modal === "delete" && (
        <div className="cp-overlay" onClick={closeModal}>
          <div
            className="cp-modal cp-modal--sm"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="cp-modal-head">
              <h3>Eliminar cuenta</h3>
              <button onClick={closeModal}>
                <X size={17} />
              </button>
            </div>
            <div className="cp-modal-body">
              {formErr && <div className="cp-form-error">{formErr}</div>}
              <p className="cp-delete-msg">
                ¿Estás seguro de que querés eliminar tu cuenta?
                <br />
                <strong>Esta acción no se puede deshacer.</strong>
              </p>
            </div>
            <div className="cp-modal-foot">
              <button className="cp-btn-cancel" onClick={closeModal}>
                Cancelar
              </button>
              <button
                className="cp-btn-danger"
                onClick={handleDelete}
                disabled={formLoading}
              >
                {formLoading ? "Eliminando..." : "Eliminar cuenta"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
