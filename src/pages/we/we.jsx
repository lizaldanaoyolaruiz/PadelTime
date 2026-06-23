import "./Nosotros.css";

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
          <h3>Partidos Organizados</h3>

          <p>Miles de encuentros coordinados mediante nuestra plataforma.</p>
        </article>

        <article className="stat-card">
          <h2>4K+</h2>
          <h3>Canchas Disponibles</h3>

          <p>Espacios deportivos conectados para reservar en segundos.</p>
        </article>
      </section>
    </div>
  );
}

export default Nosotros;
