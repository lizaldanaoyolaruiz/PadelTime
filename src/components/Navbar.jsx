
import { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
const logo = 'https://res.cloudinary.com/dabikk5ei/image/upload/padeltime/assets/logo_white.png';
import './navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    if (logout) logout();
    navigate('/');
  };

  return (
    <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
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
        {isAuthenticated ? (
          <div className="user-menu">
            {(user?.role === 'client' || user?.role === 'player') ? (
              <Link to="/panelcliente" className="user-info">
                <div className="user-avatar">
                  {user?.avatar
                    ? <img src={user.avatar} alt="avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                    : user?.name?.charAt(0).toUpperCase() || 'U'
                  }
                </div>
                <span className="user-name">Hola, {user?.name || 'Usuario'}</span>
              </Link>
            ) : (
              <div className="user-info">
                <div className="user-avatar">
                  {user?.avatar
                    ? <img src={user.avatar} alt="avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                    : user?.name?.charAt(0).toUpperCase() || 'U'
                  }
                </div>
                <span className="user-name">Hola, {user?.name || 'Usuario'}</span>
              </div>
            )}
            <button className="btn-logout" onClick={handleLogout}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              Salir
            </button>
          </div>
        ) : (
          <>
            <button className="btn-login" onClick={() => navigate("/login")}>
              Iniciar Sesión
            </button>
            <button className="btn-register" onClick={() => navigate("/register")}>
              Registrarse
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;