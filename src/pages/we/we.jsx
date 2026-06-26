import { useEffect, useRef, useState } from "react";
import "./we.css";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
const marisolImg = 'https://res.cloudinary.com/dabikk5ei/image/upload/padeltime/assets/mar-padel.jpg';
const aldanaImg  = 'https://res.cloudinary.com/dabikk5ei/image/upload/padeltime/assets/ald-padel.jpg';
const facundoImg = 'https://res.cloudinary.com/dabikk5ei/image/upload/padeltime/assets/fac-padel.jpg';
const octavioImg = 'https://res.cloudinary.com/dabikk5ei/image/upload/padeltime/assets/oc-padel.jpg';

function useCounter(target, duration = 1800, startCounting) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!startCounting) return;
    let start = 0;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [startCounting, target, duration]);
  return count;
}

function Nosotros() {
  const statsRef = useRef(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStarted(true); observer.disconnect(); } },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  const count1 = useCounter(404, 1800, started);
  const count2 = useCounter(8,   1200, started);
  const count3 = useCounter(4,   1000, started);

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
              eficiencia tecnológica. En PadelTime, eliminamos las fricciones operativas
              para que los clubes crezcan y los jugadores nunca dejen de competir.
            </p>
          </div>
        </section>

        <section className="about-stats" ref={statsRef}>
          <article className="stat-card">
            <h2>{count1}+</h2>
            <h3>Clubes Activos</h3>
            <p>Optimizando su gestión diaria con nuestra tecnología de punta.</p>
          </article>
          <article className="stat-card">
            <h2>{count2}+</h2>
            <h3>Partidos/Mes</h3>
            <p>Reservas procesadas sin interrupciones ni errores humanos.</p>
          </article>
          <article className="stat-card">
            <h2>{count3}+</h2>
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
            <h2>Nuestra Visión 2026</h2>
            <p>
              Liderar la transformación digital del deporte amateur en Tucumán, convirtiéndonos
              en el estándar de oro para la administración de recintos deportivos de la región.
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
