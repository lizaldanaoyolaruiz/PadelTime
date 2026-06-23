import "./we.css";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

<Navbar/>
function Nosotros() {
  return (
    <div className="about-page">
      <section className="about-hero">
        <div className="about-hero-content">
          <span className="about-tag">EL FUTURO DEL PÁDEL</span>

          <h1>
            Nuestra misión es
            <span> digitalizar el pádel</span>
          </h1>

          <p>
            En PadelTime creemos que la gestión de un club y la experiencia de
            los jugadores deben ser simples, rápidas y accesibles. Por eso
            desarrollamos una plataforma que conecta tecnología, organización y
            pasión por el deporte.
          </p>
        </div>
      </section>
      <section className="about-stats">
        <article className="stat-card">
          <h2>404+</h2>
          <h3>Clubes Activos</h3>

          <p>Complejos que utilizan PadelTime para gestionar reservas.</p>
        </article>

        <article className="stat-card">
          <h2>8K+</h2>
          <h3>Partidos/ Mes</h3>

          <p>Miles de encuentros coordinados mediante nuestra plataforma.</p>
        </article>

        <article className="stat-card">
          <h2>4K+</h2>
          <h3>Canchas</h3>

          <p>Espacios deportivos conectados para reservar en segundos.</p>
        </article>
      </section>
      <section className="about-vision">
        <div className="vision-main">
          <span className="vision-icon"></span>

          <h2>Nuestra Visión 2025</h2>

          <p>
            Queremos convertirnos en la plataforma de referencia para la gestión
            deportiva en Latinoamérica, ayudando a clubes y jugadores a
            conectarse de forma simple y eficiente.
          </p>
        </div>

        <div className="vision-side">
          <article className="vision-card">
            <h3>Precisión Técnica</h3>

            <p>
              Diseñamos herramientas enfocadas en optimizar reservas, horarios y
              administración diaria.
            </p>
          </article>

          <article className="vision-card">
            <h3>Experiencia de Usuario</h3>

            <p>
              Una plataforma intuitiva que permite reservar una cancha en pocos
              segundos desde cualquier dispositivo.
            </p>
          </article>
        </div>
      </section>
      <section className="about-team">
        <div className="team-header">
          <h2>Nuestro Equipo</h2>

          <p>
            Personas apasionadas por el deporte y la tecnología, trabajando para
            transformar la experiencia del pádel.
          </p>
        </div>

        <div className="team-grid">
          <article className="team-member">
            <div className="member-avatar">
                <img src="../../assets/mar.padel.jpeg" alt="Marisol Lamas" />
            </div>

            <h3>Marisol Lamas</h3>

            <span>Scrum Master</span>
          </article>

          <article className="team-member">
            <div className="member-avatar">
                <img src="../../assets/ald.padel.jpeg" alt="Aldana Ruiz" />
            </div>

            <h3>Aldana Ruiz</h3>

            <span>Lider Tecnica</span>
          </article>

          <article className="team-member">
            <div className="member-avatar">
                <img src="../../assets/fac.pdel.jpeg" alt="Facundo Camaño" />
            </div>

            <h3>Facundo Camaño</h3>

            <span>Desarrollador</span>
          </article>

          <article className="team-member">
            <div className="member-avatar">
                <img src="../../assets/oc.padel.jpeg" alt="Octavio Fernandez" />
            </div>

            <h3>Octavio Fernandez</h3>

            <span>Desarrollador</span>
          </article>
        </div>
      </section>
    </div>
  );
}
<footer/>
export default Nosotros;
