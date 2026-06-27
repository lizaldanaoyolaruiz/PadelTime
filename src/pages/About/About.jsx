import Counter from "../../components/CounterNumber";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import "./about.css";

const NosotrosPage = () => {
  return (
    <div className="nosotros-page">
      <Navbar />

      <main className="nosotros-main">

        {/* ── Hero ── */}
        <section className="nos-hero">
          <span className="nos-eyebrow">EL FUTURO DEL PÁDEL</span>
          <h1 className="nos-h1">
            Nuestra misión es <span className="nos-h1-accent">digitalizar el pádel.</span>
          </h1>
          <p className="nos-hero-text">
            Nacimos de la intersección entre la pasión por el deporte y la obsesión por la
            eficiencia tecnológica. En PadelTime, eliminamos las fricciones operativas para
            que los clubes crezcan y los jugadores nunca dejen de competir.
          </p>
        </section>

        {/* ── Stat cards ── */}
        <section className="nos-stats-grid">
          <div className="nos-card">
            <h2 className="nos-stat-num"><Counter end={404} suffix="+" /></h2>
            <h3 className="nos-card-title">Clubes Activos</h3>
            <p className="nos-card-text">Optimizando su gestión diaria con nuestra tecnología de punta.</p>
          </div>
          <div className="nos-card">
            <h2 className="nos-stat-num"><Counter end={8} suffix="+" /></h2>
            <h3 className="nos-card-title">Partido/Mes</h3>
            <p className="nos-card-text">Reservas procesadas sin interrupciones ni errores humanos.</p>
          </div>
          <div className="nos-card">
            <h2 className="nos-stat-num"><Counter end={4} suffix="+" /></h2>
            <h3 className="nos-card-title">Canchas</h3>
            <p className="nos-card-text">Digitalizadas y listas para ser reservadas en segundos.</p>
          </div>
          <div className="nos-card nos-card--vision">
            <h2 className="nos-card-title nos-vision-title">Nuestra Visión 2027</h2>
            <p className="nos-card-text">
              Liderar la transformación digital del deporte amateur en Europa, convirtiéndonos
              en el estándar de oro para la administración de recintos deportivos.
            </p>
          </div>
        </section>

        {/* ── Features ── */}
        <section className="nos-features-grid">
          <div className="nos-card">
            <h3 className="nos-card-title">Precisión Técnica</h3>
            <p className="nos-card-text">
              Algoritmos de optimización de horarios que maximizan la rentabilidad por cancha hasta en un 40%.
            </p>
          </div>
          <div className="nos-card">
            <h3 className="nos-card-title">Experiencia de Usuarios</h3>
            <p className="nos-card-text">
              Diseñado para ser veloz. Reservas completadas en menos de 3 clics desde cualquier dispositivo.
            </p>
          </div>
        </section>

        {/* ── Team ── */}
        <section className="nos-team-section">
          <h2 className="nos-section-title">El Equipo</h2>
          <p className="nos-section-sub">Talento experto en SaaS y apasionados del deporte.</p>

          <div className="nos-team-grid">
            {[
              { name: 'Marisol Lamas',         role: 'Scrum Master',    img: 'https://randomuser.me/api/portraits/women/68.jpg' },
              { name: 'Aldana Liz Oyola Ruiz', role: 'Líder Técnica',   img: 'https://randomuser.me/api/portraits/women/32.jpg' },
              { name: 'Facundo Camaño',        role: 'Desarrollador',   img: 'https://randomuser.me/api/portraits/men/52.jpg'   },
              { name: 'Octavio Fernández',     role: 'Desarrollador',   img: 'https://randomuser.me/api/portraits/men/33.jpg'   },
              { name: 'Leandro Blanca',        role: 'Desarrollador',   img: 'https://randomuser.me/api/portraits/men/75.jpg'   },
            ].map(({ name, role, img }) => (
              <div key={name} className="nos-member-card">
                <img src={img} alt={name} className="nos-member-avatar" />
                <h4 className="nos-member-name">{name}</h4>
                <p className="nos-member-role">{role}</p>
              </div>
            ))}
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
};

export default NosotrosPage;
