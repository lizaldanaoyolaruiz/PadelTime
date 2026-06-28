import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../../services/axios';

export default function BookingSuccess() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [estado, setEstado] = useState('cargando');

  useEffect(() => {
    const bookingId        = params.get('bookingId');
    const paymentId        = params.get('payment_id');
    const collectionStatus = params.get('collection_status') || params.get('status');

    if (!bookingId) { setEstado('error'); return; }

    api.patch(`/bookings/${bookingId}/payment-success`, { paymentId, collectionStatus })
      .then((res) => {
        if (res.data?.pending) setEstado('en_proceso');
        else setEstado('ok');
      })
      .catch((err) => {
        const msg = err.response?.data?.message || '';
        setEstado(msg.includes('aprobado') ? 'rechazado' : 'error');
      });
  }, []);

  return (
    <div style={{ textAlign: 'center', padding: '80px 20px', color: '#fff' }}>
      {estado === 'cargando' && <p>Confirmando tu reserva...</p>}

      {estado === 'ok' && (
        <>
          <h2 style={{ color: '#bef264' }}>¡Reserva confirmada!</h2>
          <p>Tu pago fue procesado correctamente. Te enviamos un email con los detalles.</p>
          <button
            onClick={() => navigate('/panelcliente')}
            style={{ marginTop: 20, padding: '10px 24px', cursor: 'pointer', borderRadius: 8, background: '#bef264', border: 'none', fontWeight: 600, color: '#0f172a' }}
          >
            Ver mis reservas
          </button>
        </>
      )}

      {estado === 'rechazado' && (
        <>
          <h2 style={{ color: '#ef4444' }}>Pago rechazado</h2>
          <p>Tu pago no fue aprobado. La reserva fue cancelada. Podés intentarlo nuevamente.</p>
          <button
            onClick={() => navigate(-1)}
            style={{ marginTop: 20, padding: '10px 24px', cursor: 'pointer', borderRadius: 8, background: '#374151', border: 'none', color: '#fff' }}
          >
            Volver e intentar de nuevo
          </button>
        </>
      )}

      {estado === 'en_proceso' && (
        <>
          <h2 style={{ color: '#fbbf24', marginBottom: 12 }}>Pago en proceso</h2>
          <p style={{ color: '#94a3b8' }}>Tu pago está siendo procesado. Recibirás un email cuando se confirme tu reserva.</p>
          <button
            onClick={() => navigate('/panelcliente')}
            style={{ marginTop: 20, padding: '10px 24px', cursor: 'pointer', borderRadius: 8, background: '#374151', border: 'none', color: '#fff' }}
          >
            Ver mis reservas
          </button>
        </>
      )}

      {estado === 'error' && (
        <>
          <h2 style={{ color: '#ef4444' }}>Hubo un problema</h2>
          <p style={{ color: '#94a3b8' }}>No pudimos confirmar tu reserva. Contactá al complejo.</p>
          <button
            onClick={() => navigate('/')}
            style={{ marginTop: 20, padding: '10px 24px', cursor: 'pointer', borderRadius: 8, background: '#374151', border: 'none', color: '#fff' }}
          >
            Volver al inicio
          </button>
        </>
      )}
    </div>
  );
}
