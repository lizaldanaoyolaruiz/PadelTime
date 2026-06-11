import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import './CourtDetail.css';

const CourtDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [cancha, setCancha] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setCancha({
        id: id,
        complejoId: 1,
        name: "Pista Central - World Padel Tour Edition",
        location: "Madrid, Spain",
        status: "Certificado Oficial",
        image: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&q=80&w=1920",
        specs: {
          surface: "Blue WPT Turf",
          lighting: "LED Pro",
          glass: "Panoramic 12mm",
          fence: "Pro Mesh"
        },
        description: "Disfruta de las mismas condiciones que los mejores jugadores del mundo. Nuestra pista central cuenta con el césped oficial del WPT, garantizando un rebote perfecto y máxima tracción.",
        services: [
          "Bolas nuevas Head Pro",
          "Agua mineral fría",
          "Toallas de microfibra",
          "Grabación de partido (Opcional)"
        ],
        gallery: [
          "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&q=80&w=800",
          "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&q=80&w=400",
          "https://images.unsplash.com/photo-1574629810360-7efbb1925536?auto=format&fit=crop&q=80&w=400",
          "https://images.unsplash.com/photo-1526624536643-6c0b39be8eb8?auto=format&fit=crop&q=80&w=400",
          "https://images.unsplash.com/photo-1596727147705-61a532a659bd?auto=format&fit=crop&q=80&w=400"
        ],
        recommended: [
          { id: 101, name: "Marcos Paz PADEL", status: "Disponible ahora", image: "https://images.unsplash.com/photo-1574629810360-7efbb1925536?auto=format&fit=crop&q=80&w=400" },
          { id: 102, name: "Guillermina Padel", status: "Próxima libre: 19:30", image: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&q=80&w=400" },
          { id: 103, name: "Lomas Padel y Eventos", status: "Disponible ahora", image: "https://images.unsplash.com/photo-1526624536643-6c0b39be8eb8?auto=format&fit=crop&q=80&w=400" }
        ]
      });
      setLoading(false);
    }, 800);
  }, [id]);

  if (loading) return <div className="cd-loading">Cargando detalles de la cancha...</div>;

  return (
    <div className="cd-page-wrapper">
      <Navbar />
      
      <div className="cd-hero" style={{ backgroundImage: `url(${cancha.image})` }}>
        <div className="cd-hero-overlay"></div>
        <div className="cd-hero-content">
          <span className="cd-badge-premium">☆ PREMIUM EDITION</span>
          <h1 className="cd-title">{cancha.name}</h1>
          <div className="cd-subtitle-row">
            <span className="cd-location">📍 {cancha.location}</span>
            <span className="cd-status">✓ {cancha.status}</span>
          </div>
        </div>
      </div>

      <main className="cd-main-container">
        <div className="cd-content-full">
          <div className="cd-specs-grid">
            <div className="cd-spec-card">
              <svg viewBox="0 0 24 24" fill="none" stroke="#bef264" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
              <span className="cd-spec-label">SUPERFICIE</span>
              <span className="cd-spec-value">{cancha.specs.surface}</span>
            </div>
            <div className="cd-spec-card">
              <svg viewBox="0 0 24 24" fill="none" stroke="#bef264" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
              <span className="cd-spec-label">ILUMINACIÓN</span>
              <span className="cd-spec-value">{cancha.specs.lighting}</span>
            </div>
            <div className="cd-spec-card">
              <svg viewBox="0 0 24 24" fill="none" stroke="#bef264" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path></svg>
              <span className="cd-spec-label">CRISTAL</span>
              <span className="cd-spec-value">{cancha.specs.glass}</span>
            </div>
            <div className="cd-spec-card">
              <svg viewBox="0 0 24 24" fill="none" stroke="#bef264" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
              <span className="cd-spec-label">CERCADO</span>
              <span className="cd-spec-value">{cancha.specs.fence}</span>
            </div>
          </div>

          <div className="cd-info-row">
            <div className="cd-info-card">
              <h3>Experiencia Profesional</h3>
              <p>{cancha.description}</p>
            </div>
            <div className="cd-info-card">
              <h3>Servicios Incluidos</h3>
              <ul className="cd-services-list">
                {cancha.services.map((service, index) => (
                  <li key={index}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="#bef264" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    {service}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <section className="cd-gallery-section">
          <h2>Galería de la Cancha</h2>
          <div className="cd-gallery-grid">
            {cancha.gallery.map((img, index) => (
              <img 
                key={index} 
                src={img} 
                alt={`Vista ${index + 1}`} 
                className={`cd-gallery-img img-${index}`} 
              />
            ))}
          </div>
          <div className="cd-action-bottom">
            <button 
              className="cd-btn-play" 
              onClick={() => navigate(`/complejo/${cancha.complejoId}`)}
            >
              JUEGO EN ESTA
            </button>
          </div>
        </section>

        <section className="cd-recommended-section">
          <h2>Más Clubes</h2>
          <div className="cd-recommended-grid">
            {cancha.recommended.map((rec) => (
              <div 
                className="cd-rec-card" 
                key={rec.id}
                onClick={() => navigate('/complejos')}
              >
                <div className="cd-rec-img" style={{ backgroundImage: `url(${rec.image})` }}></div>
                <div className="cd-rec-info">
                  <h4>{rec.name}</h4>
                  <span className={rec.status.includes('ahora') ? 'status-green' : 'status-gray'}>{rec.status}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
};

export default CourtDetail;