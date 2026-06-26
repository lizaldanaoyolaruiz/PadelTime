import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock } from 'lucide-react';
import { getPublicComplexes } from '../services/complexService';

const mapClub = (c) => ({
  id: c._id,
  name: c.name,
  image: c.image || c.photos?.[0] || null,
  price: (c.precioPorHora || c.price) ? `$${Number(c.precioPorHora || c.price).toLocaleString('es-AR')}/h` : null,
  location: [c.city, c.location].filter(Boolean).join(' — '),
  time: c.openTime && c.closeTime ? `${c.openTime} – ${c.closeTime}` : 'Consultar horarios',
  rating: c.ratingAverage ? `${c.ratingAverage} (${c.ratingCount || 0} reseñas)` : null,
});

const ClubsSection = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPublicComplexes()
      .then(res => {
        const data = res.data?.complexes ?? (Array.isArray(res.data) ? res.data : []);
        setClubs(data.slice(0, 3).map(mapClub));
      })
      .catch(() => setClubs([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !clubs.length) return null;

  return (
    <section className="featured-clubs" id="clubes">
      <div className="section-header">
        <div className="section-title">
          <h2>Clubes Destacados</h2>
          <p>Seleccionados por su excelencia y calidad técnica.</p>
        </div>
        <Link to="/complejos" className="view-all">Ver todos los clubes →</Link>
      </div>

      <div className="clubs-grid">
        {clubs.map((club) => (
          <div className="club-card" key={club.id}>
            <div className="club-image-container">
              <img
                src={club.image || 'https://res.cloudinary.com/dabikk5ei/image/upload/padeltime/assets/logo_white.png'}
                alt={club.name}
                className={`club-image${club.image ? '' : ' club-image--logo'}`}
                loading="lazy"
              />
              <span className="badge-admin" title="Este club ha sido verificado por nuestro equipo.">✓ VERIFICADO</span>
            </div>
            <div className="club-info">
              <div className="club-title-row">
                <h3>{club.name}</h3>
                {club.price && <span className="club-price">{club.price}</span>}
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
    </section>
  );
};

export default ClubsSection;
