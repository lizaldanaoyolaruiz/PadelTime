
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock } from 'lucide-react';

const ClubsSection = () => {
  // 1. Agregamos setClubs y empezamos con un arreglo vacío (o podés dejar el MOCK mientras tanto)
  const [clubs, setClubs] = useState([]);
  // Opcional pero recomendado: un estado para mostrar que está cargando
  const [loading, setLoading] = useState(true);

  // 2. El useEffect activo que va a golpear tu base de datos
  useEffect(() => {
    fetch('/api/complexes?isFeatured=true')
      .then(res => res.json())
      .then(data => {
        setClubs(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error trayendo los clubes:", error);
        setLoading(false);
      });
  }, []);

  return (
    <section className="featured-clubs" id="clubes">
      <div className="section-header">
        <div className="section-title">
          <h2>Clubes Destacados</h2>
          <p>Seleccionados por su excelencia y calidad técnica.</p>
        </div>
        <Link to="/complejos" className="view-all">Ver todos los clubes →</Link>
      </div>

      {/* 3. Un pequeño mensaje de carga mientras el fetch hace su trabajo */}
      {loading ? (
        <p style={{ color: '#94a3b8', textAlign: 'center', padding: '2rem' }}>Cargando clubes...</p>
      ) : (
        <div className="clubs-grid">
          {clubs.map((club) => (
            <div className="club-card" key={club.id}>
              <div className="club-image-container">
                <img src={club.image} alt={club.name} className="club-image" loading="lazy" />
                <span className="badge-admin">✓ APROBADO POR ADMIN</span>
                <span className="badge-rating">☆ {club.rating}</span>
              </div>
              <div className="club-info">
                <div className="club-title-row">
                  <h3>{club.name}</h3>
                  <span className="club-price">{club.price}</span>
                </div>
                <div className="club-details">
                  <p><MapPin size={13} /> {club.location}</p>
                  <p><Clock size={13} /> {club.time}</p>
                </div>
                <Link to={`/complejo/${club.id}`} className="btn-detail">
                  VER DETALLE
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default ClubsSection;