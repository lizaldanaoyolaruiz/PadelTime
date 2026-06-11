import { useState, useEffect } from 'react';
import { Search, Download, Plus, Shield } from 'lucide-react';
import { getAllComplexes } from '../../services/complexService';
import { FILTERS, STATUS_MAP } from './utils/constants';
import { StatCards }         from './components/StatCards';
import { ComplexTable }      from './components/ComplexTable';
import { ComplexMobileList } from './components/ComplexMobileList';
import { ChartSection }      from './components/ChartSection';
import { DetailDrawer }      from './components/DetailDrawer';
import { NewComplexModal }   from './components/NewComplexModal';
import { ActionModals }      from './components/ActionModals';
import './GestionComplejos.css';

export default function GestionComplejos() {
  const [complexes,    setComplexes]    = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [searchTerm,   setSearchTerm]   = useState('');
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [selectedComplex, setSelectedComplex] = useState(null);
  const [showDetail,   setShowDetail]   = useState(false);
  const [showNewModal, setShowNewModal] = useState(false);
  const [actionModal,  setActionModal]  = useState({ open: false, type: null, complex: null });

  useEffect(() => {
    getAllComplexes().then(res => {
      setComplexes(res.data);
      setLoading(false);
    });
  }, []);

  // ── Derived ──────────────────────────────────────────────────────────────────

  const pendingCount = complexes.filter(c => c.status === 'PENDING').length;

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

  // ── Handlers ─────────────────────────────────────────────────────────────────

  const openDetail  = (complex) => { setSelectedComplex(complex); setShowDetail(true); };
  const closeDetail = () => setShowDetail(false);

  const openAction  = (type, complex) => setActionModal({ open: true, type, complex });
  const closeAction = () => setActionModal({ open: false, type: null, complex: null });

  const handleDrawerAction = (type, complex) => { closeDetail(); openAction(type, complex); };

  const handleStatusUpdate = (id, status, extra = {}) =>
    setComplexes(prev => prev.map(c => c.id === id ? { ...c, status, ...extra } : c));

  const handleComplexCreated = (newComplex) =>
    setComplexes(prev => [newComplex, ...prev]);

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="gc-wrap">

      {/* Header */}
      <div className="gc-header">
        <div className="gc-header-left">
          <div className="gc-super-badge">
            <Shield size={13} />
            <span>Super Administrador</span>
          </div>
          <h2 className="gc-title">Panel de Control</h2>
          <p className="gc-subtitle">
            {loading ? 'Cargando datos...' : 'Bienvenido de nuevo. Hay '}
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
          <button className="gc-btn-primary" onClick={() => setShowNewModal(true)}>
            <Plus size={15} />
            <span>Nuevo Club</span>
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <StatCards complexes={complexes} loading={loading} />

      {/* Table Section */}
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

        <ComplexTable
          filtered={filtered}
          loading={loading}
          onDetail={openDetail}
          onAction={openAction}
        />

        <ComplexMobileList
          filtered={filtered}
          loading={loading}
          onDetail={openDetail}
          onAction={openAction}
        />

        {!loading && filtered.length > 0 && (
          <div className="gc-table-footer">
            Mostrando {filtered.length} de {complexes.length} resultados
          </div>
        )}
      </div>

      {/* Chart + Activity */}
      <ChartSection />

      {/* Overlays */}
      {showDetail && selectedComplex && (
        <DetailDrawer
          complex={selectedComplex}
          onClose={closeDetail}
          onAction={handleDrawerAction}
        />
      )}

      {showNewModal && (
        <NewComplexModal
          onClose={() => setShowNewModal(false)}
          onCreated={handleComplexCreated}
        />
      )}

      <ActionModals
        modal={actionModal}
        onClose={closeAction}
        onStatusUpdate={handleStatusUpdate}
      />

    </div>
  );
}
