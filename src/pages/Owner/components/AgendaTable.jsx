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

export default function AgendaTable({ canchas, agenda }) {
  if (!canchas.length) {
    return (
      <div className="agenda-card">
        <div className="agenda-header">
          <h3 className="pg-card-title" style={{ margin: 0 }}>Agenda de Canchas - Hoy</h3>
        </div>
        <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', padding: '24px 0', textAlign: 'center' }}>
          No hay canchas configuradas aún.
        </p>
      </div>
    );
  }

  return (
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
                  <span className="cancha-name">{c.name?.toUpperCase()}</span>
                  <span className="cancha-sub">{c.type}</span>
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
  );
}
