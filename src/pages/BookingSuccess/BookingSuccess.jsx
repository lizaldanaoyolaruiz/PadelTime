import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../../services/axios';

export default function BookingSuccess() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [estado, setEstado] = useState('cargando');

  useEffect(() => {
    const bookingId = params.get('bookingId');
    if (!bookingId) { setEstado('error'); return; }

    api.patch(`/bookings/${bookingId}/payment-success`)
      .then(() => setEstado('ok'))
      .catch(() => setEstado('error'));
  }, []);

  return (
    <div style={{ textAlign: 'center', padding: '80px 20px', color: '#fff' }}>
      {estado === 'cargando' && <p>Confirmando tu reserva...</p>}
      {estado === 'ok' && (
        <>
          <h2 style={{ color: '#bef264' }}>¡Reserva confirmada!</h2>
          <p>Tu pago fue procesado correctamente.</p>
          <button onClick={() => window.close()} style={{ marginTop: 20, padding: '10px 24px', cursor: 'pointer' }}>
            Cerrar esta ventana
          </button>
        </>
      )}
      {estado === 'error' && (
        <>
          <h2>Hubo un problema</h2>
          <p>No pudimos confirmar tu reserva. Contactá al complejo.</p>
          <button onClick={() => navigate('/')} style={{ marginTop: 20, padding: '10px 24px', cursor: 'pointer' }}>
            Volver al inicio
          </button>
        </>
      )}
    </div>
  );
}
