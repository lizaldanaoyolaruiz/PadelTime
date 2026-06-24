
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Building2, Layers, CalendarDays,
  CreditCard, Clock, LogOut, Star, BarChart2, LineChart, Trophy, Menu, X
} from 'lucide-react';
import useAuthStore from '../../store/authStore';
import { confirmLogout } from '../../utils/alerts';
import { getMyComplex } from '../../services/complexService';
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
          <span className="brand-name">PadelSaaS</span>
          <span className="brand-sub">Owner Dashboard</span>
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
          <div className="sidebar-user">
            <div className="sidebar-avatar">{initials}</div>
            <div className="sidebar-user-info">
              <span className="sidebar-user-name">{user?.name || 'Owner'}</span>
              <span className="sidebar-user-club">Administrador</span>
            </div>
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
