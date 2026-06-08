import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import './Navbar.css';

const Navbar = () => {
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
        <li><Link to="/nosotros">Sobre Nosotros</Link></li>
        <li><a href="#contacto">Contacto</a></li>
      </ul>
      <div className="navbar-actions">
        <Link to="/login" className="btn-login">Iniciar Sesión</Link>
        <Link to="/register" className="btn-register">Registrarse</Link>
      </div>
    </nav>
  );
};

export default Navbar;