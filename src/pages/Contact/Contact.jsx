import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Mail, Phone, ArrowRight,
  Globe, Camera, Play, Briefcase, MapPin,
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
                <button aria-label="Sitio web"><Globe size={20} /></button>
                <button aria-label="Instagram"><Camera size={20} /></button>
                <button aria-label="YouTube"><Play size={20} /></button>
                <button aria-label="LinkedIn"><Briefcase size={20} /></button>
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
