import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Building2, Layers, CalendarDays,
  CreditCard, Clock, LogOut,
} from 'lucide-react';
import useAuthStore from '../../store/authStore';
import PanelGeneral from './panels/PanelGeneral';
import MiComplejo   from './panels/MiComplejo';
import MisCanchas   from './panels/MisCanchas';
import ConfigPagos  from './panels/ConfigPagos';
import './OwnerDashboard.css';

const NAV = [
  { id: 'panel',    label: 'Panel General',         Icon: LayoutDashboard },
  { id: 'complejo', label: 'Mi Complejo',            Icon: Building2 },
  { id: 'canchas',  label: 'Mis Canchas',            Icon: Layers },
  { id: 'reservas', label: 'Reservas Hoy',           Icon: CalendarDays },
  { id: 'pagos',    label: 'Configuración de Pagos', Icon: CreditCard },
  { id: 'horarios', label: 'Horarios',               Icon: Clock },
];

const PANELS = {
  panel:    <PanelGeneral />,
  complejo: <MiComplejo />,
  canchas:  <MisCanchas />,
  pagos:    <ConfigPagos />,
};

export default function OwnerDashboard() {
  const [active, setActive] = useState('panel');
  const { user, logout }    = useAuthStore();
  const navigate            = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  const initials = user?.nombre
    ? user.nombre.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : 'OW';

  return (
    <div className="owner-layout">
      {/* ── Sidebar ── */}
      <aside className="owner-sidebar">
        <div className="sidebar-brand">
          <span className="brand-name">PadelSaaS</span>
          <span className="brand-sub">Owner Dashboard</span>
        </div>

        <nav className="sidebar-nav">
          {NAV.map(({ id, label, Icon }) => (
            <button
              key={id}
              className={`nav-item${active === id ? ' active' : ''}`}
              onClick={() => setActive(id)}
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
              <span className="sidebar-user-name">{user?.nombre || 'Owner'}</span>
              <span className="sidebar-user-club">{user?.club || 'Mi Club'}</span>
            </div>
          </div>
          <button className="btn-logout" onClick={handleLogout} title="Cerrar sesión">
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
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
