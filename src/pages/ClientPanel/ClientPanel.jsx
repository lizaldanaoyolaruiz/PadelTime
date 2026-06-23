import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import useAuthStore from '../../store/authStore';
import { getReservasOwner, cancelarReserva } from '../../services/reservationService';
import { getFavoritos } from '../../services/favoriteService';
import './ClientPanel.css';

const STATUS_LABEL = { pending: 'Pendiente', confirmed: 'Confirmada', cancelled: 'Cancelado', rejected: 'Rechazada', completed: 'Finalizado' };
const STATUS_CLASS = { pending: 'pendiente', confirmed: 'confirmada', cancelled: 'cancelado', rejected: 'cancelado', completed: 'finalizado' };

const formatFecha = (f) => {
  const d = f?.includes('T') ? f.split('T')[0] : f;
  if (!d) return '-';
  const [y, m, day] = d.split('-');
  const meses = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
  return `${parseInt(day)} ${meses[parseInt(m)-1]}, ${y}`;
};

export default function PanelCliente() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [tab,       setTab]       = useState('reservas');
  const [reservas,  setReservas]  = useState([]);
  const [favoritos, setFavoritos] = useState([]);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await getReservasOwner();
        setReservas(res.data.bookings || []);
      } catch {}
      finally { setLoading(false); }
    })();
  }, []);

  useEffect(() => {
    if (tab !== 'favoritos') return;
    getFavoritos().then(res => setFavoritos(res.data.favoritos || [])).catch(() => {});
  }, [tab]);

  const hoy = new Date().toISOString().split('T')[0];
  const partidos = reservas.filter(r => r.status === 'confirmed').length;
  const proximas = reservas
    .filter(r => r.status === 'confirmed' && r.date >= hoy)
    .sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime));
  const proximaReserva = proximas[0] || null;

  const handleLogout = () => { logout(); navigate('/'); };

  const handleCancelar = async (id) => {
    try {
      await cancelarReserva(id);
      setReservas(prev => prev.map(r => r._id === id ? { ...r, status: 'cancelled' } : r));
    } catch {}
  };

  return (
    <div className="panel-cliente-page">
      <Navbar />
      <div className="panel">
        <div className="left-column">
          <div className="card profile-card">
            <div className="profile-header">
              <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#bef264', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 700, color: '#000' }}>
                {user?.name?.[0]?.toUpperCase() || 'J'}
              </div>
              <div>
                <h2>{user?.name || 'Jugador'}</h2>
                <p>{user?.email}</p>
              </div>
            </div>
            <div className="stats">
              <div className="stat-box"><span>RESERVAS</span><h3>{reservas.length}</h3></div>
              <div className="stat-box"><span>CONFIRMADAS</span><h3>{partidos}</h3></div>
            </div>
          </div>

          {proximaReserva && (
            <div className="next-match">
              <div className="tag">PRÓXIMA RESERVA</div>
              <h1>{formatFecha(proximaReserva.date)}</h1>
              <p>{proximaReserva.startTime} — {proximaReserva.court?.name}</p>
              {proximaReserva.complex?.whatsapp && (
                <p style={{ fontSize: 13, opacity: 0.7 }}>WhatsApp: {proximaReserva.complex.whatsapp}</p>
              )}
            </div>
          )}

          <div className="card settings-card">
            <h3>Configuración de Cuenta</h3>
            <ul>
              <li>Editar Información</li>
              <li>Notificaciones</li>
              <li className="logout" onClick={handleLogout} style={{ cursor: 'pointer' }}>Cerrar Sesión</li>
            </ul>
          </div>
        </div>

        <div className="right-column">
          <div className="tabs">
            <span className={tab === 'reservas'    ? 'active-tab' : ''} onClick={() => setTab('reservas')}    style={{ cursor: 'pointer' }}>Mis Reservas</span>
            <span className={tab === 'favoritos'   ? 'active-tab' : ''} onClick={() => setTab('favoritos')}   style={{ cursor: 'pointer' }}>Mis Favoritos</span>
            <span className={tab === 'facturacion' ? 'active-tab' : ''} onClick={() => setTab('facturacion')} style={{ cursor: 'pointer' }}>Datos de Facturación</span>
          </div>

          {tab === 'reservas' && (
            <>
              <h2>Historial de Actividad</h2>
              {loading ? <p style={{ color: '#8892a4' }}>Cargando...</p> : reservas.length === 0 ? (
                <p style={{ color: '#8892a4', textAlign: 'center', marginTop: 40 }}>No tenés reservas todavía.</p>
              ) : reservas.map((r) => (
                <div key={r._id} className="reservation-card">
                  <div className="reservation-info">
                    <h3>{r.court?.name}</h3>
                    <p><strong>Cancha:</strong> {r.court?.name}</p>
                    <p><strong>Fecha:</strong> {formatFecha(r.date)}</p>
                    <p><strong>Horario:</strong> {r.startTime} - {r.endTime}</p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                    <span className={`status ${STATUS_CLASS[r.status] || r.status}`}>{STATUS_LABEL[r.status] || r.status}</span>
                    {(r.status === 'pending' || r.status === 'confirmed') && (
                      <button onClick={() => handleCancelar(r._id)} style={{ fontSize: 12, color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}>
                        Cancelar
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </>
          )}

          {tab === 'favoritos' && (
            <>
              <h2>Mis Favoritos</h2>
              {favoritos.length === 0 ? (
                <p style={{ color: '#8892a4', textAlign: 'center', marginTop: 40 }}>No tenés favoritos guardados.</p>
              ) : favoritos.map((c) => (
                <div key={c._id} className="reservation-card" onClick={() => navigate(`/complejo/${c._id}`)} style={{ cursor: 'pointer' }}>
                  {c.image && <img src={c.image} alt={c.name} style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8 }} />}
                  <div className="reservation-info">
                    <h3>{c.name}</h3>
                    <p>{c.city}</p>
                    <p>⭐ {c.ratingAverage?.toFixed(1) || '0.0'}</p>
                  </div>
                </div>
              ))}
            </>
          )}

          {tab === 'facturacion' && (
            <>
              <h2>Datos de Facturación</h2>
              <p style={{ color: '#8892a4', marginTop: 16 }}>Nombre: <strong style={{ color: '#fff' }}>{user?.name}</strong></p>
              <p style={{ color: '#8892a4', marginTop: 8 }}>Email: <strong style={{ color: '#fff' }}>{user?.email}</strong></p>
              <p style={{ color: '#8892a4', marginTop: 8 }}>Rol: <strong style={{ color: '#fff', textTransform: 'capitalize' }}>{user?.role}</strong></p>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
