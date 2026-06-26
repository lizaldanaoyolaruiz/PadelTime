import "./we.css";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
const marisolImg = 'https://res.cloudinary.com/dabikk5ei/image/upload/padeltime/assets/mar-padel.jpg';
const aldanaImg  = 'https://res.cloudinary.com/dabikk5ei/image/upload/padeltime/assets/ald-padel.jpg';
const facundoImg = 'https://res.cloudinary.com/dabikk5ei/image/upload/padeltime/assets/fac-padel.jpg';
const octavioImg = 'https://res.cloudinary.com/dabikk5ei/image/upload/padeltime/assets/oc-padel.jpg';

function Nosotros() {
  return (
    <>
      <Navbar />
      <div className="about-page">

        <section className="about-hero">
          <div className="about-hero-content">
            <span className="about-tag">EL FUTURO DEL PÁDEL</span>
            <h1>
              Nuestra misión es <span>digitalizar el pádel</span>.
            </h1>
            <p>
              Nacimos de la intersección entre la pasión por el deporte y la obsesión por la
              eficiencia tecnológica. En PadelSaaS, eliminamos las fricciones operativas
              para que los clubes crezcan y los jugadores nunca dejen de competir.
            </p>
          </div>
        </section>

        <section className="about-stats">
          <article className="stat-card">
            <h2>404+</h2>
            <h3>Clubes Activos</h3>
            <p>Optimizando su gestión diaria con nuestra tecnología de punta.</p>
          </article>
          <article className="stat-card">
            <h2>8+</h2>
            <h3>Partidos/Mes</h3>
            <p>Reservas procesadas sin interrupciones ni errores humanos.</p>
          </article>
          <article className="stat-card">
            <h2>4+</h2>
            <h3>Canchas</h3>
            <p>Digitalizadas y listas para ser reservadas en segundos.</p>
          </article>
        </section>

        <section className="about-vision">
          <div className="vision-main">
            <svg className="vision-chart" viewBox="0 0 450 130" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
              {[
                [0,18],[15,32],[30,22],[45,48],[60,36],[75,60],[90,44],[105,72],
                [120,58],[135,88],[150,70],[165,104],[180,82],[195,120],[210,98],
                [225,112],[240,90],[255,118],[270,96],[285,108],[300,80],[315,94],
                [330,68],[345,84],[360,56],[375,70],[390,42],[405,54],[420,30],[435,20],
              ].map(([x, h]) => (
                <rect key={x} x={x} y={130 - h} width="10" height={h} fill="#bef264" opacity="0.55" rx="2" />
              ))}
            </svg>
            <span className="vision-icon">🚀</span>
            <h2>Nuestra Visión 2025</h2>
            <p>
              Liderar la transformación digital del deporte amateur en Europa, convirtiéndonos
              en el estándar de oro para la administración de recintos deportivos.
            </p>
          </div>
          <div className="vision-side">
            <article className="vision-card">
              <h3>Precisión Técnica</h3>
              <p>
                Algoritmos de optimización de horarios que maximizan la
                rentabilidad por cancha hasta en un 40%.
              </p>
            </article>
            <article className="vision-card">
              <h3>Experiencia de Usuario</h3>
              <p>
                Diseñado para ser veloz. Reservas completadas en menos de
                3 clics desde cualquier dispositivo.
              </p>
            </article>
          </div>
        </section>

        <section className="about-team">
          <div className="team-header">
            <h2>El Equipo</h2>
            <p>Talento experto en SaaS y apasionados del deporte.</p>
          </div>
          <div className="team-grid">
            <article className="team-member">
              <div className="member-avatar">
                <img src={marisolImg} alt="Marisol Lamas" />
              </div>
              <h3>Marisol Lamas</h3>
              <span>SCRUM MASTER</span>
            </article>
            <article className="team-member">
              <div className="member-avatar">
                <img src={aldanaImg} alt="Aldana Ruiz" />
              </div>
              <h3>Aldana Ruiz</h3>
              <span>LIDER TÉCNICA</span>
            </article>
            <article className="team-member">
              <div className="member-avatar">
                <img src={facundoImg} alt="Facundo Camaño" />
              </div>
              <h3>Facundo Camaño</h3>
              <span>DESARROLLADOR</span>
            </article>
            <article className="team-member">
              <div className="member-avatar">
                <img src={octavioImg} alt="Octavio Fernandez" />
              </div>
              <h3>Octavio Fernandez</h3>
              <span>DESARROLLADOR</span>
            </article>
          </div>
        </section>

      </div>
      <Footer />
    </>
  );
}

export default Nosotros;
