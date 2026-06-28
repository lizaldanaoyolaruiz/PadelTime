import { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { confirmLogout } from '../utils/alerts';
const logo = 'https://res.cloudinary.com/dabikk5ei/image/upload/padeltime/assets/logo_white.png';
import './navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();
  const [isScrolled, setIsScrolled]   = useState(false);
  const [isMenuOpen, setIsMenuOpen]   = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);

  const handleLogout = async () => {
    const result = await confirmLogout();
    if (!result.isConfirmed) return;
    if (logout) logout();
    navigate('/');
  };

  const Avatar = () => (
    <div className="user-avatar">
      {user?.avatar
        ? <img src={user.avatar} alt="avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
        : user?.name?.charAt(0).toUpperCase() || 'U'
      }
    </div>
  );

  return (
    <>
      <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
        <div className="navbar-logo">
          <NavLink to="/" onClick={closeMenu}>
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
                  <Avatar />
                  <span className="user-name">Hola, {user?.name || 'Usuario'}</span>
                </Link>
              ) : (
                <div className="user-info">
                  <Avatar />
                  <span className="user-name">Hola, {user?.name || 'Usuario'}</span>
                </div>
              )}
              <button className="btn-logout" onClick={handleLogout}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Salir
              </button>
            </div>
          ) : (
            <>
              <button className="btn-login" onClick={() => navigate('/login')}>Iniciar Sesión</button>
              <button className="btn-register" onClick={() => navigate('/register')}>Registrarse</button>
            </>
          )}
        </div>

        <button
          className={`navbar-hamburger${isMenuOpen ? ' navbar-hamburger--open' : ''}`}
          onClick={() => setIsMenuOpen(v => !v)}
          aria-label="Abrir menú"
          aria-expanded={isMenuOpen}
        >
          <span /><span /><span />
        </button>
      </nav>

      <div
        className={`mobile-overlay${isMenuOpen ? ' mobile-overlay--open' : ''}`}
        onClick={closeMenu}
        aria-hidden="true"
      />

      <div className={`mobile-menu${isMenuOpen ? ' mobile-menu--open' : ''}`} role="dialog" aria-modal="true">

        <div className="mobile-menu-header">
          <img src={logo} alt="PadelTime" className="mobile-menu-logo" />
          <button className="mobile-menu-close" onClick={closeMenu} aria-label="Cerrar menú">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" width="20" height="20">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <nav className="mobile-menu-nav">
          <NavLink to="/" end onClick={closeMenu}>Inicio</NavLink>
          <NavLink to="/complejos" onClick={closeMenu}>Clubes</NavLink>
          <Link to="/nosotros" onClick={closeMenu}>Sobre Nosotros</Link>
          <NavLink to="/contact" onClick={closeMenu}>Contacto</NavLink>
        </nav>

        <div className="mobile-menu-divider" />

        <div className="mobile-menu-actions">
          {isAuthenticated ? (
            <>
              <div className="mobile-user-card">
                <Avatar />
                <div className="mobile-user-info">
                  <span className="mobile-user-name">{user?.name || 'Usuario'}</span>
                  <span className="mobile-user-role">
                    {user?.role === 'player' || user?.role === 'client' ? 'Jugador'
                      : user?.role === 'admin' ? 'Club'
                      : 'Super Admin'}
                  </span>
                </div>
              </div>
              {(user?.role === 'client' || user?.role === 'player') && (
                <Link to="/panelcliente" className="mobile-btn mobile-btn--primary" onClick={closeMenu}>
                  Mi Panel
                </Link>
              )}
              <button className="mobile-btn mobile-btn--danger" onClick={handleLogout}>
                Cerrar Sesión
              </button>
            </>
          ) : (
            <>
              <button className="mobile-btn mobile-btn--outline" onClick={() => { navigate('/login'); closeMenu(); }}>
                Iniciar Sesión
              </button>
              <button className="mobile-btn mobile-btn--primary" onClick={() => { navigate('/register'); closeMenu(); }}>
                Registrarse
              </button>
            </>
          )}
        </div>

      </div>
    </>
  );
};

export default Navbar;
