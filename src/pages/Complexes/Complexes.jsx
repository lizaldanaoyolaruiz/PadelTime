import { useState, useMemo, useEffect } from 'react';
import { MapPin, Star, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import FiltrosAvanzados from './FiltrosAvanzados';
import { getPublicComplexes } from '../../services/complexService';
import './complexes.css';

const PLACEHOLDER_IMAGE =
  'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&q=80&w=600&h=320';

// 5 complejos de demo (Tucumán, Argentina) — cubren todos los filtros:
// precio ($1800–$4000), superficie (Cristal/Césped/Moqueta), franja (Mañana/Tarde/Noche/Madrugada)
// En dev se mezclan con datos reales para poder testear.
const COMPLEJOS_MOCK = [
  {
    id: 'mock-1',
    name: 'Padel Club Norte',
    location: 'Av. Mate de Luna 2500, San Miguel de Tucumán',
    city: 'San Miguel de Tucumán',
    surface: 'Cristal',
    price: 2500,
    rating: 4.8,
    isFeatured: true,
    image: PLACEHOLDER_IMAGE,
    features: ['Cristal', 'Techada'],
    availability: ['2026-06-20', '2026-06-22', '2026-06-25'],
    franjas: ['Mañana', 'Tarde'],
  },
  {
    id: 'mock-2',
    name: 'Paddock Tucumán',
    location: 'C. Álvarez 1200, San Miguel de Tucumán',
    city: 'San Miguel de Tucumán',
    surface: 'Cristal',
    price: 4000,
    rating: 4.9,
    isFeatured: true,
    image: PLACEHOLDER_IMAGE,
    features: ['Cristal', 'Techada', 'Iluminación LED'],
    availability: ['2026-06-21', '2026-06-22', '2026-06-26'],
    franjas: ['Mañana', 'Tarde', 'Noche'],
  },
  {
    id: 'mock-3',
    name: 'Yerba Buena Padel',
    location: 'Av. Aconquija 1800, Yerba Buena',
    city: 'Yerba Buena',
    surface: 'Césped artificial',
    price: 3500,
    rating: 4.6,
    isFeatured: true,
    image: PLACEHOLDER_IMAGE,
    features: ['Césped artificial', 'Descubierta'],
    availability: ['2026-06-19', '2026-06-20', '2026-06-26'],
    franjas: ['Tarde', 'Noche'],
  },
  {
    id: 'mock-4',
    name: 'Sport Club Lomas',
    location: 'San Lorenzo 890, Lomas de Tafí',
    city: 'Lomas de Tafí',
    surface: 'Moqueta',
    price: 1800,
    rating: 3.9,
    isFeatured: false,
    image: PLACEHOLDER_IMAGE,
    features: ['Moqueta', 'Techada'],
    availability: ['2026-06-20', '2026-06-23', '2026-06-25'],
    franjas: ['Tarde', 'Madrugada'],
  },
  {
    id: 'mock-5',
    name: 'Club San Javier',
    location: 'Av. Principal 100, San Javier',
    city: 'San Javier',
    surface: 'Césped artificial',
    price: 2800,
    rating: 4.3,
    isFeatured: false,
    image: PLACEHOLDER_IMAGE,
    features: ['Césped artificial', 'Descubierta'],
    availability: ['2026-06-19', '2026-06-21', '2026-06-28'],
    franjas: ['Mañana', 'Madrugada'],
  },
];

const mapComplex = (c) => ({
  id: c._id,
  name: c.name,
  image: c.photos?.[0] || c.image || PLACEHOLDER_IMAGE,
  location: c.location,
  city: c.city,
  surface: c.surface || '',
  rating: c.ratingAverage || 0,
  isFeatured: (c.ratingAverage || 0) >= 4.5 && (c.ratingCount || 0) > 0,
  status: c.status || c.estado || 'pendiente',
  features: c.features || [],
  price: c.precioPorHora || c.price || 0,
  availability: c.availability || [],
  franjas: c.franjas || [],
});

const PRECIO_INICIAL = 6000;

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
          {complex.rating > 0 ? complex.rating.toFixed(1) : '—'}
        </span>
      </div>
      <p className="card-location">
        <MapPin size={13} />
        {complex.location}
      </p>
      {complex.price > 0 && (
        <p className="card-price">
          <span className="card-price-amount">${complex.price.toLocaleString('es-AR')}</span>
          <span className="card-price-label">/hr</span>
        </p>
      )}
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
  const [complexes, setComplexes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Todos los filtros viven en el sidebar
  const [searchQuery, setSearchQuery] = useState('');
  const [precioMax, setPrecioMax] = useState(PRECIO_INICIAL);
  const [fechaSeleccionada, setFechaSeleccionada] = useState('');
  const [franjasSeleccionadas, setFranjasSeleccionadas] = useState([]);
  const [tiposSeleccionados, setTiposSeleccionados] = useState([]);

  useEffect(() => {
    const cargarComplejos = async () => {
      try {
        const res = await getPublicComplexes();
        const data = res.data?.complexes ?? (Array.isArray(res.data) ? res.data : []);
        const apiData = data.length > 0 ? data.map(mapComplex) : [];
        // En desarrollo mezclamos reales + mock para poder probar los filtros
        const todos = import.meta.env.DEV
          ? [...apiData, ...COMPLEJOS_MOCK]
          : (apiData.length > 0 ? apiData : COMPLEJOS_MOCK);
        setComplexes(todos);
      } catch {
        setComplexes(COMPLEJOS_MOCK);
      } finally {
        setLoading(false);
      }
    };
    cargarComplejos();
  }, []);

  const filteredComplexes = useMemo(() => {
    return complexes.filter((c) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        c.name.toLowerCase().includes(q) ||
        (c.city || '').toLowerCase().includes(q);
      // Sin precio declarado (datos del API sin actualizar) → pasa siempre
      const matchesPrice = c.price <= 0 || c.price <= precioMax;
      // Sin disponibilidad declarada → pasa siempre
      const matchesDate =
        !fechaSeleccionada ||
        !c.availability?.length ||
        c.availability.includes(fechaSeleccionada);
      // Sin franjas declaradas → pasa siempre
      const matchesFranja =
        franjasSeleccionadas.length === 0 ||
        !c.franjas?.length ||
        franjasSeleccionadas.some((f) => c.franjas.includes(f));
      // Sin surface declarada → pasa siempre
      const matchesTipo =
        tiposSeleccionados.length === 0 ||
        !c.surface ||
        tiposSeleccionados.includes(c.surface);

      return matchesSearch && matchesPrice && matchesDate && matchesFranja && matchesTipo;
    });
  }, [complexes, searchQuery, precioMax, fechaSeleccionada, franjasSeleccionadas, tiposSeleccionados]);

  const filteredFeatured = useMemo(
    () => filteredComplexes.filter((c) => c.isFeatured),
    [filteredComplexes]
  );

  const filtrosActivos = useMemo(() => {
    let count = 0;
    if (searchQuery) count++;
    if (precioMax < PRECIO_INICIAL) count++;
    if (fechaSeleccionada) count++;
    if (franjasSeleccionadas.length > 0) count++;
    if (tiposSeleccionados.length > 0) count++;
    return count;
  }, [searchQuery, precioMax, fechaSeleccionada, franjasSeleccionadas, tiposSeleccionados]);

  const toggleFranja = (franja) =>
    setFranjasSeleccionadas((prev) =>
      prev.includes(franja) ? prev.filter((f) => f !== franja) : [...prev, franja]
    );

  const toggleTipo = (tipo) =>
    setTiposSeleccionados((prev) =>
      prev.includes(tipo) ? prev.filter((t) => t !== tipo) : [...prev, tipo]
    );

  const resetFiltros = () => {
    setSearchQuery('');
    setPrecioMax(PRECIO_INICIAL);
    setFechaSeleccionada('');
    setFranjasSeleccionadas([]);
    setTiposSeleccionados([]);
  };

  return (
    <div className="complejos-page">
      <Navbar />

      <section className="search-hero">
        <div className="hero-content">
          <h1 className="hero-title">Encuentra tu pista ideal</h1>
          <p className="hero-subtitle">
            Explora los mejores complejos deportivos y reserva en segundos.
          </p>
        </div>
      </section>

      <div className="catalog-layout">
        <FiltrosAvanzados
          searchQuery={searchQuery}
          precioMax={precioMax}
          fecha={fechaSeleccionada}
          franjasSeleccionadas={franjasSeleccionadas}
          tiposSeleccionados={tiposSeleccionados}
          totalActivos={filtrosActivos}
          onChangeSearch={setSearchQuery}
          onChangePrecio={setPrecioMax}
          onChangeFecha={setFechaSeleccionada}
          onToggleFranja={toggleFranja}
          onToggleTipo={toggleTipo}
          onReset={resetFiltros}
        />

        <div className="catalog-main">
          {filteredFeatured.length > 0 && (
            <section className="catalog-section featured-section" id="destacados">
              <div className="section-header">
                <div>
                  <h2 className="section-title">Complejos Destacados</h2>
                  <p className="section-subtitle">Seleccionados por su excelencia y calidad.</p>
                </div>
              </div>
              <div className="complexes-grid">
                {filteredFeatured.map((c) => (
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
                  {filteredComplexes.length} complejo{filteredComplexes.length !== 1 ? 's' : ''}{' '}
                  disponible{filteredComplexes.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>

            {loading ? (
              <div className="empty-state">
                <p>Cargando complejos...</p>
              </div>
            ) : filteredComplexes.length > 0 ? (
              <div className="complexes-grid">
                {filteredComplexes.map((c) => (
                  <ComplexCard key={c.id} complex={c} />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>No se encontraron complejos con los filtros aplicados.</p>
                <button className="btn-clear" onClick={resetFiltros}>
                  Limpiar todos los filtros
                </button>
              </div>
            )}
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Complexes;
