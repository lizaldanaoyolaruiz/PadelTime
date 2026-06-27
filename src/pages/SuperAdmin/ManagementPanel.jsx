import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Search, Bell, Settings, Building2, CalendarDays, Users,
  DollarSign, TrendingUp, TrendingDown, Pencil, Trash2,
  ChevronLeft, ChevronRight, X, UserCircle, Filter, Download,
} from 'lucide-react';
import api from '../../services/axios';
import useAuthStore from '../../store/authStore';
import './ManagementPanel.css';

const PER_PAGE = 10;

export default function ManagementPanel({ triggerCreate = 0 }) {
  const { user: authUser } = useAuthStore();

  const [owners, setOwners]           = useState([]);
  const [stats, setStats]             = useState(null);
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [page, setPage]               = useState(1);

  const [modal, setModal]             = useState(null);
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [detailOwner, setDetailOwner] = useState(null);
  const [form, setForm]               = useState({ name: '', email: '', password: '', location: '' });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError]     = useState('');

  const prevTriggerRef = useRef(0);

  // ── Data ─────────────────────────────────────────────────────────────────────

  const fetchOwners = useCallback(async () => {
    try {
      setLoading(true);
      const res  = await api.get('/admin/users');
      const all  = res.data.users || res.data || [];
      setOwners(all.filter(u => u.role !== 'superadmin'));
    } catch (err) {
      console.error('Error cargando owners:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const res = await api.get('/admin/stats');
      setStats(res.data);
    } catch {
      setStats({});
    }
  }, []);

  useEffect(() => { fetchOwners(); fetchStats(); }, [fetchOwners, fetchStats]);

  // Open create modal when parent triggers it
  useEffect(() => {
    if (triggerCreate !== prevTriggerRef.current) {
      prevTriggerRef.current = triggerCreate;
      if (triggerCreate > 0) openCreate();
    }
  }, [triggerCreate]);

  // ── Derived ───────────────────────────────────────────────────────────────────

  // 'approved' = activo, cualquier otro (pending/rejected/suspended) = inactivo
  const isActive = (o) => o.status === 'approved';

  const filtered = owners.filter(o => {
    const term = search.toLowerCase();
    const matchSearch = !term ||
      (o.name  || '').toLowerCase().includes(term) ||
      (o.email || '').toLowerCase().includes(term);
    const matchStatus =
      filterStatus === 'all'      ? true :
      filterStatus === 'active'   ? isActive(o) :
      !isActive(o);
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  // ── Handlers ──────────────────────────────────────────────────────────────────

  const closeModal = () => { setModal(null); setSelectedOwner(null); setFormError(''); };

  const openCreate = () => {
    setForm({ name: '', email: '', password: '', location: '' });
    setFormError('');
    setModal('create');
  };

  const openEdit = (owner) => {
    setSelectedOwner(owner);
    setForm({
      name:     owner.name     || '',
      email:    owner.email    || '',
      password: '',
      location: owner.location || owner.city || '',
    });
    setFormError('');
    setModal('edit');
  };

  const openDelete = (owner) => { setSelectedOwner(owner); setModal('delete'); };

  const handleCreate = async () => {
    if (!form.name || !form.email || !form.password) {
      setFormError('Nombre, email y contraseña son obligatorios.');
      return;
    }
    try {
      setFormLoading(true);
      const res = await api.post('/admin/users', { ...form, role: 'admin' });
      setOwners(prev => [res.data.user || res.data, ...prev]);
      closeModal();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Error al crear el propietario.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = async () => {
    if (!form.name || !form.email) {
      setFormError('Nombre y email son obligatorios.');
      return;
    }
    try {
      setFormLoading(true);
      const payload = { name: form.name, email: form.email, location: form.location };
      if (form.password) payload.password = form.password;
      const res = await api.put(`/admin/users/${selectedOwner._id}`, payload);
      const updated = res.data.user || res.data;
      setOwners(prev => prev.map(o => o._id === selectedOwner._id ? { ...o, ...updated } : o));
      closeModal();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Error al actualizar.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setFormLoading(true);
      await api.delete(`/admin/users/${selectedOwner._id}`);
      setOwners(prev => prev.filter(o => o._id !== selectedOwner._id));
      closeModal();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Error al eliminar.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleToggleStatus = async (owner) => {
    const newStatus = isActive(owner) ? 'suspended' : 'approved';
    try {
      await api.patch(`/admin/users/${owner._id}/status`, { status: newStatus });
      setOwners(prev =>
        prev.map(o => o._id === owner._id ? { ...o, status: newStatus } : o)
      );
    } catch (err) {
      console.error('Error cambiando estado:', err);
    }
  };

  const formatDate = (d) => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  // ── Stats cards data ──────────────────────────────────────────────────────────

  const activeCount = owners.filter(isActive).length;

  const statCards = [
    {
      label: 'TOTAL COMPLEJOS',
      value: stats?.totalComplexes ?? '—',
      trend: '+12%', up: true,
      Icon: Building2, color: '#60A5FA', bar: 75,
    },
    {
      label: 'RESERVAS MES',
      value: stats?.monthlyReservations
        ? stats.monthlyReservations.toLocaleString('es-ES')
        : '—',
      trend: '+8%', up: true,
      Icon: CalendarDays, color: '#34D399', bar: 60,
    },
    {
      label: 'USUARIOS ACTIVOS',
      value: stats?.activeUsers
        ? `${(stats.activeUsers / 1000).toFixed(1)}k`
        : activeCount,
      trend: '-2%', up: false,
      Icon: Users, color: '#94A3B8', bar: 40,
    },
    {
      label: 'REVENUE ANUAL',
      value: stats?.annualRevenue
        ? `$${(stats.annualRevenue / 1000).toFixed(1)}k`
        : '—',
      trend: '+24%', up: true,
      Icon: DollarSign, color: '#A78BFA', bar: 85,
    },
  ];

  const initials = authUser?.name
    ? authUser.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : 'SA';

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <div className="mp-wrapper">

      {/* ── Top bar ── */}
      <header className="mp-topbar">
        <div className="mp-search">
          <Search size={15} />
          <input
            type="text"
            placeholder="Buscar propietarios, complejos..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <div className="mp-topbar-right">
          <button className="mp-icon-btn" title="Notificaciones"><Bell size={17} /></button>
          <button className="mp-icon-btn" title="Configuración"><Settings size={17} /></button>
          <div className="mp-topbar-divider" />
          <div className="mp-topbar-user">
            <div className="mp-topbar-user-text">
              <span className="mp-topbar-name">{authUser?.name || 'Admin Master'}</span>
              <span className="mp-topbar-role">SUPER ADMIN</span>
            </div>
            <div className="mp-topbar-avatar">{initials}</div>
          </div>
        </div>
      </header>

      <div className="mp-content">

        {/* ── Banner ── */}
        <div className="mp-banner">
          <p className="mp-banner-text">
            Bienvenido al panel de control de <strong>PadelSaaS</strong>.
            Gestioná owners, complejos y estadísticas del sistema.
          </p>
          <button className="mp-export-btn">
            <Download size={15} />
            Exportar Reporte
          </button>
        </div>

        {/* ── Stats ── */}
        <div className="mp-stats-grid">
          {statCards.map(({ label, value, trend, up, Icon, color, bar }) => (
            <div key={label} className="mp-stat-card">
              <div className="mp-stat-top">
                <div className="mp-stat-icon" style={{ background: `${color}22`, color }}>
                  <Icon size={20} />
                </div>
                <span className={`mp-stat-trend ${up ? 'up' : 'down'}`}>
                  {up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                  {trend}
                </span>
              </div>
              <p className="mp-stat-label">{label}</p>
              <p className="mp-stat-value">{value}</p>
              <div className="mp-stat-bar">
                <div
                  className="mp-stat-bar-fill"
                  style={{ width: `${bar}%`, background: up ? '#bef264' : '#475569' }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* ── Table section ── */}
        <div className="mp-table-section">
          <div className="mp-table-header">
            <div className="mp-table-title">
              <h2>Gestión de Owners</h2>
              <span className="mp-badge">{filtered.length} TOTAL</span>
            </div>
            <div className="mp-table-controls">
              <select
                className="mp-select"
                value={filterStatus}
                onChange={e => { setFilterStatus(e.target.value); setPage(1); }}
              >
                <option value="all">Todos los Estados</option>
                <option value="active">Activos</option>
                <option value="suspended">Suspendidos</option>
              </select>
              <button className="mp-filter-icon-btn" title="Más filtros">
                <Filter size={16} />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="mp-state">Cargando propietarios...</div>
          ) : paginated.length === 0 ? (
            <div className="mp-state">No se encontraron propietarios.</div>
          ) : (
            <div className="mp-table-wrapper">
              {/* Tabla desktop: 6 columnas completas */}
              <table className="mp-table mp-table--desktop">
                <thead>
                  <tr>
                    <th>OWNER / AVATAR</th>
                    <th>EMAIL</th>
                    <th>REGISTRO</th>
                    <th>COMPLEJOS</th>
                    <th>ESTADO</th>
                    <th>ACCIONES</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map(owner => (
                    <tr key={owner._id}>
                      <td>
                        <div className="mp-owner-cell">
                          <div className="mp-owner-avatar">
                            {owner.avatar
                              ? <img src={owner.avatar} alt={owner.name} />
                              : <UserCircle size={30} />}
                          </div>
                          <div>
                            <p className="mp-owner-name">{owner.name}</p>
                            <p className="mp-owner-loc">{owner.location || owner.city || '—'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="mp-cell-muted">{owner.email}</td>
                      <td className="mp-cell-muted">{formatDate(owner.createdAt)}</td>
                      <td>
                        <span className="mp-complexes-pill">
                          {owner.complexesCount ?? owner.complexes?.length ?? 0}
                        </span>
                      </td>
                      <td>
                        <span className={`mp-status-badge ${isActive(owner) ? 'active' : 'suspended'}`}>
                          <span className="mp-dot" />
                          {isActive(owner) ? 'ACTIVO' : 'SUSPENDIDO'}
                        </span>
                      </td>
                      <td>
                        <div className="mp-actions">
                          <button className="mp-action-icon" title="Editar" onClick={() => openEdit(owner)}>
                            <Pencil size={14} />
                          </button>
                          <button className="mp-action-icon danger" title="Eliminar" onClick={() => openDelete(owner)}>
                            <Trash2 size={14} />
                          </button>
                          <button
                            className={`mp-action-btn ${isActive(owner) ? 'suspend' : 'activate'}`}
                            onClick={() => handleToggleStatus(owner)}
                          >
                            {isActive(owner) ? 'Suspender' : 'Activar'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Tabla mobile: 2 columnas + fila clickeable para ver detalle */}
              <table className="mp-table mp-table--mobile">
                <thead>
                  <tr>
                    <th>OWNER</th>
                    <th>ESTADO</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map(owner => (
                    <tr key={owner._id} onClick={() => setDetailOwner(owner)} style={{ cursor: 'pointer' }}>
                      <td>
                        <div className="mp-owner-cell">
                          <div className="mp-owner-avatar">
                            {owner.avatar ? <img src={owner.avatar} alt={owner.name} /> : <UserCircle size={30} />}
                          </div>
                          <div>
                            <p className="mp-owner-name">{owner.name}</p>
                            <p className="mp-owner-loc">{owner.location || owner.city || '—'}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`mp-status-badge ${isActive(owner) ? 'active' : 'suspended'}`}>
                          <span className="mp-dot" />
                          {isActive(owner) ? 'ACTIVO' : 'SUSPENDIDO'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="mp-pagination">
              <span className="mp-pagination-info">
                Mostrando {(page - 1) * PER_PAGE + 1} a{' '}
                {Math.min(page * PER_PAGE, filtered.length)} de {filtered.length} resultados
              </span>
              <div className="mp-page-controls">
                <button
                  className="mp-page-btn"
                  onClick={() => setPage(p => p - 1)}
                  disabled={page === 1}
                >
                  <ChevronLeft size={15} />
                </button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    className={`mp-page-btn ${page === p ? 'active' : ''}`}
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </button>
                ))}
                <button
                  className="mp-page-btn"
                  onClick={() => setPage(p => p + 1)}
                  disabled={page === totalPages}
                >
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Create / Edit modal ── */}
      {(modal === 'create' || modal === 'edit') && (
        <div className="mp-overlay" onClick={closeModal}>
          <div className="mp-modal" onClick={e => e.stopPropagation()}>
            <div className="mp-modal-head">
              <h3>{modal === 'create' ? 'Nuevo Propietario' : 'Editar Propietario'}</h3>
              <button className="mp-modal-close" onClick={closeModal}><X size={17} /></button>
            </div>
            <div className="mp-modal-body">
              {formError && <div className="mp-form-error">{formError}</div>}
              <label>Nombre completo</label>
              <input
                type="text"
                placeholder="Ej: Carlos Ruiz"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              />
              <label>Email</label>
              <input
                type="email"
                placeholder="email@ejemplo.com"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              />
              <label>{modal === 'create' ? 'Contraseña' : 'Nueva contraseña (opcional)'}</label>
              <input
                type="password"
                placeholder={modal === 'create' ? 'Mínimo 8 caracteres' : 'Dejar vacío para no cambiar'}
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              />
              <label>Ubicación del Complejo</label>
              <select
                value={form.location}
                onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
              >
                <option value="" disabled>Seleccioná una ciudad...</option>
                <option value="San Miguel de Tucumán">San Miguel de Tucumán</option>
                <option value="Yerba Buena">Yerba Buena</option>
                <option value="Tafí Viejo">Tafí Viejo</option>
              </select>
            </div>
            <div className="mp-modal-foot">
              <button className="mp-btn-cancel" onClick={closeModal}>Cancelar</button>
              <button
                className="mp-btn-primary"
                onClick={modal === 'create' ? handleCreate : handleEdit}
                disabled={formLoading}
              >
                {formLoading
                  ? 'Guardando...'
                  : modal === 'create' ? 'Crear Propietario' : 'Guardar Cambios'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Detail modal ── */}
      {detailOwner && (
        <div className="mp-detail-overlay" onClick={() => setDetailOwner(null)}>
          <div className="mp-detail-modal" onClick={e => e.stopPropagation()}>
            <div className="mp-detail-header">
              <div className="mp-owner-cell">
                <div className="mp-owner-avatar" style={{ width: 48, height: 48 }}>
                  {detailOwner.avatar ? <img src={detailOwner.avatar} alt={detailOwner.name} /> : <UserCircle size={40} />}
                </div>
                <div>
                  <p className="mp-owner-name" style={{ fontSize: 16 }}>{detailOwner.name}</p>
                  <span className={`mp-status-badge ${isActive(detailOwner) ? 'active' : 'suspended'}`}>
                    <span className="mp-dot" />{isActive(detailOwner) ? 'ACTIVO' : 'SUSPENDIDO'}
                  </span>
                </div>
              </div>
              <button className="mp-detail-close" onClick={() => setDetailOwner(null)}><X size={18} /></button>
            </div>

            <div className="mp-detail-body">
              <div className="mp-detail-row"><span>Email</span><strong>{detailOwner.email}</strong></div>
              <div className="mp-detail-row"><span>Registro</span><strong>{formatDate(detailOwner.createdAt)}</strong></div>
              <div className="mp-detail-row"><span>Complejos</span><strong>{detailOwner.complexesCount ?? detailOwner.complexes?.length ?? 0}</strong></div>
              <div className="mp-detail-row"><span>Ciudad</span><strong>{detailOwner.location || detailOwner.city || '—'}</strong></div>
            </div>

            <div className="mp-detail-actions">
              <button className="mp-action-icon" onClick={() => { setDetailOwner(null); openEdit(detailOwner); }}><Pencil size={14} /> Editar</button>
              <button className="mp-action-icon danger" onClick={() => { setDetailOwner(null); openDelete(detailOwner); }}><Trash2 size={14} /> Eliminar</button>
              <button className={`mp-action-btn ${isActive(detailOwner) ? 'suspend' : 'activate'}`} onClick={() => { handleToggleStatus(detailOwner); setDetailOwner(null); }}>
                {isActive(detailOwner) ? 'Suspender' : 'Activar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete modal ── */}
      {modal === 'delete' && (
        <div className="mp-overlay" onClick={closeModal}>
          <div className="mp-modal mp-modal--sm" onClick={e => e.stopPropagation()}>
            <div className="mp-modal-head">
              <h3>Eliminar propietario</h3>
              <button className="mp-modal-close" onClick={closeModal}><X size={17} /></button>
            </div>
            <div className="mp-modal-body">
              {formError && <div className="mp-form-error">{formError}</div>}
              <p className="mp-delete-msg">
                ¿Estás seguro de que deseas eliminar a{' '}
                <strong>{selectedOwner?.name}</strong>?<br />
                Esta acción no se puede deshacer.
              </p>
            </div>
            <div className="mp-modal-foot">
              <button className="mp-btn-cancel" onClick={closeModal}>Cancelar</button>
              <button className="mp-btn-danger" onClick={handleDelete} disabled={formLoading}>
                {formLoading ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
