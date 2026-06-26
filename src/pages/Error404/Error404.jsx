import { useNavigate } from "react-router-dom";
import "./error404.css";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function Error404() {
  const navigate = useNavigate();
  return (
    <div className="error404-page">
      <Navbar />

      <main className="error404">
        <div className="overlay" />

        <div className="e404-content">
          <div className="e404-ball-container">
            <span className="e404-number">404</span>
            <div className="e404-ball" />
          </div>

          <h1>¡Esta pelota se fue de la cancha!</h1>

          <p>
            Parece que la página que buscas no está en juego. Ha superado los
            límites del recinto y no podemos recuperarla.
          </p>

          <div className="e404-buttons">
            <button className="e404-btn-primary" onClick={() => navigate("/")}>
              Volver al Inicio
            </button>
          </div>

          <div className="cards">
            <div className="card" onClick={() => navigate('/complejos')} style={{ cursor: 'pointer' }}>
              <h3>Clubes</h3>
              <p>Encuentra tu pista</p>
            </div>

            <div className="card" onClick={() => navigate('/panelcliente')} style={{ cursor: 'pointer' }}>
              <h3>Reservas</h3>
              <p>Gestiona tus partidos</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
