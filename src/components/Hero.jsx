import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Search } from 'lucide-react';
import api from '../services/axios';

const Hero = () => {
  const navigate = useNavigate();
  const [ciudades,  setCiudades]  = useState([]);
  const [ciudad,    setCiudad]    = useState('');
  const [open,      setOpen]      = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    api.get('/complexes/cities')
      .then(res => setCiudades(res.data.ciudades || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = () => {
    const params = ciudad ? `?ciudad=${encodeURIComponent(ciudad)}` : '';
    navigate(`/complejos${params}`);
  };

  const opciones = [{ value: '', label: 'Todas las ciudades...' }, ...ciudades.map(c => ({ value: c, label: c }))];
  const labelActual = ciudad || 'Todas las ciudades...';

  return (
    <section className="hero">
      <h1>Lleva tu juego al <span className="highlight">siguiente nivel</span></h1>
      <p>La plataforma definitiva para jugadores que buscan la pista perfecta y clubes que exigen una gestión de alto rendimiento.</p>
      <div className="search-bar">
        <span className="search-icon"><Search size={18} /></span>

        <div ref={dropdownRef} className="hero-dropdown" onClick={() => setOpen(o => !o)}>
          <span className="hero-dropdown-value">{labelActual}</span>
          <ChevronDown size={16} className={`hero-dropdown-chevron${open ? ' open' : ''}`} />

          {open && (
            <ul className="hero-dropdown-list">
              {opciones.map(({ value, label }) => (
                <li
                  key={value}
                  className={`hero-dropdown-item${ciudad === value ? ' selected' : ''}`}
                  onClick={(e) => { e.stopPropagation(); setCiudad(value); setOpen(false); }}
                >
                  {label}
                </li>
              ))}
            </ul>
          )}
        </div>

        <button className="btn-search" onClick={handleSearch}>BUSCAR</button>
      </div>
    </section>
  );
};

export default Hero;
