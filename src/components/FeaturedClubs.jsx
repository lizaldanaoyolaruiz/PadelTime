import { Link } from 'react-router-dom';

const FeaturedClubs = () => {
  const clubs = [
    {
      id: 1,
      name: "MARCOS PAZ PADEL",
      image: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&q=80&w=400&h=200",
      price: "$30 000",
      location: "San Miguel De Tucumán",
      time: "07:00 - 23:30",
      rating: "4.9 (120 reseñas)"
    },
    {
      id: 2,
      name: "GUILLERMINA PADEL",
      image: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&q=80&w=400&h=200",
      price: "$25 000",
      location: "San Miguel De Tucumán",
      time: "08:00 - 23:00",
      rating: "4.7 (85 reseñas)"
    },
    {
      id: 3,
      name: "LOMAS PADEL Y EVENTOS",
      image: "https://images.unsplash.com/photo-1574629810360-7efbb1925536?auto=format&fit=crop&q=80&w=400&h=200",
      price: "$18 000",
      location: "Valencia, Marina",
      time: "06:00 - 00:00",
      rating: "4.8 (210 reseñas)"
    }
  ];

  return (
    <section className="featured-clubs" id="clubes">
      <div className="section-header">
        <div className="section-title">
          <h2>Clubes Destacados</h2>
          <p>Seleccionados por su excelencia y calidad técnica.</p>
        </div>
        <a href="/complejos" className="view-all">Ver todos los clubes →</a>
      </div>

      <div className="clubs-grid">
        {clubs.map(club => (
          <div className="club-card" key={club.id}>
            <div className="club-image-container">
              <img src={club.image} alt={club.name} className="club-image" />
              <span
                className="badge-admin"
                title="Este club ha sido verificado y certificado por nuestro equipo."
              >
                ✓ APROBADO POR ADMIN
              </span>
              <span className="badge-rating">☆ {club.rating}</span>
            </div>
            <div className="club-info">
              <div className="club-title-row">
                <h3>{club.name}</h3>
                <span className="club-price">{club.price}</span>
              </div>
              <div className="club-details">
                <p><span>📍</span> {club.location}</p>
                <p><span>🕒</span> {club.time}</p>
              </div>
              <Link to={`/complejo/${club.id}`} className="btn-detail">VER DETALLE</Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedClubs;
