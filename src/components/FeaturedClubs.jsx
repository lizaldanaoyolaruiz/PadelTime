import { useParams, Link, Navigate } from 'react-router-dom';
import { MapPin, Star, Clock, ChevronLeft, ChevronDown, Layers } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import './featuredClubs.css';

// Mock data — mismos IDs que Complexes.jsx
// TODO: Conectar con useEffect y fetch al endpoint GET /api/complexes/:id
// useEffect(() => {
//   fetch(`/api/complexes/${id}`)
//     .then(res => res.json())
//     .then(data => setComplex(data))
//     .catch(() => console.error(`No se pudo cargar el complejo con id ${id}`));
// }, [id]);
const MOCK_COMPLEXES = [
  {
    id: 1,
    name: 'Madrid Padel Center',
    image: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&q=80&w=1200&h=500',
    location: 'Distrito Centro, Madrid',
    surface: 'Cristal',
    rating: 4.9,
    isFeatured: true,
    status: 'aprobado',
    features: ['8 Pistas', 'Cafetería', 'Parking'],
    hours: '07:00 – 23:00',
    priceFrom: 1800,
    description: 'Madrid Padel Center es uno de los complejos más modernos de la capital. Cuenta con 8 pistas de cristal panorámico, cafetería con terraza y parking privado para más de 50 vehículos.',
  },
  {
    id: 2,
    name: 'Sky Padel Club',
    image: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&q=80&w=1200&h=500',
    location: 'Diagonal, Barcelona',
    surface: 'Césped artificial',
    rating: 4.7,
    isFeatured: true,
    status: 'aprobado',
    features: ['12 Pistas', 'Gimnasio', 'Pro Shop'],
    hours: '08:00 – 22:00',
    priceFrom: 2200,
    description: 'Sky Padel Club es el complejo referente de Barcelona, con 12 pistas de césped artificial de última generación, gimnasio totalmente equipado y Pro Shop con las mejores marcas del mercado.',
  },
  {
    id: 3,
    name: 'Elite Padel Valencia',
    image: 'https://images.unsplash.com/photo-1574629810360-7efbb1925536?auto=format&fit=crop&q=80&w=1200&h=500',
    location: 'Puerto, Valencia',
    surface: 'Cristal',
    rating: 4.8,
    isFeatured: true,
    status: 'aprobado',
    features: ['6 Pistas', 'Restaurante'],
    hours: '07:30 – 23:30',
    priceFrom: 1600,
    description: 'Elite Padel Valencia combina deporte y gastronomía en un entorno privilegiado frente al Puerto. Sus 6 pistas de cristal y el restaurante con vistas al mar lo convierten en una experiencia única.',
  },
  {
    id: 4,
    name: 'Sevilla Padel Arena',
    image: 'https://images.unsplash.com/photo-1596727147705-61a532a659bd?auto=format&fit=crop&q=80&w=1200&h=500',
    location: 'Triana, Sevilla',
    surface: 'Césped artificial',
    rating: 4.5,
    isFeatured: false,
    status: 'aprobado',
    features: ['4 Pistas', 'Vestuarios', 'Cafetería'],
    hours: '08:00 – 22:30',
    priceFrom: 1400,
    description: 'Sevilla Padel Arena es el punto de encuentro del pádel en el barrio de Triana. Instalaciones modernas con vestuarios amplios y cafetería con producto local de temporada.',
  },
  {
    id: 5,
    name: 'Norte Padel Bilbao',
    image: 'https://images.unsplash.com/photo-1545459720-aac8509eb82d?auto=format&fit=crop&q=80&w=1200&h=500',
    location: 'Indautxu, Bilbao',
    surface: 'Moqueta',
    rating: 4.6,
    isFeatured: false,
    status: 'aprobado',
    features: ['5 Pistas', 'Parking', 'Clases'],
    hours: '07:00 – 22:00',
    priceFrom: 1500,
    description: 'Norte Padel Bilbao ofrece 5 pistas de moqueta indoor y un programa de clases con entrenadores certificados por la Federación Española de Pádel. Parking gratuito para todos los socios.',
  },
  {
    id: 6,
    name: 'Costa Padel Málaga',
    image: 'https://images.unsplash.com/photo-1568495248636-6432b97bd949?auto=format&fit=crop&q=80&w=1200&h=500',
    location: 'Centro, Málaga',
    surface: 'Cristal',
    rating: 4.4,
    isFeatured: false,
    status: 'aprobado',
    features: ['3 Pistas', 'Tienda', 'Duchas'],
    hours: '08:30 – 21:30',
    priceFrom: 1300,
    description: 'Costa Padel Málaga es un complejo íntimo y acogedor en el corazón de la ciudad. 3 pistas de cristal, tienda de equipamiento multimarca y duchas de agua caliente disponibles todo el día.',
  },
];

const FeaturedClubs = () => {
  const { id } = useParams();

  const complex = MOCK_COMPLEXES.find((c) => c.id === Number(id));

  if (!complex || complex.status !== 'aprobado') {
    return <Navigate to="/complejos" replace />;
  }

  return (
    <div className="detail-wrapper">
      <Navbar />

      <main className="detail-page">
        <div className="detail-back-row">
          <Link to="/complejos" className="btn-back">
            <ChevronLeft size={16} />
            Volver al catálogo
          </Link>
        </div>

        {/* ── Hero ── */}
        <div className="detail-hero">
          <img src={complex.image} alt={complex.name} className="detail-hero-img" />
          <div className="detail-hero-overlay">
            {complex.isFeatured && (
              <span className="detail-badge-top">TOP RATED</span>
            )}
            <h1 className="detail-name">{complex.name}</h1>
            <div className="detail-meta">
              <span className="detail-rating">
                <Star size={15} fill="currentColor" />
                {complex.rating}
              </span>
              <span className="detail-location">
                <MapPin size={15} />
                {complex.location}
              </span>
            </div>
          </div>
        </div>

        {/* ── Content grid ── */}
        <div className="detail-content">

          {/* Columna izquierda — información */}
          <div className="detail-info">
            <p className="detail-description">{complex.description}</p>

            <div className="detail-specs">
              <div className="spec-item">
                <Clock size={18} className="spec-icon" />
                <div>
                  <span className="spec-label">Horario</span>
                  <span className="spec-value">{complex.hours}</span>
                </div>
              </div>
              <div className="spec-item">
                <Layers size={18} className="spec-icon" />
                <div>
                  <span className="spec-label">Superficie</span>
                  <span className="spec-value">{complex.surface}</span>
                </div>
              </div>
            </div>

            <h3 className="features-title">Características</h3>
            <div className="detail-features">
              {complex.features.map((f) => (
                <span key={f} className="detail-feature-tag">{f}</span>
              ))}
            </div>
          </div>

          {/* Columna derecha — panel de reserva */}
          <div className="booking-panel">
            <div className="price-block">
              <span className="price-label">Desde</span>
              <span className="price-value">
                ${complex.priceFrom.toLocaleString('es-AR')}
              </span>
              <span className="price-unit">/ hora</span>
            </div>

            {/* TODO: GET /api/complexes/:id/availability?date=YYYY-MM-DD */}
            {/* Aquí irá el selector de fecha y grilla de turnos disponibles */}
            <div className="availability-placeholder">
              <Clock size={22} className="avail-icon" />
              <p>Seleccioná una fecha para ver los turnos disponibles</p>
            </div>

            <button className="btn-ver-disponibilidad" disabled>
              Ver Disponibilidad
              <ChevronDown size={18} />
            </button>
            <p className="avail-note">Próximamente: reserva en tiempo real</p>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FeaturedClubs;
