import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ClubReviews from './ClubReviews';
import WeeklyCalendar from '../../components/WeeklyCalendar/WeeklyCalendar';
import { getPublicComplexById } from '../../services/complexService';
import { getPublicCourts } from '../../services/courtService';
import { getSlotsCalendar } from '../../services/reservationService';
import './ClubDetail.css';

const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&q=80&w=400';

const TYPE_LABELS = { crystal: 'Cristal', panoramic: 'Panorámica' };

const MESES_ES = [
  'Enero','Febrero','Marzo','Abril','Mayo','Junio',
  'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre',
];
const DIA_LABELS_WIDGET = ['L','M','X','J','V','S','D'];

function getLunesDate(offset) {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const dow = hoy.getDay();
  const diff = dow === 0 ? -6 : 1 - dow;
  hoy.setDate(hoy.getDate() + diff + offset * 7);
  return hoy;
}

const mapCourt = (court) => ({
  id: court._id,
  name: court.name,
  price: `$${court.pricePerHour}/h`,
  precioNumerico: court.pricePerHour,
  status: court.enabled ? 'Habilitada' : 'Deshabilitada',
  description: court.description || '',
  tags: [TYPE_LABELS[court.type] || court.type, ...(court.features || [])].filter(Boolean),
  image: court.photo || PLACEHOLDER_IMAGE,
});

const ClubDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [club, setClub] = useState(null);
  const [canchas, setCanchas] = useState([]);
  const [cargando, setCargando] = useState(true);

  const [fechaSeleccionada, setFechaSeleccionada] = useState(() => new Date().toISOString().split('T')[0]);
  const [semanaOffset, setSemanaOffset] = useState(0);
  const [horarioSeleccionado, setHorarioSeleccionado] = useState('10:00');
  const [canchaSeleccionada, setCanchaSeleccionada] = useState(null);

  const [calendarSlots,  setCalendarSlots]  = useState(null);
  const [loadingSlots,   setLoadingSlots]   = useState(false);
  const calCourtRef = useRef(null);
  const calWeekRef  = useRef(null);

  // Semana del widget de reserva
  const lunesSemana = getLunesDate(semanaOffset);
  const diasSemana = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(lunesSemana);
    d.setDate(d.getDate() + i);
    return {
      label: DIA_LABELS_WIDGET[i],
      num: d.getDate(),
      fecha: d.toISOString().split('T')[0],
    };
  });
  const headerMes = `${MESES_ES[lunesSemana.getMonth()]} ${lunesSemana.getFullYear()}`;

  useEffect(() => {
    const cargarComplejo = async () => {
      setCargando(true);
      try {
        const [complexRes, courtsRes] = await Promise.all([
          getPublicComplexById(id),
          getPublicCourts(id),
        ]);

        const complex = complexRes.data?.complex;
        setClub({
          nombre: complex?.name || 'Complejo',
          ubicacion: complex?.location || '',
          telefono: complex?.whatsapp || 'No disponible',
          horario: complex?.openTime && complex?.closeTime
            ? `${complex.openTime} - ${complex.closeTime}`
            : 'No disponible',
        });

        const canchas = (courtsRes.data?.courts || []).map(mapCourt);
        setCanchas(canchas);
        setCanchaSeleccionada(canchas[0] || null);
      } catch (err) {
        console.error('Error cargando el complejo:', err);
        setClub({ nombre: 'Complejo no encontrado', ubicacion: '', telefono: '', horario: '' });
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
      const res = await getSlotsCalendar({ courtId, from, to });
      setCalendarSlots(Array.isArray(res.data) ? res.data : []);
    } catch {
      setCalendarSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  }, []);

  // Refrescar slots del widget cuando cambia la semana o la cancha seleccionada
  useEffect(() => {
    if (!canchaSeleccionada) return;
    fetchSlots(canchaSeleccionada.id, getLunesDate(semanaOffset));
  }, [semanaOffset, canchaSeleccionada, fetchSlots]);

  const handleCalWeekChange = useCallback((monday) => {
    calWeekRef.current = monday;
    fetchSlots(calCourtRef.current, monday);
  }, [fetchSlots]);

  const handleCalCourtChange = useCallback((courtId) => {
    calCourtRef.current = courtId;
    fetchSlots(courtId, calWeekRef.current);
  }, [fetchSlots]);

  const isDisponible = (hora) => {
    if (calendarSlots === null) return true;
    const slot = calendarSlots.find(s => s.date === fechaSeleccionada && s.hour === hora);
    return !slot || slot.status === 'disponible';
  };

  const handleReserva = () => {
    if (!canchaSeleccionada) return;

    const [startHour, startMinute] = horarioSeleccionado.split(':').map(Number);
    const endTime = `${String(startHour + 1).padStart(2, '0')}:${String(startMinute).padStart(2, '0')}`;

    const fechaObj = new Date(fechaSeleccionada + 'T00:00:00');
    const dia      = fechaObj.getDate();
    const mesNombre = MESES_ES[fechaObj.getMonth()];
    const anio     = fechaObj.getFullYear();

    navigate('/confirmacion', {
      state: {
        courtId: canchaSeleccionada.id,
        complexId: id,
        date: fechaSeleccionada,
        startTime: horarioSeleccionado,
        endTime,
        clubNombre: club?.nombre || "Premium Padel Club",
        ubicacion: club?.ubicacion || "Buenos Aires, Argentina",
        canchaNombre: canchaSeleccionada.name,
        canchaImagen: canchaSeleccionada.image,
        dia,
        mesNombre,
        anio,
        horario: horarioSeleccionado,
        precioAlquiler: canchaSeleccionada.precioNumerico,
        precioLuz: 1500,
        total: canchaSeleccionada.precioNumerico + 1500,
        senia: 5000
      }
    });
  };

  const formatearDinero = (monto) => {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(monto);
  };

  if (cargando) return <div style={{textAlign: 'center', padding: '100px'}}>Cargando complejo...</div>;

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
              <button className="btn-secondary">🔗 Compartir</button>
              <button className="btn-secondary">♡ Favorito</button>
            </div>
          </div>
        </div>

        <div className="gallery-grid">
          <img src="https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&q=80&w=800" alt="Cancha principal" className="img-main" />
          <div className="gallery-right">
            <img src="https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&q=80&w=400" alt="Cancha detalle 1" className="img-sub" />
            <img src="https://images.unsplash.com/photo-1574629810360-7efbb1925536?auto=format&fit=crop&q=80&w=400" alt="Cancha detalle 2" className="img-sub" />
            <img src="https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&q=80&w=800" alt="Cancha detalle 3" className="img-wide" />
          </div>
        </div>

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
                  <div className="court-img-container">
                    <span className="badge-status">{cancha.status}</span>
                    <img src={cancha.image} alt={cancha.name} />
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

          <aside className="booking-widget">
            <h3>Reserva tu turno</h3>

            <div className="calendar-section">
              <div className="calendar-header">
                <span>{headerMes}</span>
                <div className="calendar-arrows">
                  <span
                    style={{ cursor: semanaOffset <= 0 ? 'not-allowed' : 'pointer', opacity: semanaOffset <= 0 ? 0.4 : 1 }}
                    onClick={() => semanaOffset > 0 && setSemanaOffset(o => o - 1)}
                  >&lt;</span>
                  <span
                    style={{ cursor: 'pointer' }}
                    onClick={() => setSemanaOffset(o => o + 1)}
                  >&gt;</span>
                </div>
              </div>
              <div className="calendar-days">
                {diasSemana.map(({ label, num, fecha }) => (
                  <div
                    key={fecha}
                    className={`day ${fechaSeleccionada === fecha ? 'active' : ''}`}
                    onClick={() => setFechaSeleccionada(fecha)}
                  >
                    <span>{label}</span>
                    <span>{num}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="time-slots">
              <span>Horarios disponibles</span>
              <div className="slots-grid">
                {[8, 9, 10, 11, 12, 13].map(h => {
                  const label = `${String(h).padStart(2, '0')}:00`;
                  const disponible = isDisponible(h);
                  return (
                    <button
                      key={h}
                      className={`slot${!disponible ? ' disabled' : horarioSeleccionado === label ? ' active' : ''}`}
                      onClick={disponible ? () => setHorarioSeleccionado(label) : undefined}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="booking-summary">
              <div className="summary-row">
                <span>{canchaSeleccionada ? canchaSeleccionada.name : 'Seleccione una cancha'} x 1h</span>
                <span>{canchaSeleccionada ? formatearDinero(canchaSeleccionada.precioNumerico) : '$0,00'}</span>
              </div>
              <div className="summary-row">
                <span>Tasa de Servicio</span>
                <span>$1.500,00</span>
              </div>
              <div className="summary-total">
                <span>Total</span>
                <span>{canchaSeleccionada ? formatearDinero(canchaSeleccionada.precioNumerico + 1500) : '$0,00'}</span>
              </div>
              <button
                className="btn-book"
                onClick={handleReserva}
                disabled={!canchaSeleccionada}
                style={{ opacity: canchaSeleccionada ? 1 : 0.5, cursor: canchaSeleccionada ? 'pointer' : 'not-allowed' }}
              >
                Realizar Reserva
              </button>
            </div>
          </aside>
        </div>

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
              if (!cancha) return;
              setCanchaSeleccionada(cancha);
              setHorarioSeleccionado(`${String(hour).padStart(2, '0')}:00`);
            }}
          />
        </div>

        <ClubReviews complexId={id} />

      </main>
      <Footer />
    </div>
  );
};

export default ClubDetail;
