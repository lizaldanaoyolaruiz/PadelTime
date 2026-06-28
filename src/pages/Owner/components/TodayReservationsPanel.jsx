import { useState, useEffect, useCallback, useRef } from 'react';
import { getMyCourts } from '../../../services/courtService';
import { getSlotsCalendar, getReservasOwner, getBookingStats, getMantenimientos } from '../../../services/reservationService';
import WeeklyCalendar from '../../../components/WeeklyCalendar/WeeklyCalendar';
import NewReservationModal from './NewReservationModal';
import ReservationDetailModal from './ReservationDetailModal';
import MaintenanceModal from './MaintenanceModal';

export default function TodayReservationsPanel({ complexId }) {
  const [canchas,         setCanchas]         = useState([]);
  const [calendarSlots,   setCalendarSlots]   = useState(null);
  const [loadingSlots,    setLoadingSlots]    = useState(false);
  const [weekStats,       setWeekStats]       = useState(null);
  const [showModal,       setShowModal]       = useState(false);
  const [modalSlot,       setModalSlot]       = useState(null);
  const [reservaDetalle,       setReservaDetalle]       = useState(null);
  const [showDetailModal,      setShowDetailModal]      = useState(false);
  const [mantenimientoDetalle, setMantenimientoDetalle] = useState(null);
  const [showMantModal,        setShowMantModal]        = useState(false);

  const courtRef = useRef(null);
  const weekRef  = useRef(null);

  useEffect(() => {
    setCanchas([]);
    setCalendarSlots(null);
    courtRef.current = null;

    (async () => {
      try {
        const res = await getMyCourts(complexId);
        const courts = res.data.courts || res.data || [];
        setCanchas(Array.isArray(courts) ? courts : []);
      } catch {  }
    })();
  }, [complexId]);

  const fetchSlots = useCallback(async (courtId, monday) => {
    if (!courtId || !monday) return;
    setLoadingSlots(true);
    try {
      const from = monday.toISOString().split('T')[0];
      const toDate = new Date(monday);
      toDate.setDate(toDate.getDate() + 6);
      const to = toDate.toISOString().split('T')[0];

      const [slotsRes, statsRes] = await Promise.all([
        getSlotsCalendar({ courtId, from, to }),
        getBookingStats({ courtId, from, to }),
      ]);

      setCalendarSlots(Array.isArray(slotsRes.data) ? slotsRes.data : []);
      setWeekStats(statsRes.data || null);
    } catch {
      setCalendarSlots([]);
      setWeekStats(null);
    } finally {
      setLoadingSlots(false);
    }
  }, []);

  const handleWeekChange = useCallback((monday) => {
    weekRef.current = monday;
    fetchSlots(courtRef.current, monday);
  }, [fetchSlots]);

  const handleCourtChange = useCallback((courtId) => {
    courtRef.current = courtId;
    fetchSlots(courtId, weekRef.current);
  }, [fetchSlots]);

  const handleSlotClick = useCallback((courtId, date, hour) => {
    setModalSlot({ courtId, date, hour });
    setShowModal(true);
  }, []);

  const handleOccupiedSlotClick = useCallback(async (courtId, date, hour, status) => {
    const startTime = String(hour).padStart(2, '0') + ':00';

    if (status === 'mantenimiento') {
      try {
        const res = await getMantenimientos({ courtId, from: date, to: date });
        const slot = (res.data.slots || []).find(s => s.startTime <= startTime && s.endTime > startTime);
        if (slot) { setMantenimientoDetalle(slot); setShowMantModal(true); }
      } catch {}
      return;
    }

    try {
      const res = await getReservasOwner({ courtId, date });
      const bookings = res.data.bookings || [];
      const reserva = bookings.find(
        b => b.startTime === startTime && b.status !== 'cancelled' && b.status !== 'rejected'
      );
      if (reserva) { setReservaDetalle(reserva); setShowDetailModal(true); }
    } catch {}
  }, []);

  const refreshSlots = useCallback(() => {
    fetchSlots(courtRef.current, weekRef.current);
  }, [fetchSlots]);

  const calCourts = canchas.map(c => ({ _id: c._id, name: c.name }));

  return (
    <div className="panel-wrap">
      <div className="pg-header">
        <div>
          <h2>Reservas</h2>
          <p className="panel-subtitle">Agenda semanal de disponibilidad y reservas.</p>
        </div>
        <button
          className="btn-primary"
          onClick={() => { setModalSlot(null); setShowModal(true); }}
        >
          + Nueva Reserva
        </button>
      </div>

      <WeeklyCalendar
        courts={calCourts}
        slots={calendarSlots}
        loading={loadingSlots}
        stats={weekStats}
        onSlotClick={handleSlotClick}
        onOccupiedSlotClick={handleOccupiedSlotClick}
        onWeekChange={handleWeekChange}
        onCourtChange={handleCourtChange}
      />

      {showModal && (
        <NewReservationModal
          slotData={modalSlot}
          onClose={() => setShowModal(false)}
          onCreated={() => { setShowModal(false); refreshSlots(); }}
        />
      )}

      {showDetailModal && reservaDetalle && (
        <ReservationDetailModal
          reserva={reservaDetalle}
          onClose={() => { setShowDetailModal(false); setReservaDetalle(null); }}
          onRefresh={() => { setShowDetailModal(false); setReservaDetalle(null); refreshSlots(); }}
        />
      )}

      {showMantModal && mantenimientoDetalle && (
        <MaintenanceModal
          slot={mantenimientoDetalle}
          onClose={() => { setShowMantModal(false); setMantenimientoDetalle(null); }}
          onEliminado={() => { setShowMantModal(false); setMantenimientoDetalle(null); refreshSlots(); }}
        />
      )}
    </div>
  );
}
