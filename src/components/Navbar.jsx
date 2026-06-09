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
<<<<<<< HEAD
        <li><Link to="/">Inicio</Link></li>
        <li><a href="/#clubes">Clubes</a></li>
        <li><a href="/#nosotros">Sobre Nosotros</a></li>
        <li><Link to="/contact">Contacto</Link></li>
=======
        <li><a href="#inicio" className="active">Inicio</a></li>
        <li><Link to="/complejos">Clubes</Link></li>
        <li><a href="#nosotros">Sobre Nosotros</a></li>
        <li><a href="#contacto">Contacto</a></li>
>>>>>>> 6cf2557a545d6a69d90c6bb1e0f78c2b6d380b6f
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