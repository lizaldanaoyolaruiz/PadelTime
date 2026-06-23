import { Search, SlidersHorizontal, X } from 'lucide-react';

const PRECIO_MIN_ARS = 1000;
const PRECIO_MAX_ARS = 6000;

const FiltrosAvanzados = ({
  searchQuery,
  precioMax,
  fecha,
  franjasSeleccionadas,
  tiposSeleccionados,
  totalActivos,
  tiposDisponibles = [],
  franjasDisponibles = [],
  onChangeSearch,
  onChangePrecio,
  onChangeFecha,
  onToggleFranja,
  onToggleTipo,
  onReset,
}) => {
  const pctFill = ((precioMax - PRECIO_MIN_ARS) / (PRECIO_MAX_ARS - PRECIO_MIN_ARS)) * 100;
  const hoy = new Date().toISOString().split('T')[0];

  const fechaLabel = fecha
    ? new Date(fecha + 'T00:00:00').toLocaleDateString('es-AR', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
      })
    : '';

  return (
    <aside className="filtros-sidebar">
      <div className="filtros-header">
        <div className="filtros-titulo">
          <SlidersHorizontal size={15} />
          Filtros
          {totalActivos > 0 && <span className="filtros-badge">{totalActivos}</span>}
        </div>
        {totalActivos > 0 && (
          <button className="filtros-reset-btn" onClick={onReset}>
            Restablecer todo
          </button>
        )}
      </div>

      {/* Búsqueda por nombre o ciudad */}
      <div className="filtro-seccion">
        <div className="filtro-search-wrapper">
          <Search size={14} className="filtro-search-icon" />
          <input
            type="text"
            className="filtro-search-input"
            placeholder="Nombre o ciudad..."
            value={searchQuery}
            onChange={(e) => onChangeSearch(e.target.value)}
          />
          {searchQuery && (
            <button className="filtro-clear-btn" onClick={() => onChangeSearch('')}>
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Precio por hora */}
      <div className="filtro-seccion">
        <p className="filtro-seccion-titulo">Precio por hora ($)</p>
        <div className="precio-valor-row">
          <span className="precio-valor-actual">${precioMax.toLocaleString('es-AR')}+</span>
        </div>

        <div className="precio-slider-container">
          <div className="precio-track">
            <div className="precio-track-fill" style={{ width: `${pctFill}%` }} />
          </div>
          <input
            type="range"
            className="precio-range"
            min={PRECIO_MIN_ARS}
            max={PRECIO_MAX_ARS}
            step={500}
            value={precioMax}
            onChange={(e) => onChangePrecio(Number(e.target.value))}
          />
        </div>

        <div className="precio-limites">
          <span>$1.000</span>
          <span>$6.000</span>
        </div>
      </div>

      {/* Franja Horaria — solo se muestra si hay franjas en los datos */}
      {franjasDisponibles.length > 0 && (
        <div className="filtro-seccion">
          <p className="filtro-seccion-titulo">Franja Horaria</p>
          <div className="franja-grid">
            {franjasDisponibles.map(franja => {
              const activo = franjasSeleccionadas.includes(franja);
              return (
                <button
                  key={franja}
                  type="button"
                  className={activo ? 'franja-btn activo' : 'franja-btn'}
                  onClick={() => onToggleFranja(franja)}
                >
                  {franja}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Tipo de Pista — solo se muestra si hay tipos en los datos */}
      {tiposDisponibles.length > 0 && (
        <div className="filtro-seccion">
          <p className="filtro-seccion-titulo">Tipo de Pista</p>
          {tiposDisponibles.map(tipo => {
            const seleccionado = tiposSeleccionados.includes(tipo);
            return (
              <label
                key={tipo}
                className={seleccionado ? 'filtro-checkbox-label checked' : 'filtro-checkbox-label'}
              >
                <input
                  type="checkbox"
                  checked={seleccionado}
                  onChange={() => onToggleTipo(tipo)}
                />
                <span className="checkbox-custom" />
                {tipo}
              </label>
            );
          })}
        </div>
      )}

      {/* Disponibilidad por fecha */}
      <div className="filtro-seccion">
        <p className="filtro-seccion-titulo">Disponibilidad</p>
        <div className="filtro-fecha-wrapper">
          <input
            type="date"
            className="filtro-fecha"
            value={fecha}
            min={hoy}
            onChange={(e) => onChangeFecha(e.target.value)}
          />
          {fecha && (
            <button
              className="filtro-clear-btn"
              onClick={() => onChangeFecha('')}
              title="Quitar fecha"
            >
              <X size={12} />
            </button>
          )}
        </div>
        {fecha && <p className="filtro-fecha-hint">Disponibles el {fechaLabel}</p>}
      </div>
    </aside>
  );
};

export default FiltrosAvanzados;
