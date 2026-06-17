import { useState, useEffect, useCallback } from 'react';
import { getMyComplex } from '../../../services/complexService';
import { getMyCourts } from '../../../services/courtService';
import { getReservasOwner } from '../../../services/reservationService';
import { generarSlots } from '../utils/constants';
import StatCards from './StatCards';
import PendingList from './PendingList';
import AgendaTable from './AgendaTable';
import NewReservationModal from './NewReservationModal';
import './GeneralPanel.css';

export default function GeneralPanel() {
  const [complejo,  setComplejo]  = useState(null);
  const [pending,   setPending]   = useState([]);
  const [canchas,   setCanchas]   = useState([]);
  const [agenda,    setAgenda]    = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [showModal, setShowModal] = useState(false);

  const hoy = new Date().toISOString().split('T')[0];
  const todayLabel = new Date().toLocaleDateString('es-AR', {
    weekday: 'long', day: 'numeric', month: 'long',
  });

  const cargarDatos = useCallback(async () => {
    try {
      let complexId;
      try {
        const complexRes = await getMyComplex();
        const complex = complexRes.data.complex || complexRes.data;
        complexId = complex?._id;
        setComplejo(complex ?? null);
      } catch {
        // continúa sin complejo
      }

      const [canchasRes, pendientesRes, agendaRes] = await Promise.all([
        getMyCourts(complexId),
        getReservasOwner({ status: 'pending' }),
        getReservasOwner({ date: hoy }),
      ]);

      const courts      = canchasRes.data.courts      || canchasRes.data   || [];
      const pendientes  = pendientesRes.data.bookings || pendientesRes.data || [];
      const reservasHoy = agendaRes.data.bookings     || agendaRes.data    || [];

      setCanchas(Array.isArray(courts) ? courts : []);
      setPending(Array.isArray(pendientes) ? pendientes : []);

      const slots  = generarSlots();
      const matriz = slots.map(slot => {
        const fila = { horario: slot };
        (Array.isArray(courts) ? courts : []).forEach(c => {
          fila[c._id] = reservasHoy.find(
            r => r.court?._id === c._id &&
                 r.startTime === slot &&
                 r.status !== 'cancelled'
          ) || null;
        });
        return fila;
      });

      setAgenda(matriz);
    } catch (err) {
      const status = err.response?.status;
      if (status && ![404, 401, 403].includes(status)) console.error('Error cargando panel:', err);
    } finally {
      setLoading(false);
    }
  }, [hoy]);

  useEffect(() => { cargarDatos(); }, [cargarDatos]);

  if (loading) {
    return <div className="panel-wrap"><p style={{ color: 'var(--color-text-muted)' }}>Cargando...</p></div>;
  }

  return (
    <div className="panel-wrap">
      <div className="pg-header">
        <div>
          <h2>Gestión de Turnos</h2>
          <p className="panel-subtitle" style={{ textTransform: 'capitalize' }}>{todayLabel}</p>
        </div>
        <div className="pg-header-actions">
          <span className="mp-status">
            <span className="mp-dot" />
            Mercado Pago: {complejo?.mercadopagoActive ? 'Conectado' : 'No conectado'}
          </span>
          <button className="btn-primary" onClick={() => setShowModal(true)}>+ Nueva Reserva</button>
        </div>
      </div>

      <StatCards />

      <div className="pg-mid">
        <div className="pg-card pg-card--sena">
          <h3 className="pg-card-title">Porcentaje de Seña</h3>
          <p className="pg-card-desc">
            Define el porcentaje que los jugadores deben abonar para confirmar su reserva vía Mercado Pago.
          </p>
          <div className="sena-value">{complejo?.depositPercentage ?? '—'}%</div>
          <button className="btn-secondary" style={{ marginTop: 12 }}>Modificar en Config. Pagos</button>
        </div>

        <PendingList pending={pending} onRefresh={cargarDatos} />
      </div>

      <AgendaTable canchas={canchas} agenda={agenda} />

      {showModal && (
        <NewReservationModal
          onClose={() => setShowModal(false)}
          onCreated={() => { setShowModal(false); cargarDatos(); }}
        />
      )}
    </div>
  );
}
