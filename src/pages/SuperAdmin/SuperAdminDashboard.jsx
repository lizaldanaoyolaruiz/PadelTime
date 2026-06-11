import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, BarChart2, Users, Settings, LogOut, ShieldAlert } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import ComplexManagement from './ComplexManagement';
import './SuperAdminDashboard.css';

const NAV = [
  { id: 'complejos',     label: 'Clubes Pendientes',     Icon: Building2 },
  { id: 'estadisticas',  label: 'Estadísticas Globales', Icon: BarChart2 },
  { id: 'usuarios',      label: 'Gestión de Usuarios',   Icon: Users     },
  { id: 'configuracion', label: 'Configuración',          Icon: Settings  },
];

function AccessDenied() {
  return (
    <div className="sa-access-denied">
      <ShieldAlert size={52} className="sa-access-denied-icon" />
      <h2>Acceso Restringido</h2>
      <p>No tienes permisos para acceder a esta sección.</p>
    </div>
  );
}

export default function SuperAdminDashboard() {
  const [active, setActive] = useState('complejos');
  const { user, logout }    = useAuthStore();
  const navigate            = useNavigate();

  // Prepared for real role guard:
  // if (user?.role !== 'SUPER_ADMIN') return <AccessDenied />;

  const handleLogout = () => { logout(); navigate('/login'); };

  const initials = user?.nombre
    ? user.nombre.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : 'SA';

  return (
    <div className="sa-layout">
      {/* ── Sidebar ── */}
      <aside className="sa-sidebar">
        <div className="sa-brand">
          <span className="sa-brand-name">PadelSaaS</span>
          <span className="sa-brand-badge">ADMIN</span>
        </div>

        <nav className="sa-nav">
          {NAV.map(({ id, label, Icon }) => (
            <button
              key={id}
              className={`sa-nav-item${active === id ? ' active' : ''}`}
              onClick={() => setActive(id)}
            >
              <Icon size={18} />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <div className="sa-sidebar-footer">
          <div className="sa-sidebar-user">
            <div className="sa-sidebar-avatar">{initials}</div>
            <div className="sa-sidebar-user-info">
              <span className="sa-sidebar-user-name">{user?.nombre || 'Super Admin'}</span>
              <span className="sa-sidebar-user-role">Super Administrador</span>
            </div>
          </div>
          <button className="sa-btn-logout" onClick={handleLogout} title="Cerrar sesión">
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="sa-main">
        {active === 'complejos' ? (
          <ComplexManagement />
        ) : (
          <div className="sa-coming-soon">
            <h3>Próximamente</h3>
            <p>Esta sección estará disponible pronto.</p>
          </div>
        )}
      </main>
    </div>
  );
}
