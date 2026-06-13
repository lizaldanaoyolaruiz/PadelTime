import { NavLink, Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <NavLink to="/">
          <img src={logo} alt="Logo" className="logo-img" />
        </NavLink>
      </div>
      <ul className="navbar-links">
        <li><NavLink to="/" end>Inicio</NavLink></li>
        <li><NavLink to="/complejos">Clubes</NavLink></li>
        <li><Link to="/nosotros">Sobre Nosotros</Link></li>
        <li><NavLink to="/contact">Contacto</NavLink></li>
      </ul>
      <div className="navbar-actions">
        <button className="btn-login" onClick={() => navigate("/login")}>
          Iniciar Sesión
        </button>
        <button className="btn-register" onClick={() => navigate("/register")}>
          Registrarse
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
