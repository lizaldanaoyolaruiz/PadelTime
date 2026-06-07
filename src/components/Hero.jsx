const Hero = () => {
  return (
    <section className="hero">
      <h1>Lleva tu juego al <span className="highlight">siguiente nivel</span></h1>
      <p>La plataforma definitiva para jugadores que buscan la pista perfecta y clubes que exigen una gestión de alto rendimiento.</p>
      <div className="search-bar">
        <span className="search-icon">🔍</span>
        <input type="text" placeholder="Busca tu club o ciudad..." />
        <button className="btn-search">BUSCAR</button>
      </div>
    </section>
  );
};

export default Hero;