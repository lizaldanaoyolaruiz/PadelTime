import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import api from '../../services/axios';
import './ManagementPanel.css';

const ROLE_LABELS = {
  admin:      'Administrador',
  superadmin: 'Super Admin',
  player:     'Jugador',
};

export default function ManagementPanel() {
  const [users,   setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState('');

  useEffect(() => {
    api.get('/admin/users')
      .then(res => setUsers(res.data.users || []))
      .catch(err => console.error('Error cargando usuarios:', err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="panel-loading">Cargando usuarios...</div>;

  return (
    <div className="complexes-page">
      <div className="table-container">
        <div className="table-header">
          <h2>Gestión de Usuarios</h2>
          <div className="search-box">
            <Search size={18} />
            <input
              type="text"
              placeholder="Buscar por nombre o email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <p style={{ color: 'var(--color-text-muted)', padding: '24px' }}>
            No hay usuarios registrados.
          </p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Fecha de registro</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u._id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{ROLE_LABELS[u.role] ?? u.role}</td>
                  <td>
                    <span className={`badge ${u.isVerified ? 'active' : 'inactive'}`}>
                      {u.isVerified ? 'Verificado' : 'Pendiente'}
                    </span>
                  </td>
                  <td>
                    {u.createdAt
                      ? new Date(u.createdAt).toLocaleDateString('es-AR')
                      : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
