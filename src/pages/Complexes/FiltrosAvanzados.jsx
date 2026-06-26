import { SlidersHorizontal, ChevronDown } from 'lucide-react';

const PRECIO_MIN_ARS = 1000;
const PRECIO_MAX_ARS = 100000;
const CIUDADES = ['San Miguel de Tucumán', 'Yerba Buena', 'Tafí Viejo'];

const FiltrosAvanzados = ({
  searchQuery,
  ciudadSeleccionada,
  precioMax,
  tiposSeleccionados,
  totalActivos,
  tiposDisponibles = [],
  onChangeSearch,
  onChangeCiudad,
  onChangePrecio,
  onToggleTipo,
  onReset,
}) => {
  const pctFill = ((precioMax - PRECIO_MIN_ARS) / (PRECIO_MAX_ARS - PRECIO_MIN_ARS)) * 100;

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

      {/* Ciudad */}
      <div className="filtro-seccion">
        <p className="filtro-seccion-titulo">Ciudad</p>
        <div className="filtro-ciudad-wrapper">
          <select
            className="filtro-ciudad-select"
            value={ciudadSeleccionada}
            onChange={(e) => onChangeCiudad(e.target.value)}
          >
            <option value="">Todas las ciudades</option>
            {CIUDADES.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
          <ChevronDown size={13} className="filtro-ciudad-chevron" />
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
            step={1000}
            value={precioMax}
            onChange={(e) => onChangePrecio(Number(e.target.value))}
          />
        </div>

        <div className="precio-limites">
          <span>$1.000</span>
          <span>$100.000</span>
        </div>
      </div>

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
    </aside>
  );
};

export default FiltrosAvanzados;
