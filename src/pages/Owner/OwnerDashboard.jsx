
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Building2, Layers, CalendarDays,
  CreditCard, Clock, LogOut, Star, BarChart2, LineChart
} from 'lucide-react';
import useAuthStore from '../../store/authStore';
import { confirmLogout } from '../../utils/alerts';
import GeneralPanel  from './components/GeneralPanel';
import MyComplex     from './components/MyComplex';
import MyCourts      from './components/MyCourts';
import PaymentConfig from './components/PaymentConfig';
import Reviews       from './components/Reviews';
import Reports       from './components/Reports';
import MetricsPanel  from '../Metrics/Metrics';
import './OwnerDashboard.css';

const NAV = [
  { id: 'panel',       label: 'Panel General',          Icon: LayoutDashboard },
  { id: 'complejo',    label: 'Mi Complejo',            Icon: Building2 },
  { id: 'canchas',     label: 'Mis Canchas',            Icon: Layers },
  { id: 'reservas',    label: 'Reservas Hoy',           Icon: CalendarDays },
  { id: 'reportes',    label: 'Reportes',               Icon: BarChart2 },
  { id: 'metricas',    label: 'Métricas',               Icon: LineChart },
  { id: 'pagos',       label: 'Configuración de Pagos', Icon: CreditCard },
  { id: 'horarios',    label: 'Horarios',               Icon: Clock },
  { id: 'valoraciones', label: 'Valoraciones',          Icon: Star },
];

const PANELS = {
  panel:        <GeneralPanel />,
  complejo:     <MyComplex />,
  canchas:      <MyCourts />,
  reportes:     <Reports />,
  metricas:     <MetricsPanel />,
  pagos:        <PaymentConfig />,
  valoraciones: <Reviews />,
};

export default function OwnerDashboard() {
  const [active, setActive] = useState('panel');
  const { user, logout }    = useAuthStore();
  const navigate            = useNavigate();

  const handleLogout = async () => {
    const result = await confirmLogout();
    if (!result.isConfirmed) return;
    logout();
    navigate('/login');
  };

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : 'OW';

  return (
    <div className="owner-layout">
      <aside className="owner-sidebar">
        <div className="sidebar-brand">
          <span className="brand-name">PadelSaaS</span>
          <span className="brand-sub">Owner Dashboard</span>
        </div>
        <nav className="sidebar-nav">
          {NAV.map(({ id, label, Icon, path }) => (
            <button
              key={id}
              className={`nav-item${active === id ? ' active' : ''}`}
              onClick={() => path ? navigate(path) : setActive(id)}
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
        {PANELS[active] ?? (
          <div className="coming-soon">
            <h3>Próximamente</h3>
            <p>Esta sección estará disponible pronto.</p>
          </div>
        )}
      </main>
    </div>
  );
}