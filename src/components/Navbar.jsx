const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <h2>PadelTime</h2>
      </div>
      <ul className="navbar-links">
        <li><a href="#inicio" className="active">Inicio</a></li>
        <li><a href="#clubes">Clubes</a></li>
        <li><a href="#nosotros">Sobre Nosotros</a></li>
        <li><a href="#contacto">Contacto</a></li>
      </ul>
      <div className="navbar-actions">
        <button className="btn-login">Iniciar Sesión</button>
        <button className="btn-register">Registrarse</button>
      </div>
    </nav>
  );
};

export default Navbar;