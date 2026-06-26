import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Mail, Phone, ArrowRight, MapPin,
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { contactSchema } from '../../utils/authValidations';
import './contact.css';

const ASUNTOS = ['Soporte Técnico', 'Registrar Club', 'Comercial'];

export default function ContactPage() {
  const [status, setStatus] = useState({ type: null, message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: { asunto: '' },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setStatus({ type: null, message: '' });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.nombre,
          email: data.email,
          message: `Asunto: ${data.asunto}\n\n${data.mensaje}`,
        }),
      });
      const result = await response.json();
      if (response.ok) {
        setStatus({ type: 'success', message: result.message });
        reset();
      } else {
        setStatus({ type: 'error', message: result.message });
      }
    } catch {
      setStatus({ type: 'error', message: 'No se pudo conectar con el servidor.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-wrapper">
      <Navbar />

      <div className="contact-page">
        <div className="contact-hero">
          <h1>HABLEMOS DE JUEGO</h1>
          <p>
            ¿Tienes dudas sobre nuestra plataforma o quieres registrar tu club?
            Estamos listos para elevar tu experiencia deportiva al siguiente nivel.
          </p>
        </div>

        <div className="contact-grid">
          {/* ── Columna izquierda: formulario ── */}
          <div className="form-card">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="row">
                <div className="field">
                  <label>Nombre completo</label>
                  <input placeholder="Tu nombre completo" {...register('nombre')} />
                  {errors.nombre && <span className="field-error">{errors.nombre.message}</span>}
                </div>

                <div className="field">
                  <label>Email</label>
                  <input placeholder="ejemplo@email.com" {...register('email')} />
                  {errors.email && <span className="field-error">{errors.email.message}</span>}
                </div>
              </div>

              <div className="field">
                <label>Asunto</label>
                <select {...register('asunto')}>
                  <option value="" disabled>Selecciona un asunto</option>
                  {ASUNTOS.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
                {errors.asunto && <span className="field-error">{errors.asunto.message}</span>}
              </div>

              <div className="field">
                <label>Mensaje</label>
                <textarea
                  rows="6"
                  placeholder="¿En qué podemos ayudarte hoy?"
                  {...register('mensaje')}
                />
                {errors.mensaje && <span className="field-error">{errors.mensaje.message}</span>}
              </div>

              <button className="submit-btn" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'ENVIANDO...' : 'ENVIAR MENSAJE'}
              </button>

              {status.message && (
                <p className={`status-msg ${status.type}`}>{status.message}</p>
              )}
            </form>
          </div>

          {/* ── Columna derecha: tarjetas info ── */}
          <div className="sidebar">
            <div className="info-card support">
              <h3>Soporte Técnico</h3>
              <p>Atención 24/7 para clubes Premium</p>
              <div className="contact-data">
                <p><Mail size={15} /> soporte@padelsaas.com</p>
                <p><Phone size={15} /> +34 900 123 456</p>
              </div>
            </div>

            <div className="info-card whatsapp-card">
              <div className="whatsapp-content">
                <div>
                  <h3>WhatsApp Directo</h3>
                  <p>Respondemos en menos de 15 min</p>
                </div>
                <ArrowRight size={22} className="whatsapp-arrow" />
              </div>
            </div>

            <div className="info-card">
              <h4>SÍGUENOS EN REDES</h4>
              <div className="socials">
                <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                </a>
                <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="https://www.tiktok.com" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                  </svg>
                </a>
                <a href="https://www.x.com" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.213 5.567zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
              </div>
            </div>

            <img
              src="https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&q=80&w=600&h=300"
              alt="Cancha de pádel"
              className="padel-image"
            />
          </div>
        </div>

        {/* ── Sección mapa ── */}
        <div className="map-section">
          <h2 className="map-title">Sede Central PadelSaaS</h2>
          <p className="map-subtitle">Av. del Deporte 1234, Madrid, España</p>
          <div className="map-container">
            {/* TODO: Reemplazar por un <iframe> de Google Maps con la ubicación real */}
            <div className="map-mock" aria-label="Mapa de ubicación">
              <div className="map-grid" />
              <div className="map-pin-label">
                <MapPin size={30} className="map-pin-icon" />
                <span>Sede Central PadelSaaS</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
