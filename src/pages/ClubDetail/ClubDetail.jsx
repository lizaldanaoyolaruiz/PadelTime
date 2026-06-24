import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ClubReviews from './ClubReviews';
import WeeklyCalendar from '../../components/WeeklyCalendar/WeeklyCalendar';
import { getPublicComplexById } from '../../services/complexService';
import { getPublicCourts } from '../../services/courtService';
import { getSlotsPublicos } from '../../services/reservationService';
import { checkFavorito, agregarFavorito, quitarFavorito } from '../../services/favoriteService';
import useAuthStore from '../../store/authStore';
import './ClubDetail.css';

const TYPE_LABELS = { crystal: 'Cristal', panoramic: 'Panorámica' };

const mapCourt = (court) => ({
  id: court._id,
  name: court.name,
  price: `$${court.pricePerHour}/h`,
  precioNumerico: court.pricePerHour,
  status: court.enabled ? 'Habilitada' : 'Deshabilitada',
  description: court.description || '',
  tags: [TYPE_LABELS[court.type] || court.type, ...(court.features || [])].filter(Boolean),
  image: court.photo || court.photos?.[0] || null,
});

const ClubDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { isAuthenticated } = useAuthStore();

  const [club,               setClub]               = useState(null);
  const [canchas,            setCanchas]             = useState([]);
  const [cargando,           setCargando]            = useState(true);
  const [canchaSeleccionada, setCanchaSeleccionada]  = useState(null);
  const [slotSeleccionado,   setSlotSeleccionado]    = useState(null);
  const [esFavorito,         setEsFavorito]          = useState(false);
  const [cargandoFav,        setCargandoFav]         = useState(false);

  const [calendarSlots, setCalendarSlots] = useState(null);
  const [loadingSlots,  setLoadingSlots]  = useState(false);
  const calCourtRef    = useRef(null);
  const calWeekRef     = useRef(null);
  const reservaWrapRef = useRef(null);

  useEffect(() => {
    const handleClickFuera = (e) => {
      if (reservaWrapRef.current && !reservaWrapRef.current.contains(e.target)) {
        setSlotSeleccionado(null);
      }
    };
    document.addEventListener('mousedown', handleClickFuera);
    return () => document.removeEventListener('mousedown', handleClickFuera);
  }, []);

  useEffect(() => {
    const cargarComplejo = async () => {
      setCargando(true);
      try {
        const [complexRes, courtsRes] = await Promise.all([
          getPublicComplexById(id),
          getPublicCourts(id),
        ]);

        const complex = complexRes.data?.complex;
        const allPhotos = complex?.photos || [];
        const principal = complex?.image;
        const fotosOrdenadas = principal
          ? [principal, ...allPhotos.filter(p => p !== principal)]
          : allPhotos;
        setClub({
          nombre: complex?.name || 'Complejo',
          ubicacion: complex?.location || '',
          telefono: complex?.whatsapp || 'No disponible',
          horario: complex?.openTime && complex?.closeTime
            ? `${complex.openTime} - ${complex.closeTime}`
            : 'No disponible',
          fotos: fotosOrdenadas,
        });

        const lista = (courtsRes.data?.courts || []).map(mapCourt);
        setCanchas(lista);
        setCanchaSeleccionada(lista[0] || null);

        if (isAuthenticated) {
          checkFavorito(id)
            .then(res => setEsFavorito(res.data.esFavorito))
            .catch(() => {});
        }
      } catch (err) {
        console.error('Error cargando el complejo:', err);
        setClub({ nombre: 'Complejo no encontrado', ubicacion: '', telefono: '', horario: '', fotos: [] });
        setCanchas([]);
        setCanchaSeleccionada(null);
      } finally {
        setCargando(false);
      }
    };

    cargarComplejo();
  }, [id]);

  const calendarCourts = useMemo(
    () => canchas.map(c => ({ _id: c.id, name: c.name })),
    [canchas]
  );

  const fetchSlots = useCallback(async (courtId, monday) => {
    if (!courtId || !monday) return;
    setLoadingSlots(true);
    try {
      const from = monday.toISOString().split('T')[0];
      const toDate = new Date(monday);
      toDate.setDate(toDate.getDate() + 6);
      const to = toDate.toISOString().split('T')[0];
      const res = await getSlotsPublicos({ courtId, from, to });
      setCalendarSlots(Array.isArray(res.data) ? res.data : []);
    } catch {
      setCalendarSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  }, []);

  const handleCalWeekChange = useCallback((monday) => {
    calWeekRef.current = monday;
    fetchSlots(calCourtRef.current, monday);
  }, [fetchSlots]);

  const handleCalCourtChange = useCallback((courtId) => {
    calCourtRef.current = courtId;
    fetchSlots(courtId, calWeekRef.current);
  }, [fetchSlots]);

  const irAConfirmacion = () => {
    if (!slotSeleccionado || !canchaSeleccionada) return;
    const { date, hour } = slotSeleccionado;
    const startTime = String(hour).padStart(2, '0') + ':00';
    const endTime   = String(hour + 1).padStart(2, '0') + ':00';
    navigate('/confirmacion', {
      state: {
        courtId:        canchaSeleccionada.id,
        complexId:      id,
        date,
        startTime,
        endTime,
        dia:            new Date(date + 'T12:00:00').getDate(),
        mesNombre:      new Date(date + 'T12:00:00').toLocaleDateString('es-AR', { month: 'long' }),
        anio:           new Date(date + 'T12:00:00').getFullYear(),
        horario:        startTime,
        clubNombre:     club?.nombre,
        ubicacion:      club?.ubicacion,
        canchaNombre:   canchaSeleccionada.name,
        canchaImagen:   canchaSeleccionada.image,
        precioAlquiler: canchaSeleccionada.precioNumerico,
        precioLuz:      1500,
        total:          canchaSeleccionada.precioNumerico + 1500,
        senia:          Math.round((canchaSeleccionada.precioNumerico + 1500) * 0.3),
      }
    });
  };

  const handleFavorito = async () => {
    if (!isAuthenticated) return;
    setCargandoFav(true);
    try {
      if (esFavorito) {
        await quitarFavorito(id);
        setEsFavorito(false);
      } else {
        await agregarFavorito(id);
        setEsFavorito(true);
      }
    } catch {}
    finally { setCargandoFav(false); }
  };

  const formatearDinero = (monto) =>
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(monto);

  if (cargando) return <div style={{ textAlign: 'center', padding: '100px' }}>Cargando complejo...</div>;

  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="club-detail-main">

        <div className="club-header-section">
          <span className="badge-premium">✓ Club Premium</span>
          <h1>{club.nombre}</h1>
          <div className="club-info-row">
            <div className="club-location-contact">
              <span>📍 {club.ubicacion}</span>
              <span>📞 {club.telefono}</span>
              <span>🕒 {club.horario}</span>
            </div>
            <div className="club-action-buttons">
              <button
                className={`btn-secondary${esFavorito ? ' btn-favorito--activo' : ''}`}
                onClick={handleFavorito}
                disabled={cargandoFav || !isAuthenticated}
                title={!isAuthenticated ? 'Iniciá sesión para guardar favoritos' : ''}
              >
                {esFavorito ? '♥ Guardado' : '♡ Favorito'}
              </button>
            </div>
          </div>
        </div>

        {club.fotos.length > 0 && (
          <div className="gallery-grid">
            <img
              src={club.fotos[0]}
              alt={club.nombre}
              className="img-main"
            />
            {club.fotos.length > 1 && (
              <div className="gallery-right">
                {club.fotos.slice(1, 4).map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    alt={`${club.nombre} ${i + 2}`}
                    className={i === 2 ? 'img-wide' : 'img-sub'}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        <div className="content-split">
          <section className="courts-list">
            <div className="courts-header">
              <h2>Nuestras Canchas</h2>
              <span style={{ color: 'var(--color-text-muted)' }}>
                {canchas.length} canchas disponibles
              </span>
            </div>

            {canchas.map((cancha) => (
              <div
                className={`court-card ${canchaSeleccionada?.id === cancha.id ? 'selected' : ''}`}
                key={cancha.id}
                onClick={() => setCanchaSeleccionada(cancha)}
              >
                <div className="court-media-col">
                  <div className={`court-img-container${!cancha.image ? ' court-img-container--empty' : ''}`}>
                    <span className="badge-status">{cancha.status}</span>
                    {cancha.image
                      ? <img src={cancha.image} alt={cancha.name} />
                      : <div className="court-img-empty" />
                    }
                    {canchaSeleccionada?.id === cancha.id && (
                      <div className="selected-badge">✓</div>
                    )}
                  </div>
                  <button
                    className="btn-secondary btn-detalle-cancha"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/cancha/${cancha.id}`);
                    }}
                  >
                    Ver Cancha
                  </button>
                </div>

                <div className="court-info">
                  <div className="court-title-row">
                    <h3>{cancha.name}</h3>
                    <span className="court-price">{cancha.price}</span>
                  </div>
                  <p>{cancha.description}</p>
                  <div className="court-tags">
                    {cancha.tags.map((tag, index) => (
                      <span key={index}>{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </section>
        </div>

        <div ref={reservaWrapRef}>
        <div className="cd-calendar-section">
          <WeeklyCalendar
            courts={calendarCourts}
            slots={calendarSlots}
            loading={loadingSlots}
            showStats={false}
            onWeekChange={handleCalWeekChange}
            onCourtChange={handleCalCourtChange}
            onSlotClick={(courtId, date, hour) => {
              const cancha = canchas.find(c => c.id === courtId);
              if (cancha) setCanchaSeleccionada(cancha);
              setSlotSeleccionado({ courtId, date, hour });
            }}
          />
        </div>

        {canchaSeleccionada && (
          <div className="cd-booking-summary">
            <div className="cd-bs-row">
              <span>{canchaSeleccionada.name} x 1h</span>
              <span>{formatearDinero(canchaSeleccionada.precioNumerico)}</span>
            </div>
            <div className="cd-bs-row">
              <span>Tasa de Servicio</span>
              <span>{formatearDinero(1500)}</span>
            </div>
            <div className="cd-bs-total">
              <span>Total</span>
              <span>{formatearDinero(canchaSeleccionada.precioNumerico + 1500)}</span>
            </div>
            {slotSeleccionado && (
              <button className="btn-book" onClick={irAConfirmacion}>
                Realizar Reserva
              </button>
            )}
          </div>
        )}
        </div>

        <ClubReviews complexId={id} />

      </main>
      <Footer />
    </div>
  );
};

export default ClubDetail;
