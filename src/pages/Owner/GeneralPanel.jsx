import { useState, useEffect, useCallback } from 'react';
import { CheckCircle2, XCircle, TrendingUp, Users, CalendarCheck, DollarSign } from 'lucide-react';
import Swal from 'sweetalert2';
import { getMyCourts } from '../../api/courtApi';
import { getReservasOwner, confirmarReserva, rechazarReserva } from '../../api/reservasApi';
import './GeneralPanel.css';

const STATS = [
  { label: 'Reservas hoy',      Icon: CalendarCheck, color: '#BEF264' },
  { label: 'Ingresos hoy',      Icon: DollarSign,    color: '#84CC16' },
  { label: 'Jugadores activos', Icon: Users,         color: '#60A5FA' },
  { label: 'Ocupación',         Icon: TrendingUp,    color: '#F59E0B' },
];

function generarSlots(inicio = '08:00', fin = '22:00') {
  const slots = [];
  const [hI, mI] = inicio.split(':').map(Number);
  const [hF, mF] = fin.split(':').map(Number);
  let total = hI * 60 + mI;
  const limite = hF * 60 + mF;
  while (total < limite) {
    const h = String(Math.floor(total / 60)).padStart(2, '0');
    const m = String(total % 60).padStart(2, '0');
    slots.push(`${h}:${m}`);
    total += 90;
  }
  return slots;
}

function SlotCell({ reserva }) {
  if (!reserva) {
    return (
      <div className="slot slot--libre">
        <span>Turno Libre</span>
        <span className="slot-sub">Click para reservar</span>
      </div>
    );
  }
  const cls =
    reserva.estado === 'confirmada' ? 'slot--confirmado'
    : reserva.estado === 'pendiente' ? 'slot--pendiente'
    : 'slot--libre';

  const nombre = reserva.jugador
    ? `${reserva.jugador.nombre || ''} ${(reserva.jugador.apellido || '')[0] || ''}.`.trim()
    : '—';

  return (
    <div className={`slot ${cls}`}>
      <span className="slot-name">{nombre}</span>
      <span className="slot-sub">
        {reserva.estado === 'confirmada' ? 'Confirmado' : 'Esperando confirmación'}
      </span>
    </div>
  );
}

export default function GeneralPanel() {
  const [pending, setPending] = useState([]);
  const [canchas, setCanchas] = useState([]);
  const [agenda,  setAgenda]  = useState([]);
  const [loading, setLoading] = useState(true);

  const hoy = new Date().toISOString().split('T')[0];
  const todayLabel = new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' });

  const cargarDatos = useCallback(async () => {
    try {
      const [canchasRes, pendientesRes, agendaRes] = await Promise.all([
        getMyCourts(),
        getReservasOwner({ estado: 'pendiente' }),
        getReservasOwner({ fecha: hoy }),
      ]);

      const courts      = canchasRes.data   || [];
      const pendientes  = pendientesRes.data || [];
      const reservasHoy = agendaRes.data    || [];

      setCanchas(courts);
      setPending(pendientes);

      const slots = generarSlots();
      const matriz = slots.map(slot => {
        const fila = { horario: slot };
        courts.forEach(c => {
          fila[c._id] = reservasHoy.find(
            r => r.cancha?._id === c._id &&
                 r.horaInicio === slot &&
                 !['cancelada', 'rechazada'].includes(r.estado)
          ) || null;
        });
        return fila;
      });

      setAgenda(matriz);
    } catch (err) {
      console.error('Error cargando panel:', err);
    } finally {
      setLoading(false);
    }
  }, [hoy]);

  useEffect(() => { cargarDatos(); }, [cargarDatos]);

  const handleConfirmar = async (reserva) => {
    const result = await Swal.fire({
      title: '¿Confirmar turno?',
      text: `${reserva.jugador?.nombre} — ${reserva.cancha?.nombre} ${reserva.horaInicio}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, confirmar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#84CC16',
    });
    if (!result.isConfirmed) return;
    try {
      await confirmarReserva(reserva._id);
      Swal.fire({ icon: 'success', title: 'Turno confirmado', timer: 1500, showConfirmButton: false });
      cargarDatos();
    } catch {
      Swal.fire({ icon: 'error', title: 'Error al confirmar' });
    }
  };

  const handleRechazar = async (reserva) => {
    const { value: nota, isConfirmed } = await Swal.fire({
      title: 'Rechazar turno',
      input: 'text',
      inputLabel: 'Motivo (opcional)',
      inputPlaceholder: 'Ej: Cancha en mantenimiento',
      showCancelButton: true,
      confirmButtonText: 'Rechazar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#EF4444',
    });
    if (!isConfirmed) return;
    try {
      await rechazarReserva(reserva._id, nota || '');
      Swal.fire({ icon: 'success', title: 'Turno rechazado', timer: 1500, showConfirmButton: false });
      cargarDatos();
    } catch {
      Swal.fire({ icon: 'error', title: 'Error al rechazar' });
    }
  };

  if (loading) return <div className="panel-wrap"><p style={{ color: 'var(--color-text-muted)' }}>Cargando...</p></div>;

  return (
    <div className="panel-wrap">
      {/* Header */}
      <div className="pg-header">
        <div>
          <h2>Gestión de Turnos</h2>
          <p className="panel-subtitle" style={{ textTransform: 'capitalize' }}>{todayLabel}</p>
        </div>
        <div className="pg-header-actions">
          <span className="mp-status"><span className="mp-dot" />Mercado Pago: Conectado</span>
          <button className="btn-primary">+ Nueva Reserva</button>
        </div>
      </div>

      {/* Stats row */}
      <div className="stats-row">
        {STATS.map(({ label, Icon, color }) => (
          <div key={label} className="stat-card">
            <div className="stat-icon" style={{ background: `${color}18`, color }}>
              <Icon size={20} />
            </div>
            <div>
              <div className="stat-value">—</div>
              <div className="stat-label">{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Mid row */}
      <div className="pg-mid">
        {/* Seña config */}
        <div className="pg-card pg-card--sena">
          <h3 className="pg-card-title">Porcentaje de Seña</h3>
          <p className="pg-card-desc">Define el porcentaje que los jugadores deben abonar para confirmar su reserva vía Mercado Pago.</p>
          <div className="sena-value">30%</div>
          <p className="sena-meta">Último cambio: 12 Oct</p>
          <button className="btn-secondary" style={{ marginTop: 12 }}>Modificar en Config. Pagos</button>
        </div>

        {/* Turnos por confirmar */}
        <div className="pg-card pg-card--confirmaciones">
          <div className="confirmaciones-header">
            <h3 className="pg-card-title" style={{ margin: 0 }}>Turnos por Confirmar</h3>
            {pending.length > 0 && <span className="badge-pending">{pending.length} Pendientes</span>}
          </div>
          <div className="confirmaciones-list">
            {pending.length === 0 ? (
              <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', margin: '24px 0', textAlign: 'center' }}>
                No hay turnos pendientes
              </p>
            ) : pending.map(t => (
              <div key={t._id} className="turno-row">
                <div className="turno-icon"><Users size={18} /></div>
                <div className="turno-info">
                  <span className="turno-nombre">{t.jugador?.nombre} {t.jugador?.apellido}</span>
                  <span className="turno-detalle">{t.cancha?.nombre} • {t.horaInicio} - {t.horaFin}</span>
                </div>
                <span className="turno-estado estado-pendiente">${t.montoTotal}</span>
                <div className="turno-actions">
                  <button className="action-btn action-btn--reject"  onClick={() => handleRechazar(t)}>
                    <XCircle size={18} />
                  </button>
                  <button className="action-btn action-btn--confirm" onClick={() => handleConfirmar(t)}>
                    <CheckCircle2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Agenda */}
      <div className="agenda-card">
        <div className="agenda-header">
          <h3 className="pg-card-title" style={{ margin: 0 }}>Agenda de Canchas - Hoy</h3>
          <div className="agenda-header-actions">
            <button className="btn-icon-text">Filtrar</button>
            <button className="btn-icon-text">Imprimir</button>
          </div>
        </div>
        <div className="agenda-table-wrap">
          <table className="agenda-table">
            <thead>
              <tr>
                <th>Horario</th>
                {canchas.map(c => (
                  <th key={c._id}>
                    <span className="cancha-name">{c.nombre?.toUpperCase()}</span>
                    <span className="cancha-sub">{c.tipo}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {agenda.map(fila => (
                <tr key={fila.horario}>
                  <td className="horario-cell">{fila.horario}</td>
                  {canchas.map(c => (
                    <td key={c._id}>
                      <SlotCell reserva={fila[c._id]} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
