import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { getPublicCourtById } from "../../services/courtService";
import "./CourtDetail.css";

const TYPE_LABELS = { crystal: "Cristal", panoramic: "Panorámica" };

const DAYS_ES = [
  { key: "monday", label: "Lunes", short: "Lun" },
  { key: "tuesday", label: "Martes", short: "Mar" },
  { key: "wednesday", label: "Miércoles", short: "Mié" },
  { key: "thursday", label: "Jueves", short: "Jue" },
  { key: "friday", label: "Viernes", short: "Vie" },
  { key: "saturday", label: "Sábado", short: "Sáb" },
  { key: "sunday", label: "Domingo", short: "Dom" },
];

function ScheduleGrid({ schedule }) {
  if (!schedule) return null;
  const activeDays = DAYS_ES.filter((d) => schedule[d.key]?.enabled);
  if (!activeDays.length) return null;
  return (
    <div className="cd-info-card cd-schedule-card">
      <h3>Horarios disponibles</h3>
      <div className="cd-schedule-grid">
        {DAYS_ES.map((d) => {
          const day = schedule[d.key];
          const on = day?.enabled;
          return (
            <div
              key={d.key}
              className={`cd-sched-day${on ? "" : " cd-sched-day--off"}`}
            >
              <span className="cd-sched-label">{d.short}</span>
              {on ? (
                <span className="cd-sched-time">
                  {day.start} – {day.end}
                </span>
              ) : (
                <span className="cd-sched-closed">Cerrado</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const CourtDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [cancha, setCancha] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);
    getPublicCourtById(id)
      .then((res) => setCancha(res.data.court || res.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return <div className="cd-loading">Cargando detalles de la cancha...</div>;
  if (error || !cancha)
    return <div className="cd-loading">Cancha no encontrada.</div>;

  const LOGO_URL =
    "https://res.cloudinary.com/dabikk5ei/image/upload/padeltime/assets/logo_white.png";
  const heroImg = cancha.photo || cancha.photos?.[0] || null;
  const gallery = cancha.photos?.length
    ? cancha.photos
    : cancha.photo
      ? [cancha.photo]
      : [];
  const features = cancha.features?.filter(Boolean) || [];

  return (
    <div className="cd-page-wrapper">
      <Navbar />

      <div
        className={`cd-hero${!heroImg ? " cd-hero--no-img" : ""}`}
        style={{
          backgroundImage: `url(${heroImg || LOGO_URL})`,
          backgroundSize: heroImg ? "cover" : "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      >
        <div className="cd-hero-overlay" />
        <div className="cd-hero-content">
          <h1 className="cd-title">{cancha.name}</h1>
          <div className="cd-subtitle-row">
            <span className="cd-status">
              {cancha.enabled ? "✓ Habilitada" : "✗ Deshabilitada"}
            </span>
            {cancha.type && (
              <span style={{ color: "#cbd5e1" }}>
                {TYPE_LABELS[cancha.type] || cancha.type}
              </span>
            )}
          </div>
        </div>
      </div>

      <main className="cd-main-container">
        <div className="cd-content-full">
          <div className="cd-specs-grid">
            <div className="cd-spec-card">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="#bef264"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                width="24"
                height="24"
              >
                <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                <polyline points="2 17 12 22 22 17"></polyline>
                <polyline points="2 12 12 17 22 12"></polyline>
              </svg>
              <span className="cd-spec-label">SUPERFICIE</span>
              <span className="cd-spec-value">
                {TYPE_LABELS[cancha.type] || cancha.type || "—"}
              </span>
            </div>
            <div className="cd-spec-card">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="#bef264"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                width="24"
                height="24"
              >
                <line x1="12" y1="1" x2="12" y2="23"></line>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              </svg>
              <span className="cd-spec-label">PRECIO / HORA</span>
              <span className="cd-spec-value">
                {(() => {
                  const precio =
                    cancha.pricePerHour || cancha.complex?.price || 0;
                  return precio
                    ? `$${Number(precio).toLocaleString("es-AR")}`
                    : "—";
                })()}
              </span>
            </div>
            <div className="cd-spec-card">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="#bef264"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                width="24"
                height="24"
              >
                <path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path>
                <path d="M22 12A10 10 0 0 0 12 2v10z"></path>
              </svg>
              <span className="cd-spec-label">ESTADO</span>
              <span className="cd-spec-value">
                {cancha.enabled ? "Habilitada" : "Deshabilitada"}
              </span>
            </div>
            <div className="cd-spec-card">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="#bef264"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                width="24"
                height="24"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="3" y1="9" x2="21" y2="9"></line>
                <line x1="9" y1="21" x2="9" y2="9"></line>
              </svg>
              <span className="cd-spec-label">FOTOS</span>
              <span className="cd-spec-value">{gallery.length}</span>
            </div>
          </div>

          {(cancha.description || features.length > 0) && (
            <div
              className={`cd-info-row${cancha.description && features.length === 0 ? " cd-info-row--single" : ""}`}
            >
              {cancha.description && (
                <div className="cd-info-card">
                  <h3>Descripción</h3>
                  <p>{cancha.description}</p>
                </div>
              )}
              {features.length > 0 && (
                <div className="cd-info-card">
                  <h3>Características</h3>
                  <ul className="cd-services-list">
                    {features.map((f, i) => (
                      <li key={i}>
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#bef264"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          width="16"
                          height="16"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          <ScheduleGrid schedule={cancha.schedule} />
        </div>

        {gallery.length > 0 && (
          <section className="cd-gallery-section">
            <h2>Galería de la Cancha</h2>
            <div
              className={`cd-gallery-grid cd-gallery-grid--${Math.min(gallery.length, 5)}`}
            >
              {gallery.slice(0, 5).map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`${cancha.name} — vista ${index + 1}`}
                  className={`cd-gallery-img img-${index}`}
                />
              ))}
            </div>
          </section>
        )}

        <div className="cd-action-bottom" style={{ marginBottom: "4rem" }}>
          <button
            className="cd-btn-play"
            onClick={() =>
              navigate(`/complejo/${cancha.complex?._id || cancha.complex}`)
            }
          >
            JUGAR EN ESTA CANCHA
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CourtDetail;
