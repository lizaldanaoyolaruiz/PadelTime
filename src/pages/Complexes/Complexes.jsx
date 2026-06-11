import { useState, useMemo } from 'react';
import { MapPin, Star, Search, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import './complexes.css';

// TODO: Conectar con useEffect y fetch al endpoint GET /api/complexes
// useEffect(() => {
//   fetch('/api/complexes')
//     .then(res => res.json())
//     .then(data => setComplexes(data));
// }, []);

const initialComplexes = [
  {
    id: 1,
    name: 'Madrid Padel Center',
    image: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&q=80&w=600&h=320',
    location: 'Distrito Centro, Madrid',
    city: 'Madrid',
    surface: 'Cristal',
    rating: 4.9,
    isFeatured: true,
    status: 'aprobado',
    features: ['8 Pistas', 'Cafetería', 'Parking'],
  },
  {
    id: 2,
    name: 'Sky Padel Club',
    image: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&q=80&w=600&h=320',
    location: 'Diagonal, Barcelona',
    city: 'Barcelona',
    surface: 'Césped artificial',
    rating: 4.7,
    isFeatured: true,
    status: 'aprobado',
    features: ['12 Pistas', 'Gimnasio', 'Pro Shop'],
  },
  {
    id: 3,
    name: 'Elite Padel Valencia',
    image: 'https://images.unsplash.com/photo-1574629810360-7efbb1925536?auto=format&fit=crop&q=80&w=600&h=320',
    location: 'Puerto, Valencia',
    city: 'Valencia',
    surface: 'Cristal',
    rating: 4.8,
    isFeatured: true,
    status: 'aprobado',
    features: ['6 Pistas', 'Restaurante'],
  },
  {
    id: 4,
    name: 'Sevilla Padel Arena',
    image: 'https://images.unsplash.com/photo-1596727147705-61a532a659bd?auto=format&fit=crop&q=80&w=600&h=320',
    location: 'Triana, Sevilla',
    city: 'Sevilla',
    surface: 'Césped artificial',
    rating: 4.5,
    isFeatured: false,
    status: 'aprobado',
    features: ['4 Pistas', 'Vestuarios', 'Cafetería'],
  },
  {
    id: 5,
    name: 'Norte Padel Bilbao',
    image: 'https://images.unsplash.com/photo-1545459720-aac8509eb82d?auto=format&fit=crop&q=80&w=600&h=320',
    location: 'Indautxu, Bilbao',
    city: 'Bilbao',
    surface: 'Moqueta',
    rating: 4.6,
    isFeatured: false,
    status: 'aprobado',
    features: ['5 Pistas', 'Parking', 'Clases'],
  },
  {
    id: 6,
    name: 'Costa Padel Málaga',
    image: 'https://images.unsplash.com/photo-1568495248636-6432b97bd949?auto=format&fit=crop&q=80&w=600&h=320',
    location: 'Centro, Málaga',
    city: 'Málaga',
    surface: 'Cristal',
    rating: 4.4,
    isFeatured: false,
    status: 'aprobado',
    features: ['3 Pistas', 'Tienda', 'Duchas'],
  },
  {
    id: 7,
    name: 'Zaragoza Padel Club',
    image: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&q=80&w=600&h=320',
    location: 'Actur, Zaragoza',
    city: 'Zaragoza',
    surface: 'Césped artificial',
    rating: 4.3,
    isFeatured: false,
    status: 'pendiente',
    features: ['6 Pistas', 'Cafetería'],
  },
  {
    id: 8,
    name: 'Central Padel Granada',
    image: 'https://images.unsplash.com/photo-1519766304817-4f37bda74a26?auto=format&fit=crop&q=80&w=600&h=320',
    location: 'Albaicín, Granada',
    city: 'Granada',
    surface: 'Moqueta',
    rating: 4.2,
    isFeatured: false,
    status: 'pendiente',
    features: ['4 Pistas', 'Parking'],
  },
];

const CITIES = ['Todas las ciudades', 'Madrid', 'Barcelona', 'Valencia', 'Sevilla', 'Bilbao', 'Málaga', 'Zaragoza', 'Granada'];
const SURFACES = ['Cualquier superficie', 'Cristal', 'Césped artificial', 'Moqueta'];

const ComplexCard = ({ complex }) => (
  <article className="complex-card">
    <div className="card-image-wrapper">
      <img src={complex.image} alt={complex.name} className="card-img" loading="lazy" />
      {complex.isFeatured && <span className="badge-top-rated">TOP RATED</span>}
    </div>
    <div className="card-body">
      <div className="card-title-row">
        <h3 className="card-name">{complex.name}</h3>
        <span className="card-rating">
          <Star size={14} fill="currentColor" />
          {complex.rating}
        </span>
      </div>
      <p className="card-location">
        <MapPin size={13} />
        {complex.location}
      </p>
      <div className="card-features">
        {complex.features.map((f) => (
          <span key={f} className="feature-tag">{f}</span>
        ))}
      </div>

      <Link to={`/complejo/${complex.id}`} className="btn-disponibilidad">
        Ver Disponibilidad
        <ChevronDown size={15} />
      </Link>
    </div>
  </article>
);

const Complexes = () => {
  const [complexes] = useState(initialComplexes);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('Todas las ciudades');
  const [selectedSurface, setSelectedSurface] = useState('Cualquier superficie');

  const approvedComplexes = useMemo(
    () => complexes.filter((c) => c.status === 'aprobado'),
    [complexes]
  );

  const filteredComplexes = useMemo(() => {
    return approvedComplexes.filter((c) => {
      const matchesName = c.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCity = selectedCity === 'Todas las ciudades' || c.city === selectedCity;
      const matchesSurface = selectedSurface === 'Cualquier superficie' || c.surface === selectedSurface;
      return matchesName && matchesCity && matchesSurface;
    });
  }, [approvedComplexes, searchQuery, selectedCity, selectedSurface]);

  const featuredComplexes = useMemo(
    () => approvedComplexes.filter((c) => c.isFeatured),
    [approvedComplexes]
  );

  const handleSearch = (e) => {
    e.preventDefault();
  };

  return (
    <div className="complejos-page">
      <Navbar />

      <section className="search-hero">
        <div className="hero-content">
          <h1 className="hero-title">Encuentra tu pista ideal</h1>
          <p className="hero-subtitle">
            Explora los mejores complejos deportivos y reserva en segundos con disponibilidad en tiempo real.
          </p>

          <form className="search-filters" onSubmit={handleSearch}>
            <div className="filter-group">
              <label className="filter-label">NOMBRE</label>
              <div className="filter-input-wrapper">
                <Search size={16} className="filter-icon" />
                <input
                  type="text"
                  className="filter-input"
                  placeholder="Buscar por nombre..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="filter-group">
              <label className="filter-label">CIUDAD</label>
              <div className="filter-select-wrapper">
                <MapPin size={16} className="filter-icon" />
                <select
                  className="filter-select"
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                >
                  {CITIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <ChevronDown size={16} className="filter-chevron" />
              </div>
            </div>

            <div className="filter-group">
              <label className="filter-label">TIPO DE CANCHA</label>
              <div className="filter-select-wrapper">
                <Search size={16} className="filter-icon" />
                <select
                  className="filter-select"
                  value={selectedSurface}
                  onChange={(e) => setSelectedSurface(e.target.value)}
                >
                  {SURFACES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <ChevronDown size={16} className="filter-chevron" />
              </div>
            </div>

            <button type="submit" className="btn-buscar">
              <Search size={18} />
              Buscar Clubes
            </button>
          </form>
        </div>
      </section>

      {featuredComplexes.length > 0 && (
        <section className="catalog-section featured-section" id="destacados">
          <div className="section-header">
            <div>
              <h2 className="section-title">Complejos Destacados</h2>
              <p className="section-subtitle">Seleccionados por su excelencia y calidad.</p>
            </div>
          </div>
          <div className="complexes-grid">
            {featuredComplexes.map((c) => (
              <ComplexCard key={c.id} complex={c} />
            ))}
          </div>
        </section>
      )}

      <section className="catalog-section" id="catalogo">
        <div className="section-header">
          <div>
            <h2 className="section-title">Catálogo Completo</h2>
            <p className="section-subtitle">
              {filteredComplexes.length} complejo{filteredComplexes.length !== 1 ? 's' : ''} disponible{filteredComplexes.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {filteredComplexes.length > 0 ? (
          <div className="complexes-grid">
            {filteredComplexes.map((c) => (
              <ComplexCard key={c.id} complex={c} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>No se encontraron complejos con los filtros aplicados.</p>
            <button
              className="btn-clear"
              onClick={() => { setSearchQuery(''); setSelectedCity('Todas las ciudades'); setSelectedSurface('Cualquier superficie'); }}
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default Complexes;
