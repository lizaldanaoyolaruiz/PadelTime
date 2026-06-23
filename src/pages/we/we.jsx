import "../styles/About.css";

const About = () => {
  return (
    <div className="about-page">
      {/* HERO */}
      <section className="hero">
        <div className="overlay">
          <span className="hero-tag">EL FUTURO DEL PÁDEL</span>

          <h1>
            Nuestra misión es{" "}
            <span>digitalizar el pádel.</span>
          </h1>

          <p>
            Nacimos de la intersección entre la pasión por el deporte y la
            obsesión por la eficiencia tecnológica. En PadelSaaS,
            eliminamos las fricciones operativas para que los clubes crezcan
            y los jugadores nunca dejen de competir.
          </p>
        </div>
      </section>

      {/* STATS */}
      <section className="stats">
        <div className="stat-card">
          <h2>404+</h2>
          <h3>Clubes Activos</h3>
          <p>
            Optimizando su gestión diaria con nuestra tecnología de punta.
          </p>
        </div>

        <div className="stat-card">
          <h2>8+</h2>
          <h3>Partidos/Mes</h3>
          <p>
            Reservas procesadas sin interrupciones ni errores humanos.
          </p>
        </div>

        <div className="stat-card">
          <h2>4+</h2>
          <h3>Canchas</h3>
          <p>
            Digitalizadas y listas para ser reservadas en segundos.
          </p>
        </div>
      </section>

      {/* VISIÓN */}
      <section className="vision-section">
        <div className="vision-card">
          <div className="vision-overlay">
            <span>🚀</span>

            <h2>Nuestra Visión 2025</h2>

            <p>
              Liderar la transformación digital del deporte amateur
              en Europa, convirtiéndonos en el estándar de oro para la
              administración de recintos deportivos.
            </p>
          </div>
        </div>

        <div className="features">
          <div className="feature-card">
            <h3>Precisión Técnica</h3>
            <p>
              Algoritmos de optimización de horarios que maximizan la
              rentabilidad por cancha hasta en un 40%.
            </p>
          </div>

          <div className="feature-card">
            <h3>Experiencia de Usuario</h3>
            <p>
              Diseñado para ser veloz. Reservas completadas en menos de
              3 clics desde cualquier dispositivo.
            </p>
          </div>
        </div>
      </section>

      {/* EQUIPO */}
      <section className="team">
        <h2>El Equipo</h2>

        <p className="team-subtitle">
          Talento experto en SaaS y apasionados del deporte.
        </p>

        <div className="team-grid">
          <div className="member">
            <img src="/team1.jpg" alt="" />
            <h3>Carlos Ruiz</h3>
            <span>CEO & FOUNDER</span>
          </div>

          <div className="member">
            <img src="/team2.jpg" alt="" />
            <h3>Elena Marín</h3>
            <span>CTO</span>
          </div>

          <div className="member">
            <img src="/team3.jpg" alt="" />
            <h3>Marcos Soto</h3>
            <span>HEAD OF PRODUCT</span>
          </div>

          <div className="member">
            <img src="/team4.jpg" alt="" />
            <h3>Sara Vega</h3>
            <span>CUSTOMER SUCCESS</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;