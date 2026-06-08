import logo from '../assets/logo.png';
import './Navbar.css';

const Navbar = () => {
  const handleLoginClick = () => {
    console.log("Abriendo ventana de inicio de sesión");
  };

  const handleRegisterClick = () => {
    console.log("Abriendo ventana de registro");
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <a href="#inicio">
          <img src={logo} alt="Logo" className="logo-img" />
        </a>
      </div>
      <ul className="navbar-links">
        <li><a href="#inicio" className="active">Inicio</a></li>
        <li><a href="#clubes">Clubes</a></li>
        <li><a href="#nosotros">Sobre Nosotros</a></li>
        <li><a href="#contacto">Contacto</a></li>
      </ul>
      <div className="navbar-actions">
        <button className="btn-login" onClick={handleLoginClick}>Iniciar Sesión</button>
        <button className="btn-register" onClick={handleRegisterClick}>Registrarse</button>
      </div>
    </nav>
  );
};

export default Navbar;