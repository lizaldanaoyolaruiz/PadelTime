import { useState } from 'react';

const Hero = () => {
  const [busqueda, setBusqueda] = useState('');

  const handleSearch = () => {
    console.log("Buscando:", busqueda);
  };

  return (
    <section className="hero">
      <h1>Lleva tu juego al <span className="highlight">siguiente nivel</span></h1>
      <p>La plataforma definitiva para jugadores que buscan la pista perfecta y clubes que exigen una gestión de alto rendimiento.</p>

      <div className="search-bar">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="Busca tu club o ciudad..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <button className="btn-search" onClick={handleSearch}>BUSCAR</button>
      </div>
    </section>
  );
};

export default Hero;