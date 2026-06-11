import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { loginSchema } from '../../utils/authValidations';
import { EyeIcon, EyeOffIcon } from '../../components/ui/EyeIcons';
import useAuthStore from '../../store/authStore';
import { loginUser } from '../../services/authService';
import './Auth.css';

const DEV_USERS = [
  { label: 'Admin',       user: { id: 1, nombre: 'Marcos Padel',  role: 'owner',       club: 'Club Central' }, token: 'dev-owner-token'  },
  { label: 'Jugador',     user: { id: 3, nombre: 'Juan Pérez',    role: 'user'         },                       token: 'dev-user-token'   },
  { label: 'Super Admin', user: { id: 9, nombre: 'Juan Delgado',  role: 'SUPER_ADMIN'  },                       token: 'dev-superadmin-token' },
];

export default function Login() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [showPw, setShowPw] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data) => {
    try {
      const res = await loginUser(data);
      setAuth(res.user, res.token);
      toast.success('¡Bienvenido de nuevo!');
      const role = res.user?.role;
      if (role === 'admin') navigate('/admin');
      else if (role === 'owner') navigate('/owner');
      else navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Credenciales incorrectas. Intenta de nuevo.');
    }
  };

  const onInvalid = () => {
    toast.error('Completá todos los campos correctamente.');
  };

  const devLogin = ({ user, token, label }) => {
    setAuth(user, token);
    toast.success(`Acceso dev: ${label}`);
    if (user.role === 'SUPER_ADMIN') navigate('/superadmin');
    else if (user.role === 'admin') navigate('/admin');
    else if (user.role === 'owner') navigate('/owner');
    else navigate('/');
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        {/* ── Tabs ── */}
        <div className="auth-tabs">
          <span className="auth-tab active">Iniciar Sesión</span>
          <Link to="/register" className="auth-tab">Crear Cuenta</Link>
        </div>

        {/* ── Avatar ── */}
        <div className="auth-avatar">
          <div className="auth-avatar-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" stroke="none">
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
            </svg>
          </div>
        </div>

        <div className="auth-header">
          <h2>Bienvenido de nuevo</h2>
          <p>Tu próxima victoria empieza aquí.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="auth-form" noValidate>
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
              <input type={showPw ? 'text' : 'password'} placeholder="Tu contraseña" {...register('password')} />
              <button type="button" className="btn-eye" onClick={() => setShowPw((v) => !v)} tabIndex={-1}>
                {showPw ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
            {errors.password && <span className="error-msg">{errors.password.message}</span>}
          </div>

          <div className="forgot-password">
            <Link to="/forgot-password">¿Olvidaste tu contraseña?</Link>
          </div>

          <button type="submit" className="btn-auth" disabled={isSubmitting}>
            {isSubmitting ? 'ENTRANDO...' : 'ENTRAR A LA PISTA'}
          </button>
        </form>

        {import.meta.env.DEV && (
          <div className="dev-access">
            <span className="dev-access-label">Acceso rápido (solo dev)</span>
            <div className="dev-access-btns">
              {DEV_USERS.map((u) => (
                <button key={u.label} className="dev-btn" onClick={() => devLogin(u)}>
                  {u.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
