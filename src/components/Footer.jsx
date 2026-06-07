import logo from '../assets/logo.png';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-brand">
        <a href="#inicio">
          <img src={logo} alt="Logo" className="logo-img-footer" />
        </a>
        <p>© 2024 PadelSaaS. Elevando tu juego.</p>
        <div className="social-icons">
          <span>🌍</span>
          <span>@</span>
          <span>🔗</span>
        </div>
      </div>
      <div className="footer-nav">
        <h3>NAVEGACIÓN</h3>
        <ul>
          <li>Inicio</li>
          <li>Clubes</li>
          <li>Sobre Nosotros</li>
          <li>Contacto</li>
        </ul>
      </div>
      <div className="footer-legal">
        <h3>LEGAL</h3>
        <ul>
          <li>Privacidad</li>
          <li>Términos</li>
          <li>Cookies</li>
        </ul>
      </div>
      <div className="footer-newsletter">
        <h3>NEWSLETTER</h3>
        <p>Recibe las mejores ofertas y torneos.</p>
        <div className="newsletter-input">
          <input type="email" placeholder="Email" />
          <button className="btn-send">➤</button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;