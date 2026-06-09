import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">
          <img src={logo} alt="Logo" className="logo-img" />
        </Link>
      </div>
      <ul className="navbar-links">
        <li><Link to="/">Inicio</Link></li>
        <li><Link to="/complejos">Clubes</Link></li>
        <li><a href="/#nosotros">Sobre Nosotros</a></li>
        <li><Link to="/contact">Contacto</Link></li>
      </ul>
      <div className="navbar-actions">
        <button className="btn-login" onClick={() => navigate('/login')}>
          Iniciar Sesión
        </button>
        <button className="btn-register" onClick={() => navigate('/register')}>
          Registrarse
        </button>
      </div>
    </nav>
  );
};

export default Navbar;