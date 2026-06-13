import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toastSuccess, toastError, toastWarning } from '../../utils/toasts';
import { registerSchema } from '../../utils/authValidations';
import { EyeIcon, EyeOffIcon } from '../../components/ui/EyeIcons';
import useAuthStore from '../../store/authStore';
import './Auth.css';

export default function Register() {
  const navigate = useNavigate();
  const { register: registerInStore } = useAuthStore();
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [role, setRole] = useState('player');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(registerSchema) });

  const onSubmit = async ({ nombre, apellido, email, password }) => {
    try {
      await registerInStore({ nombre, apellido, email, password, role });
      if (role === 'admin') {
        await toastSuccess('Cuenta creada. Esperá la aprobación del administrador.');
      } else {
        await toastSuccess('¡Cuenta creada! Verificá tu email.');
      }
      navigate('/login');
    } catch (err) {
      const msg = err.response?.data?.message || '';
      if (msg.toLowerCase().includes('email') || msg.toLowerCase().includes('registrado') || msg.toLowerCase().includes('exist')) {
        await toastError('Este email ya está registrado.');
      } else {
        await toastError('Error al registrarse. Intentá de nuevo.');
      }
    }
  };

  const onInvalid = (errors) => {
    if (errors.confirmPassword) {
      toastWarning('Las contraseñas no coinciden.');
    } else {
      toastWarning('Completá todos los campos.');
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        {/* ── Tabs ── */}
        <div className="auth-tabs">
          <Link to="/login" className="auth-tab">Iniciar Sesión</Link>
          <span className="auth-tab active">Crear Cuenta</span>
        </div>

        <div className="auth-header">
          <h2>Únete a la élite</h2>
          <p>Gestiona y reserva como un profesional.</p>
        </div>

        {/* ── Selector de rol ── */}
        <div className="auth-tabs" style={{ marginBottom: '20px' }}>
          <button
            type="button"
            className={`auth-tab${role === 'player' ? ' active' : ''}`}
            onClick={() => setRole('player')}
          >
            Jugador
          </button>
          <button
            type="button"
            className={`auth-tab${role === 'admin' ? ' active' : ''}`}
            onClick={() => setRole('admin')}
          >
            Owner de complejo
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="auth-form" noValidate>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Nombre</label>
              <div className={`input-wrapper${errors.nombre ? ' input-error' : ''}`}>
                <span className="input-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </span>
                <input type="text" placeholder="Tu nombre" {...register('nombre')} />
              </div>
              {errors.nombre && <span className="error-msg">{errors.nombre.message}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Apellido</label>
              <div className={`input-wrapper${errors.apellido ? ' input-error' : ''}`}>
                <span className="input-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                </span>
                <input type="text" placeholder="Tu apellido" {...register('apellido')} />
              </div>
              {errors.apellido && <span className="error-msg">{errors.apellido.message}</span>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Correo electrónico</label>
            <div className={`input-wrapper${errors.email ? ' input-error' : ''}`}>
              <span className="input-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2"/>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
              </span>
              <input type="email" placeholder="nombre@ejemplo.com" {...register('email')} />
            </div>
            {errors.email && <span className="error-msg">{errors.email.message}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <div className={`input-wrapper${errors.password ? ' input-error' : ''}`}>
              <span className="input-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </span>
              <input type={showPw ? 'text' : 'password'} placeholder="Crea tu contraseña" {...register('password')} />
              <button type="button" className="btn-eye" onClick={() => setShowPw((v) => !v)} tabIndex={-1}>
                {showPw ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
            {errors.password && <span className="error-msg">{errors.password.message}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Confirmar contraseña</label>
            <div className={`input-wrapper${errors.confirmPassword ? ' input-error' : ''}`}>
              <span className="input-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                  <path d="M3 3v5h5"/>
                </svg>
              </span>
              <input type={showConfirm ? 'text' : 'password'} placeholder="Repite tu contraseña" {...register('confirmPassword')} />
              <button type="button" className="btn-eye" onClick={() => setShowConfirm((v) => !v)} tabIndex={-1}>
                {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
            {errors.confirmPassword && <span className="error-msg">{errors.confirmPassword.message}</span>}
          </div>

          <button type="submit" className="btn-auth" disabled={isSubmitting}>
            {isSubmitting ? 'REGISTRANDO...' : 'REGISTRARME AHORA'}
          </button>
        </form>

        <p className="auth-legal">
          Al registrarte, aceptas nuestros{' '}
          <Link to="/terminos">Términos de Servicio</Link>
          {' '}y{' '}
          <Link to="/privacidad">Política de Privacidad</Link>
        </p>
      </div>
    </div>
  );
}
