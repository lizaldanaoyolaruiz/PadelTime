import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('Verificando...');

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setStatus('Token inválido.');
      return;
    }

    api.get(`/auth/verify-email?token=${token}`)
      .then(() => {
        setStatus('¡Email verificado! Redirigiendo...');
        setTimeout(() => navigate('/login'), 2000);
      })
      .catch(() => {
        setStatus('El link es inválido o ya expiró.');
      });
  }, []);

  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h2>{status}</h2>
    </div>
  );
}
