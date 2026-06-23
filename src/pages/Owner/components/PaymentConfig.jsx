import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { getMyComplex, updateComplex } from '../../../services/complexService';
import './PaymentConfig.css';

const SENA_OPTIONS = [
  { value: 20, label: '20%', desc: 'Seña baja — más reservas, mayor riesgo de ausencia' },
  { value: 30, label: '30%', desc: 'Opción recomendada — equilibrio perfecto' },
  { value: 50, label: '50%', desc: 'Seña alta — mayor compromiso del jugador' },
];

export default function PaymentConfig() {
  const [complexId, setComplexId] = useState(null);
  const [sena,      setSena]      = useState(30);
  const [mpKey,     setMpKey]     = useState('');
  const [showKey,   setShowKey]   = useState(false);
  const [loading,   setLoading]   = useState(true);
  const [saving,    setSaving]    = useState(false);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    getMyComplex()
      .then(res => {
        const complex = res.data.complex || res.data;
        setComplexId(complex._id);
        if (SENA_OPTIONS.some(o => o.value === complex.depositPercentage)) {
          setSena(complex.depositPercentage);
        }
        setConnected(!!complex.mercadopagoActive || !!complex.mpTokenConfigured);
        if (complex.mpTokenConfigured) setMpKey('••••••••••••');
      })
      .catch(err => {
        if (err.response?.status !== 404) toast.error('Error cargando configuración');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!complexId) {
      toast.error('Primero debés crear un complejo');
      return;
    }
    setSaving(true);
    try {
      const payload = { depositPercentage: sena };
      if (mpKey.trim() && !mpKey.includes('•')) {
        payload.mpAccessToken     = mpKey.trim();
        payload.mercadopagoActive = true;
      }
      await updateComplex(complexId, payload);
      if (payload.mercadopagoActive) setConnected(true);
      toast.success('Configuración guardada correctamente');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="panel-loading">Cargando configuración...</div>;

  return (
    <div className="panel-wrap">
      <div className="panel-header">
        <div>
          <h2>Configuración de Pagos</h2>
          <p className="panel-subtitle">Configurá el porcentaje de seña y vinculá tu cuenta de Mercado Pago.</p>
        </div>
        {connected && (
          <span className="status-badge status-approved">
            <ShieldCheck size={13} style={{ marginRight: 4 }} />
            MP Conectado
          </span>
        )}
      </div>

      <form onSubmit={handleSave} noValidate>
        <div className="form-section">
          <h3 className="section-title">Porcentaje de seña</h3>
          <p className="section-desc">
            El jugador debe abonar este porcentaje del precio del turno al reservar online vía Mercado Pago.
          </p>
          <div className="sena-options">
            {SENA_OPTIONS.map(opt => (
              <label
                key={opt.value}
                className={`sena-option${sena === opt.value ? ' sena-option--active' : ''}`}
              >
                <input
                  type="radio"
                  name="sena"
                  value={opt.value}
                  checked={sena === opt.value}
                  onChange={() => setSena(opt.value)}
                  style={{ display: 'none' }}
                />
                <div className="sena-option-pct">{opt.label}</div>
                <div className="sena-option-desc">{opt.desc}</div>
                {opt.value === 30 && <span className="sena-recommended">Recomendado</span>}
              </label>
            ))}
          </div>
        </div>

        <div className="form-section">
          <h3 className="section-title">Mercado Pago — Access Token</h3>
          <p className="section-desc">
            Ingresá tu Access Token de producción para recibir los pagos directamente en tu cuenta.
            Lo encontrás en{' '}
            <a
              href="https://www.mercadopago.com.ar/developers/panel"
              target="_blank"
              rel="noreferrer"
              className="link-mp"
            >
              Panel de Desarrolladores de MP
            </a>.
          </p>

          <div className="mp-input-wrap">
            <input
              type={showKey ? 'text' : 'password'}
              className="form-input"
              placeholder="APP_USR-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
              value={mpKey}
              onChange={e => {
                const val = e.target.value;
                setMpKey(val.includes('•') ? '' : val);
              }}
              autoComplete="off"
              spellCheck={false}
            />
            <button
              type="button"
              className="btn-eye-mp"
              onClick={() => setShowKey(v => !v)}
              tabIndex={-1}
            >
              {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <div className="mp-security-note">
            <ShieldCheck size={14} />
            Tu token se almacena cifrado y nunca es visible para los jugadores.
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={saving || !complexId}>
            {saving ? 'Guardando...' : 'Guardar configuración'}
          </button>
        </div>
      </form>
    </div>
  );
}
