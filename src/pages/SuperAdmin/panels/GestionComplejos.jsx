import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
  Search, CheckCircle, XCircle, PauseCircle, Eye,
  Building2, Users, Clock, Download, Plus,
  MapPin, Phone, Mail, Calendar, X, TrendingUp,
  AlertTriangle, UserPlus, Shield,
} from 'lucide-react';
import {
  getAllComplexes,
  approveComplex,
  rejectComplex,
  suspendComplex,
  sendApprovalEmail,
  sendRejectionEmail,
} from '../../../services/complexService';
import './GestionComplejos.css';

// ── Constants ─────────────────────────────────────────────────────────────────

const FILTERS = [
  { key: 'ALL',       label: 'Todos'       },
  { key: 'PENDING',   label: 'Pendientes'  },
  { key: 'APPROVED',  label: 'Aprobados'   },
  { key: 'REJECTED',  label: 'Rechazados'  },
  { key: 'SUSPENDED', label: 'Suspendidos' },
];

const STATUS_MAP = {
  PENDING:   { label: 'Pendiente',  cls: 'badge--pending'   },
  APPROVED:  { label: 'Aprobado',   cls: 'badge--approved'  },
  REJECTED:  { label: 'Rechazado',  cls: 'badge--rejected'  },
  SUSPENDED: { label: 'Suspendido', cls: 'badge--suspended' },
};

const AVATAR_COLORS = [
  '#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B',
  '#10B981', '#6366F1', '#EF4444', '#14B8A6',
];

const CHART_DATA = [
  { label: 'SEM 1', value: 28 },
  { label: 'SEM 2', value: 44 },
  { label: 'SEM 3', value: 72 },
  { label: 'SEM 4', value: 58 },
];

const RECENT_ACTIVITY = [
  { Icon: UserPlus,      colorCls: 'activity--user',     title: 'Nuevo usuario registrado',  detail: 'Carlos G. se unió como Jugador Pro en Club Madrid.',        time: 'hace 5 min'   },
  { Icon: CheckCircle,   colorCls: 'activity--approved',  title: 'Club Aprobado',              detail: 'Padel Hub Sevilla ha sido activado correctamente.',          time: 'hace 2 horas' },
  { Icon: AlertTriangle, colorCls: 'activity--error',     title: 'Fallo en Pago',              detail: "Error en la renovación automática de 'Elite Padel'.",        time: 'hace 4 horas' },
];

// ── Utilities ─────────────────────────────────────────────────────────────────

function avatarColor(name) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const [y, m, d] = dateStr.split('-');
  return `${d}/${m}/${y}`;
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StatusBadge({ status }) {
  const { label, cls } = STATUS_MAP[status] || { label: status, cls: '' };
  return <span className={`gc-badge ${cls}`}>{label}</span>;
}

function ComplexAvatar({ name }) {
  const letter = name?.[0]?.toUpperCase() || '?';
  return (
    <div className="gc-avatar" style={{ background: avatarColor(name || '') }}>
      {letter}
    </div>
  );
}

function SkeletonRow() {
  return (
    <tr>
      {[...Array(6)].map((_, i) => (
        <td key={i}><div className="gc-skeleton" /></td>
      ))}
    </tr>
  );
}

function SkeletonStatCard() {
  return (
    <div className="gc-stat-card">
      <div className="gc-skeleton" style={{ width: 44, height: 44, borderRadius: 10, marginBottom: 12 }} />
      <div className="gc-skeleton" style={{ width: 60, height: 28, marginBottom: 8, borderRadius: 6 }} />
      <div className="gc-skeleton" style={{ width: 100, height: 14, borderRadius: 4 }} />
    </div>
  );
}

function SkeletonMobileCard() {
  return (
    <div className="gc-mobile-card">
      <div className="gc-skeleton" style={{ height: 72, borderRadius: 8 }} />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="gc-empty">
      <div className="gc-empty-icon">
        <Building2 size={38} />
      </div>
      <h3>No se encontraron complejos</h3>
      <p>Intenta ajustar los filtros o el término de búsqueda.</p>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function GestionComplejos() {
  const [complexes,    setComplexes]    = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [searchTerm,   setSearchTerm]   = useState('');
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [selectedComplex, setSelectedComplex] = useState(null);
  const [showDetail,   setShowDetail]   = useState(false);
  const [actionModal,  setActionModal]  = useState({ open: false, type: null, complex: null });
  const [rejectReason, setRejectReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    getAllComplexes().then(res => {
      setComplexes(res.data);
      setLoading(false);
    });
  }, []);

  // ── Derived values ──────────────────────────────────────────────────────────

  const pendingCount   = complexes.filter(c => c.status === 'PENDING').length;
  const approvedCount  = complexes.filter(c => c.status === 'APPROVED').length;
  const rejectedCount  = complexes.filter(c => c.status === 'REJECTED').length;
  const suspendedCount = complexes.filter(c => c.status === 'SUSPENDED').length;

  const filtered = complexes.filter(c => {
    const term = searchTerm.toLowerCase().trim();
    const matchesSearch = !term ||
      c.name.toLowerCase().includes(term)  ||
      c.email.toLowerCase().includes(term) ||
      c.owner.toLowerCase().includes(term) ||
      c.city.toLowerCase().includes(term)  ||
      (STATUS_MAP[c.status]?.label || '').toLowerCase().includes(term);
    const matchesFilter = activeFilter === 'ALL' || c.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const STAT_CARDS = [
    { label: 'Total Complejos', value: complexes.length, color: '#60A5FA', Icon: Building2,   trend: '+12% vs mes anterior', up: true  },
    { label: 'Aprobados',       value: approvedCount,    color: '#84CC16', Icon: CheckCircle,  trend: '+8.4% vs mes anterior', up: true  },
    { label: 'Pendientes',      value: pendingCount,     color: '#F59E0B', Icon: Clock,        trend: null,                    up: false },
    { label: 'Suspendidos',     value: suspendedCount,   color: '#94A3B8', Icon: PauseCircle,  trend: null,                    up: false },
  ];

  const chartMax = Math.max(...CHART_DATA.map(d => d.value));

  // ── Handlers ────────────────────────────────────────────────────────────────

  const openDetail = (complex) => { setSelectedComplex(complex); setShowDetail(true); };
  const closeDetail = () => setShowDetail(false);

  const openAction = (type, complex) => {
    setActionModal({ open: true, type, complex });
    setRejectReason('');
  };
  const closeAction = () => setActionModal({ open: false, type: null, complex: null });

  const updateStatus = (id, status, extra = {}) =>
    setComplexes(prev => prev.map(c => c.id === id ? { ...c, status, ...extra } : c));

  const handleApprove = async () => {
    const { complex } = actionModal;
    setActionLoading(true);
    try {
      await approveComplex(complex.id);
      await sendApprovalEmail(complex.id);
      updateStatus(complex.id, 'APPROVED');
      toast.success('Complejo aprobado correctamente.');
      toast.success('Email enviado al owner notificando aprobación.');
      closeAction();
    } catch {
      toast.error('Error al aprobar el complejo.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    const { complex } = actionModal;
    setActionLoading(true);
    try {
      await rejectComplex(complex.id, rejectReason);
      await sendRejectionEmail(complex.id);
      updateStatus(complex.id, 'REJECTED', { observations: rejectReason });
      toast.success('Complejo rechazado.');
      toast.success('Email enviado al owner notificando rechazo.');
      closeAction();
    } catch {
      toast.error('Error al rechazar el complejo.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSuspend = async () => {
    const { complex } = actionModal;
    setActionLoading(true);
    try {
      await suspendComplex(complex.id);
      updateStatus(complex.id, 'SUSPENDED');
      toast.success('Complejo suspendido correctamente.');
      closeAction();
    } catch {
      toast.error('Error al suspender el complejo.');
    } finally {
      setActionLoading(false);
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="gc-wrap">

      {/* ── Header ── */}
      <div className="gc-header">
        <div className="gc-header-left">
          <div className="gc-super-badge">
            <Shield size={13} />
            <span>Super Administrador</span>
          </div>
          <h2 className="gc-title">Panel de Control</h2>
          <p className="gc-subtitle">
            {loading
              ? 'Cargando datos...'
              : `Bienvenido de nuevo. Hay `}
            {!loading && (
              <strong className="gc-subtitle-highlight">
                {pendingCount} solicitud{pendingCount !== 1 ? 'es' : ''}
              </strong>
            )}
            {!loading && ' pendientes de revisión.'}
          </p>
        </div>
        <div className="gc-header-actions">
          <button className="gc-btn-outline">
            <Download size={15} />
            <span>Exportar Reporte</span>
          </button>
          <button className="gc-btn-primary">
            <Plus size={15} />
            <span>Nuevo Club</span>
          </button>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="gc-stats-row">
        {loading
          ? [...Array(4)].map((_, i) => <SkeletonStatCard key={i} />)
          : STAT_CARDS.map(({ label, value, color, Icon, trend, up }) => (
            <div key={label} className="gc-stat-card">
              <div className="gc-stat-icon" style={{ background: `${color}1a`, color }}>
                <Icon size={22} />
              </div>
              <div className="gc-stat-value">{value}</div>
              <div className="gc-stat-label">{label}</div>
              {trend && (
                <div className={`gc-stat-trend${up ? ' trend--up' : ' trend--down'}`}>
                  <TrendingUp size={11} />
                  <span>{trend}</span>
                </div>
              )}
            </div>
          ))
        }
      </div>

      {/* ── Table Section ── */}
      <div className="gc-table-section">
        <div className="gc-table-top">
          <div className="gc-table-title-row">
            <h3 className="gc-table-title">
              Solicitudes de Nuevos Clubes
              {!loading && pendingCount > 0 && (
                <span className="gc-table-badge">{pendingCount} PENDIENTES</span>
              )}
            </h3>
            <div className="gc-search-wrap">
              <Search size={15} className="gc-search-icon" />
              <input
                type="text"
                className="gc-search-input"
                placeholder="Buscar por nombre, ciudad o estado..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                aria-label="Buscar complejo"
              />
            </div>
          </div>

          <div className="gc-filters" role="tablist" aria-label="Filtrar complejos">
            {FILTERS.map(({ key, label }) => (
              <button
                key={key}
                role="tab"
                aria-selected={activeFilter === key}
                className={`gc-filter-btn${activeFilter === key ? ' active' : ''}`}
                onClick={() => setActiveFilter(key)}
              >
                {label}
                {key !== 'ALL' && !loading && (
                  <span className="gc-filter-count">
                    {complexes.filter(c => c.status === key).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Desktop Table */}
        <div className="gc-table-wrap">
          <table className="gc-table">
            <thead>
              <tr>
                <th>Complejo</th>
                <th>Owner</th>
                <th>Ubicación</th>
                <th>Fecha Registro</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? [...Array(5)].map((_, i) => <SkeletonRow key={i} />)
                : filtered.length === 0
                  ? (
                    <tr>
                      <td colSpan={6} style={{ padding: 0 }}>
                        <EmptyState />
                      </td>
                    </tr>
                  )
                  : filtered.map(complex => (
                    <tr
                      key={complex.id}
                      className="gc-table-row"
                      style={{ cursor: 'pointer' }}
                      onClick={() => openDetail(complex)}
                    >
                      <td>
                        <div className="gc-complex-cell">
                          <ComplexAvatar name={complex.name} />
                          <span className="gc-complex-name">{complex.name}</span>
                        </div>
                      </td>
                      <td>
                        <div className="gc-owner-cell">
                          <span className="gc-owner-name">{complex.owner}</span>
                          <span className="gc-owner-email">{complex.email}</span>
                        </div>
                      </td>
                      <td>
                        <span className="gc-location">{complex.city}, {complex.province}</span>
                      </td>
                      <td>
                        <span className="gc-date">{formatDate(complex.registeredAt)}</span>
                      </td>
                      <td>
                        <StatusBadge status={complex.status} />
                      </td>
                      <td onClick={e => e.stopPropagation()}>
                        <div className="gc-row-actions">
                          <button
                            className="gc-action-btn gc-action-btn--view"
                            onClick={() => openDetail(complex)}
                            title="Ver detalle"
                            aria-label="Ver detalle"
                          >
                            <Eye size={14} />
                          </button>
                          {complex.status === 'PENDING' && (
                            <>
                              <button
                                className="gc-action-btn gc-action-btn--approve"
                                onClick={() => openAction('approve', complex)}
                                title="Aprobar"
                                aria-label="Aprobar complejo"
                              >
                                <CheckCircle size={14} />
                              </button>
                              <button
                                className="gc-action-btn gc-action-btn--reject"
                                onClick={() => openAction('reject', complex)}
                                title="Rechazar"
                                aria-label="Rechazar complejo"
                              >
                                <XCircle size={14} />
                              </button>
                            </>
                          )}
                          {complex.status === 'APPROVED' && (
                            <button
                              className="gc-action-btn gc-action-btn--suspend"
                              onClick={() => openAction('suspend', complex)}
                              title="Suspender"
                              aria-label="Suspender complejo"
                            >
                              <PauseCircle size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
              }
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="gc-mobile-list">
          {loading
            ? [...Array(4)].map((_, i) => <SkeletonMobileCard key={i} />)
            : filtered.length === 0
              ? <EmptyState />
              : filtered.map(complex => (
                <div
                  key={complex.id}
                  className="gc-mobile-card"
                  onClick={() => openDetail(complex)}
                >
                  <div className="gc-mobile-card-top">
                    <ComplexAvatar name={complex.name} />
                    <div className="gc-mobile-card-info">
                      <span className="gc-mobile-card-name">{complex.name}</span>
                      <span className="gc-mobile-card-location">
                        <MapPin size={11} />
                        {complex.city}, {complex.province}
                      </span>
                    </div>
                    <StatusBadge status={complex.status} />
                  </div>
                  <div className="gc-mobile-card-meta">
                    <span><Users size={11} /> {complex.owner}</span>
                    <span><Calendar size={11} /> {formatDate(complex.registeredAt)}</span>
                  </div>
                  <div className="gc-mobile-card-actions" onClick={e => e.stopPropagation()}>
                    <button
                      className="gc-action-btn gc-action-btn--view"
                      onClick={() => openDetail(complex)}
                    >
                      <Eye size={13} /> Ver
                    </button>
                    {complex.status === 'PENDING' && (
                      <>
                        <button
                          className="gc-action-btn gc-action-btn--approve"
                          onClick={() => openAction('approve', complex)}
                        >
                          <CheckCircle size={13} /> Aprobar
                        </button>
                        <button
                          className="gc-action-btn gc-action-btn--reject"
                          onClick={() => openAction('reject', complex)}
                        >
                          <XCircle size={13} /> Rechazar
                        </button>
                      </>
                    )}
                    {complex.status === 'APPROVED' && (
                      <button
                        className="gc-action-btn gc-action-btn--suspend"
                        onClick={() => openAction('suspend', complex)}
                      >
                        <PauseCircle size={13} /> Suspender
                      </button>
                    )}
                  </div>
                </div>
              ))
          }
        </div>

        {!loading && filtered.length > 0 && (
          <div className="gc-table-footer">
            Mostrando {filtered.length} de {complexes.length} resultados
          </div>
        )}
      </div>

      {/* ── Bottom Section: Chart + Activity ── */}
      <div className="gc-bottom-row">
        {/* Network growth chart */}
        <div className="gc-chart-card">
          <div className="gc-chart-card-header">
            <div>
              <h3 className="gc-card-title">Crecimiento de la Red</h3>
              <p className="gc-card-subtitle">Evolución de registros semanales</p>
            </div>
            <span className="gc-chart-period">Últimos 30 días</span>
          </div>
          <div className="gc-bar-chart">
            {CHART_DATA.map(({ label, value }) => (
              <div key={label} className="gc-bar-col">
                <div
                  className="gc-bar"
                  style={{ height: `${(value / chartMax) * 100}%` }}
                  title={`${value} registros`}
                />
                <span className="gc-bar-label">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent activity */}
        <div className="gc-activity-card">
          <div className="gc-activity-header">
            <h3 className="gc-card-title">Actividad Reciente</h3>
            <button className="gc-link-btn">Ver todo</button>
          </div>
          <div className="gc-activity-list">
            {RECENT_ACTIVITY.map(({ Icon, colorCls, title, detail, time }) => (
              <div key={title} className="gc-activity-item">
                <div className={`gc-activity-icon ${colorCls}`}>
                  <Icon size={15} />
                </div>
                <div className="gc-activity-content">
                  <span className="gc-activity-title">{title}</span>
                  <span className="gc-activity-detail">{detail}</span>
                  <span className="gc-activity-time">{time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Detail Drawer ── */}
      {showDetail && selectedComplex && (
        <>
          <div className="gc-overlay" onClick={closeDetail} aria-hidden="true" />
          <aside className="gc-drawer" role="dialog" aria-label="Detalle del complejo">
            <div className="gc-drawer-header">
              <div className="gc-drawer-title-row">
                <ComplexAvatar name={selectedComplex.name} />
                <div>
                  <h3 className="gc-drawer-name">{selectedComplex.name}</h3>
                  <StatusBadge status={selectedComplex.status} />
                </div>
              </div>
              <button className="gc-drawer-close" onClick={closeDetail} aria-label="Cerrar">
                <X size={20} />
              </button>
            </div>

            <div className="gc-drawer-body">
              <div className="gc-drawer-section">
                <h4 className="gc-drawer-section-title">Información del Complejo</h4>
                <div className="gc-drawer-grid">
                  <div className="gc-drawer-field">
                    <span className="gc-drawer-field-label">Nombre</span>
                    <span className="gc-drawer-field-value">{selectedComplex.name}</span>
                  </div>
                  <div className="gc-drawer-field">
                    <span className="gc-drawer-field-label">Pistas</span>
                    <span className="gc-drawer-field-value">{selectedComplex.courts}</span>
                  </div>
                  <div className="gc-drawer-field gc-drawer-field--full">
                    <span className="gc-drawer-field-label"><MapPin size={12} /> Dirección</span>
                    <span className="gc-drawer-field-value">{selectedComplex.address}</span>
                  </div>
                  <div className="gc-drawer-field">
                    <span className="gc-drawer-field-label">Ciudad</span>
                    <span className="gc-drawer-field-value">{selectedComplex.city}</span>
                  </div>
                  <div className="gc-drawer-field">
                    <span className="gc-drawer-field-label">Provincia</span>
                    <span className="gc-drawer-field-value">{selectedComplex.province}</span>
                  </div>
                  <div className="gc-drawer-field">
                    <span className="gc-drawer-field-label"><Calendar size={12} /> Fecha Registro</span>
                    <span className="gc-drawer-field-value">{formatDate(selectedComplex.registeredAt)}</span>
                  </div>
                  <div className="gc-drawer-field">
                    <span className="gc-drawer-field-label">Estado Actual</span>
                    <StatusBadge status={selectedComplex.status} />
                  </div>
                </div>
              </div>

              <div className="gc-drawer-section">
                <h4 className="gc-drawer-section-title">Datos del Owner</h4>
                <div className="gc-drawer-grid">
                  <div className="gc-drawer-field">
                    <span className="gc-drawer-field-label"><Users size={12} /> Nombre</span>
                    <span className="gc-drawer-field-value">{selectedComplex.owner}</span>
                  </div>
                  <div className="gc-drawer-field">
                    <span className="gc-drawer-field-label"><Mail size={12} /> Email</span>
                    <span className="gc-drawer-field-value">{selectedComplex.email}</span>
                  </div>
                  <div className="gc-drawer-field">
                    <span className="gc-drawer-field-label"><Phone size={12} /> Teléfono</span>
                    <span className="gc-drawer-field-value">{selectedComplex.phone}</span>
                  </div>
                </div>
              </div>

              {selectedComplex.observations && (
                <div className="gc-drawer-section">
                  <h4 className="gc-drawer-section-title">Observaciones</h4>
                  <p className="gc-drawer-observations">{selectedComplex.observations}</p>
                </div>
              )}

              <div className="gc-drawer-section">
                <h4 className="gc-drawer-section-title">Fotos del Complejo</h4>
                <div className="gc-photos-placeholder">
                  <Building2 size={28} />
                  <span>Las fotos estarán disponibles una vez conectado al backend.</span>
                </div>
              </div>
            </div>

            <div className="gc-drawer-footer">
              {selectedComplex.status === 'PENDING' && (
                <>
                  <button
                    className="gc-drawer-action-btn gc-drawer-action-btn--approve"
                    onClick={() => { closeDetail(); openAction('approve', selectedComplex); }}
                  >
                    <CheckCircle size={15} /> Aprobar
                  </button>
                  <button
                    className="gc-drawer-action-btn gc-drawer-action-btn--reject"
                    onClick={() => { closeDetail(); openAction('reject', selectedComplex); }}
                  >
                    <XCircle size={15} /> Rechazar
                  </button>
                </>
              )}
              {selectedComplex.status === 'APPROVED' && (
                <button
                  className="gc-drawer-action-btn gc-drawer-action-btn--suspend"
                  onClick={() => { closeDetail(); openAction('suspend', selectedComplex); }}
                >
                  <PauseCircle size={15} /> Suspender
                </button>
              )}
              <button className="gc-drawer-action-btn gc-drawer-action-btn--close" onClick={closeDetail}>
                Cerrar
              </button>
            </div>
          </aside>
        </>
      )}

      {/* ── Action Modals ── */}
      {actionModal.open && (
        <div className="gc-modal-overlay" role="dialog" aria-modal="true">
          <div className="gc-modal">
            {actionModal.type === 'approve' && (
              <>
                <div className="gc-modal-icon gc-modal-icon--approve">
                  <CheckCircle size={30} />
                </div>
                <h3 className="gc-modal-title">Aprobar Complejo</h3>
                <p className="gc-modal-text">
                  ¿Desea aprobar <strong>{actionModal.complex?.name}</strong>?
                  Se enviará un email de confirmación al owner.
                </p>
                <div className="gc-modal-actions">
                  <button className="gc-modal-btn gc-modal-btn--cancel" onClick={closeAction} disabled={actionLoading}>
                    Cancelar
                  </button>
                  <button className="gc-modal-btn gc-modal-btn--approve" onClick={handleApprove} disabled={actionLoading}>
                    {actionLoading ? 'Aprobando...' : 'Sí, aprobar'}
                  </button>
                </div>
              </>
            )}

            {actionModal.type === 'reject' && (
              <>
                <div className="gc-modal-icon gc-modal-icon--reject">
                  <XCircle size={30} />
                </div>
                <h3 className="gc-modal-title">Rechazar Complejo</h3>
                <p className="gc-modal-text">
                  Vas a rechazar <strong>{actionModal.complex?.name}</strong>.
                  Puedes incluir el motivo de rechazo (opcional).
                </p>
                <textarea
                  className="gc-modal-textarea"
                  placeholder="Motivo del rechazo (opcional)..."
                  value={rejectReason}
                  onChange={e => setRejectReason(e.target.value)}
                  rows={3}
                  aria-label="Motivo del rechazo"
                />
                <div className="gc-modal-actions">
                  <button className="gc-modal-btn gc-modal-btn--cancel" onClick={closeAction} disabled={actionLoading}>
                    Cancelar
                  </button>
                  <button className="gc-modal-btn gc-modal-btn--reject" onClick={handleReject} disabled={actionLoading}>
                    {actionLoading ? 'Rechazando...' : 'Sí, rechazar'}
                  </button>
                </div>
              </>
            )}

            {actionModal.type === 'suspend' && (
              <>
                <div className="gc-modal-icon gc-modal-icon--suspend">
                  <PauseCircle size={30} />
                </div>
                <h3 className="gc-modal-title">Suspender Complejo</h3>
                <p className="gc-modal-text">
                  Este complejo dejará de visualizarse en el portal <strong>inmediatamente</strong>.
                  ¿Confirmas la suspensión de <strong>{actionModal.complex?.name}</strong>?
                </p>
                <div className="gc-modal-actions">
                  <button className="gc-modal-btn gc-modal-btn--cancel" onClick={closeAction} disabled={actionLoading}>
                    Cancelar
                  </button>
                  <button className="gc-modal-btn gc-modal-btn--suspend" onClick={handleSuspend} disabled={actionLoading}>
                    {actionLoading ? 'Suspendiendo...' : 'Sí, suspender'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
