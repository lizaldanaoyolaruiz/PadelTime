import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './ClubDetail.css';

const ClubDetail = () => {
  const { id } = useParams();
  
  const [club, setClub] = useState(null);
  const [canchas, setCanchas] = useState([]);
  const [cargando, setCargando] = useState(true);

  const [diaSeleccionado, setDiaSeleccionado] = useState(13);
  const [horarioSeleccionado, setHorarioSeleccionado] = useState('10:00');

  useEffect(() => {
    setTimeout(() => {
      setClub({
        nombre: "Marcos Paz PADEL",
        ubicacion: "San Miguel De Tucuman",
        telefono: "+54 381 1234567",
        horario: "Lun - Dom: 07:00 - 23:30",
      });
      
      setCanchas([
        {
          id: 1,
          name: "Cancha Central WPT",
          price: "35€/h",
          status: "Habilitada",
          description: "Cancha panorámica oficial con césped Mondo STX y máxima visibilidad. Ideal para torneos.",
          tags: ["Interior", "Panorámica", "Césped Azul"],
          image: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&q=80&w=400"
        },
        {
          id: 2,
          name: "Cancha 2 - Outdoor",
          price: "28€/h",
          status: "Habilitada",
          description: "Cancha al aire libre con iluminación LED Pro de última generación. Perfecta para jugar de noche.",
          tags: ["Exterior", "LED Pro", "Césped Verde"],
          image: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&q=80&w=400"
        }
      ]);
      setCargando(false);
    }, 1000);
  }, [id]);

  const handleReserva = () => {
    console.log("Datos listos para enviar a la Base de Datos:", {
      complejo_id: id,
      dia: diaSeleccionado,
      horario: horarioSeleccionado,
      cancha: "Cancha Central",
      total: "36,50€"
    });
  };

  if (cargando) return <div style={{textAlign: 'center', padding: '100px'}}>Cargando complejo...</div>;

  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="club-detail-main">
        <div className="club-header-section">
          <span className="badge-premium">✓ Club Premium</span>
          <h1>{club.nombre}</h1>
          <div className="club-info-row">
            <div className="club-location-contact">
              <span>📍 {club.ubicacion}</span>
              <span>📞 {club.telefono}</span>
              <span>🕒 {club.horario}</span>
            </div>
            <div className="club-action-buttons">
              <button className="btn-secondary">🔗 Compartir</button>
              <button className="btn-secondary">♡ Favorito</button>
            </div>
          </div>
        </div>

        <div className="gallery-grid">
          <img src="https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&q=80&w=800" alt="Cancha principal" className="img-main" />
          <div className="gallery-right">
            <img src="https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&q=80&w=400" alt="Cancha detalle 1" className="img-sub" />
            <img src="https://images.unsplash.com/photo-1574629810360-7efbb1925536?auto=format&fit=crop&q=80&w=400" alt="Cancha detalle 2" className="img-sub" />
            <img src="https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&q=80&w=800" alt="Cancha detalle 3" className="img-wide" />
          </div>
        </div>

        <div className="content-split">
          <section className="courts-list">
            <div className="courts-header">
              <h2>Nuestras Canchas</h2>
              <Link to="/canchas" style={{ cursor: 'pointer', textDecoration: 'underline', color: 'inherit' }}>
                {canchas.length} canchas disponibles
              </Link>
            </div>
            
            {canchas.map((cancha) => (
              <div className="court-card" key={cancha.id}>
                <div className="court-img-container">
                  <span className="badge-status">{cancha.status}</span>
                  <img src={cancha.image} alt={cancha.name} />
                </div>
                <div className="court-info">
                  <div className="court-title-row">
                    <h3>{cancha.name}</h3>
                    <span className="court-price">{cancha.price}</span>
                  </div>
                  <p>{cancha.description}</p>
                  <div className="court-tags">
                    {cancha.tags.map((tag, index) => (
                      <span key={index}>{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </section>

          <aside className="booking-widget">
            <h3>Reserva tu turno</h3>
            
            <div className="calendar-section">
              <div className="calendar-header">
                <span>Mayo 2024</span>
                <div className="calendar-arrows">
                  <span>&lt;</span>
                  <span>&gt;</span>
                </div>
              </div>
              <div className="calendar-days">
                <div className={`day ${diaSeleccionado === 12 ? 'active' : ''}`} onClick={() => setDiaSeleccionado(12)}><span>L</span><span>12</span></div>
                <div className={`day ${diaSeleccionado === 13 ? 'active' : ''}`} onClick={() => setDiaSeleccionado(13)}><span>M</span><span>13</span></div>
                <div className={`day ${diaSeleccionado === 14 ? 'active' : ''}`} onClick={() => setDiaSeleccionado(14)}><span>X</span><span>14</span></div>
                <div className={`day ${diaSeleccionado === 15 ? 'active' : ''}`} onClick={() => setDiaSeleccionado(15)}><span>J</span><span>15</span></div>
                <div className={`day ${diaSeleccionado === 16 ? 'active' : ''}`} onClick={() => setDiaSeleccionado(16)}><span>V</span><span>16</span></div>
                <div className={`day ${diaSeleccionado === 17 ? 'active' : ''}`} onClick={() => setDiaSeleccionado(17)}><span>S</span><span>17</span></div>
                <div className={`day ${diaSeleccionado === 18 ? 'active' : ''}`} onClick={() => setDiaSeleccionado(18)}><span>D</span><span>18</span></div>
              </div>
            </div>

            <div className="time-slots">
              <span>Horarios disponibles</span>
              <div className="slots-grid">
                <button className={`slot ${horarioSeleccionado === '08:00' ? 'active' : ''}`} onClick={() => setHorarioSeleccionado('08:00')}>08:00</button>
                <button className={`slot ${horarioSeleccionado === '09:00' ? 'active' : ''}`} onClick={() => setHorarioSeleccionado('09:00')}>09:00</button>
                <button className={`slot ${horarioSeleccionado === '10:00' ? 'active' : ''}`} onClick={() => setHorarioSeleccionado('10:00')}>10:00</button>
                <button className="slot disabled">11:00</button>
                <button className={`slot ${horarioSeleccionado === '12:00' ? 'active' : ''}`} onClick={() => setHorarioSeleccionado('12:00')}>12:00</button>
                <button className={`slot ${horarioSeleccionado === '13:00' ? 'active' : ''}`} onClick={() => setHorarioSeleccionado('13:00')}>13:00</button>
              </div>
            </div>

            <div className="booking-summary">
              <div className="summary-row">
                <span>Cancha Central x 1h</span>
                <span>35,00€</span>
              </div>
              <div className="summary-row">
                <span>Tasa de Servicio</span>
                <span>1,50€</span>
              </div>
              <div className="summary-total">
                <span>Total</span>
                <span>36,50€</span>
              </div>
              <button className="btn-book" onClick={handleReserva}>Realizar Reserva</button>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ClubDetail;