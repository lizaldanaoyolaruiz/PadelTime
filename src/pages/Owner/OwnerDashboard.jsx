
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Building2, Layers, CalendarDays,
  CreditCard, Clock, LogOut, Star, BarChart2, LineChart, Trophy, Menu, X, Camera
} from 'lucide-react';
import useAuthStore from '../../store/authStore';
import { confirmLogout } from '../../utils/alerts';
import { getMyComplex } from '../../services/complexService';
import api from '../../services/axios';
import GeneralPanel   from './components/GeneralPanel';
import MyComplex      from './components/MyComplex';
import MyCourts       from './components/MyCourts';
import PaymentConfig  from './components/PaymentConfig';
import Reviews        from './components/Reviews';
import Reports        from './components/Reports';
import MetricsPanel    from '../Metrics/Metrics';
import ReservasHoyPanel from './components/ReservasHoyPanel';
import TorneosList      from './components/TorneosList';
import { ScheduleManager } from '../Schedule/ScheduleManager';
import './OwnerDashboard.css';

const NAV = [
  { id: 'panel',        label: 'Panel General',          Icon: LayoutDashboard },
  { id: 'complejo',     label: 'Mi Complejo',            Icon: Building2 },
  { id: 'canchas',      label: 'Mis Canchas',            Icon: Layers },
  { id: 'reservas',     label: 'Reservas',               Icon: CalendarDays },
  { id: 'torneos',      label: 'Torneos',                Icon: Trophy },
  { id: 'reportes',     label: 'Reportes',               Icon: BarChart2 },
  { id: 'metricas',     label: 'Métricas',               Icon: LineChart },
  { id: 'pagos',        label: 'Configuración de Pagos', Icon: CreditCard },
  { id: 'horarios',     label: 'Horarios',               Icon: Clock },
  { id: 'valoraciones', label: 'Valoraciones',           Icon: Star },
];

export default function OwnerDashboard() {
  const [active,    setActive]    = useState('panel');
  const [complexId, setComplexId] = useState(null);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const { user, logout } = useAuthStore();
  const navigate         = useNavigate();

  useEffect(() => {
    getMyComplex()
      .then(res => {
        const c = res.data.complex || res.data;
        if (c?._id) setComplexId(c._id);
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    const result = await confirmLogout();
    if (!result.isConfirmed) return;
    logout();
    navigate('/login');
  };

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : 'OW';

  const fileInputRef = useRef(null);

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append('photo', file);
      const res = await api.post('/auth/me/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const { token } = useAuthStore.getState();
      useAuthStore.getState().setAuth(res.data.user, token);
    } catch (err) {
      console.error('Error subiendo avatar:', err);
    } finally {
      e.target.value = '';
    }
  };

  const panels = {
    panel:        <GeneralPanel    key={complexId} complexId={complexId} />,
    complejo:     <MyComplex />,
    canchas:      <MyCourts />,
    reservas:     <ReservasHoyPanel key={complexId} complexId={complexId} />,
    torneos:      <TorneosList />,
    reportes:     <Reports         key={complexId} complexId={complexId} />,
    metricas:     <MetricsPanel />,
    pagos:        <PaymentConfig />,
    horarios:     <ScheduleManager />,
    valoraciones: <Reviews />,
  };

  const navigate_ = (id) => {
    setActive(id);
    setMenuOpen(false);
  };

  return (
    <div className="owner-layout">
      {/* Overlay mobile */}
      {menuOpen && (
        <div className="sidebar-overlay" onClick={() => setMenuOpen(false)} />
      )}

      <aside className={`owner-sidebar${menuOpen ? ' owner-sidebar--open' : ''}`}>
        <div className="sidebar-brand">
          <div
            className="sidebar-profile-avatar-wrap"
            onClick={() => fileInputRef.current?.click()}
            title="Cambiar foto de perfil"
            style={{ cursor: 'pointer', position: 'relative', width: 64, height: 64, margin: '0 auto 10px' }}
          >
            {user?.avatar
              ? <img src={user.avatar} alt="avatar" style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', border: '2px solid #bef264' }} />
              : <div className="sidebar-avatar" style={{ width: 64, height: 64, fontSize: '1.4rem', margin: 0 }}>{initials}</div>
            }
            <div style={{ position: 'absolute', bottom: 0, right: 0, background: '#bef264', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Camera size={11} color="#000" />
            </div>
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarChange} />
          <span className="brand-name" style={{ fontSize: '1rem' }}>{user?.name || 'Owner'}</span>
          <span className="brand-sub">Administrador</span>
        </div>

        <nav className="sidebar-nav">
          {NAV.map(({ id, label, Icon, path }) => (
            <button
              key={id}
              className={`nav-item${active === id ? ' active' : ''}`}
              onClick={() => path ? navigate(path) : navigate_(id)}
            >
              <Icon size={18} />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user-info" style={{ flex: 1 }}>
            <span className="sidebar-user-name">Owner Dashboard</span>
            <span className="sidebar-user-club">Administrador</span>
          </div>
          <button className="btn-logout" onClick={handleLogout} title="Cerrar sesión">
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      <main className="owner-main">
        {/* Hamburger button — solo visible en mobile */}
        <button
          className="sidebar-hamburger"
          onClick={() => setMenuOpen(o => !o)}
          aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {panels[active] ?? (
          <div className="coming-soon">
            <h3>Próximamente</h3>
            <p>Esta sección estará disponible pronto.</p>
          </div>
        )}
      </main>
    </div>
  );
}
