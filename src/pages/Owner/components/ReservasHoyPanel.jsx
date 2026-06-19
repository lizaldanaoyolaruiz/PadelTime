import { useState, useEffect, useCallback, useRef } from 'react';
import { getMyCourts } from '../../../services/courtService';
import { getSlotsCalendar } from '../../../services/reservationService';
import WeeklyCalendar from '../../../components/WeeklyCalendar/WeeklyCalendar';
import NewReservationModal from './NewReservationModal';

export default function ReservasHoyPanel({ complexId }) {
  const [canchas,       setCanchas]       = useState([]);
  const [calendarSlots, setCalendarSlots] = useState(null);
  const [loadingSlots,  setLoadingSlots]  = useState(false);
  const [showModal,     setShowModal]     = useState(false);

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
      } catch { /* silencia errores */ }
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
      const res = await getSlotsCalendar({ courtId, from, to });
      setCalendarSlots(Array.isArray(res.data) ? res.data : []);
    } catch {
      setCalendarSlots([]);
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

  const handleSlotClick = (_courtId, _date, _hour) => {
    setShowModal(true);
  };

  const refreshSlots = useCallback(() => {
    fetchSlots(courtRef.current, weekRef.current);
  }, [fetchSlots]);

  const calCourts = canchas.map(c => ({ _id: c._id, name: c.name }));

  return (
    <div className="panel-wrap">
      <WeeklyCalendar
        courts={calCourts}
        slots={calendarSlots}
        loading={loadingSlots}
        onSlotClick={handleSlotClick}
        onWeekChange={handleWeekChange}
        onCourtChange={handleCourtChange}
      />
      {showModal && (
        <NewReservationModal
          onClose={() => setShowModal(false)}
          onCreated={() => { setShowModal(false); refreshSlots(); }}
        />
      )}
    </div>
  );
}
