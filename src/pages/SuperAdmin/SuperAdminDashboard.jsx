import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, Building2,
  LogOut, Plus, Menu, X,
} from 'lucide-react';
import useAuthStore from '../../store/authStore';
import { confirmLogout } from '../../utils/alerts';
import ComplexManagement from './ComplexManagement';
import ManagementPanel from './ManagementPanel';
import './SuperAdminDashboard.css';

const NAV = [
  { id: 'usuarios',  label: 'Usuarios',  Icon: Users     },
  { id: 'complejos', label: 'Complejos', Icon: Building2 },
];

export default function SuperAdminDashboard() {
  const [active, setActive]           = useState('usuarios');
  const [triggerCreate, setTriggerCreate] = useState(0);
  const [menuOpen, setMenuOpen]       = useState(false);
  const { user, logout }              = useAuthStore();
  const navigate                      = useNavigate();

  const handleLogout = async () => {
    const result = await confirmLogout();
    if (!result.isConfirmed) return;
    logout();
    navigate('/login');
  };

  const handleNuevoPropietario = () => {
    setActive('usuarios');
    setTriggerCreate(n => n + 1);
  };

  return (
    <div className="sa-layout">
      {menuOpen && (
        <div className="sa-overlay" onClick={() => setMenuOpen(false)} />
      )}

      {/* ── Sidebar ── */}
      <aside className={`sa-sidebar${menuOpen ? ' sa-sidebar--open' : ''}`}>
        <div className="sa-brand">
          <span className="sa-brand-name">PadelSaaS</span>
          <span className="sa-brand-sub">PANEL DE CONTROL</span>
        </div>

        <nav className="sa-nav">
          {NAV.map(({ id, label, Icon }) => (
            <button
              key={id}
              className={`sa-nav-item${active === id ? ' active' : ''}`}
              onClick={() => { setActive(id); setMenuOpen(false); }}
            >
              <Icon size={17} />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <div className="sa-sidebar-bottom">
          <button className="sa-new-owner-btn" onClick={handleNuevoPropietario}>
            <Plus size={16} />
            <span>Nuevo Propietario</span>
          </button>

          <div className="sa-sidebar-footer">
            <div className="sa-sidebar-user">
              <div className="sa-sidebar-avatar">
                {user?.name
                  ? user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
                  : 'SA'}
              </div>
              <div className="sa-sidebar-user-info">
                <span className="sa-sidebar-user-name">{user?.name || 'Super Admin'}</span>
                <span className="sa-sidebar-user-role">Super Administrador</span>
              </div>
            </div>
            <button className="sa-btn-logout" onClick={handleLogout} title="Cerrar sesión">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="sa-main">
        <button
          className="sa-hamburger"
          onClick={() => setMenuOpen(o => !o)}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {active === 'usuarios'  && (
          <ManagementPanel triggerCreate={triggerCreate} />
        )}
        {active === 'complejos' && (
          <ComplexManagement />
        )}
      </main>
    </div>
  );
}
