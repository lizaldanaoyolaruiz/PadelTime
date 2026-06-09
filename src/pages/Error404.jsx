import "./error404.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Error404() {
  return (
    <div className="error404-page">
      <Navbar />

      <main className="error404">
        <div className="overlay"></div>

        <div className="content">
          <div className="ball-container">
            <span className="number">404</span>
            <div className="ball"></div>
          </div>

          <h1>¡Esta pelota se fue de la cancha!</h1>

          <p>
            Parece que la página que buscas no está en juego. Ha superado los
            límites del recinto y no podemos recuperarla.
          </p>

          <div className="buttons">
            <button
              className="btn-primary"
              onClick={() => (window.location.href = "/")}
            >
              Volver al Inicio
            </button>

            <button
              className="btn-secondary"
              onClick={() => window.history.back()}
            >
              Regresar
            </button>
          </div>

          <div className="cards">
            <div className="card">
              <h3>Clubes</h3>
              <p>Encuentra tu pista</p>
            </div>

            <div className="card">
              <h3>Reservas</h3>
              <p>Gestiona tus partidos</p>
            </div>

            <div className="card">
              <h3>Comunidad</h3>
              <p>Busca compañeros</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}