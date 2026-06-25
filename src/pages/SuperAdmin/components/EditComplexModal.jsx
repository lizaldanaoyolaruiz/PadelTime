import { useState } from 'react';
import { X, Building2 } from 'lucide-react';
import { blockNonLetters, blockNonPhone, blockNonDigits } from '../utils/validations';
import { CITIES } from '../../../constants/cities';
import '../ComplexManagement.css';

export function EditComplexModal({ complex, onClose, onSave }) {
  const [form, setForm] = useState({
    name:         complex.name         || '',
    owner:        complex.owner        || '',
    email:        complex.email        || '',
    phone:        complex.phone        || '',
    courts:       complex.courts       || '',
    address:      complex.address      || '',
    city:         complex.city         || '',
    province:     'Tucumán',
    observations: complex.observations || '',
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name || form.name.trim().length < 3)   e.name     = 'Mínimo 3 caracteres';
    if (!form.owner || form.owner.trim().length < 3)  e.owner    = 'Mínimo 3 caracteres';
    if (!form.phone || form.phone.replace(/\D/g, '').length < 10) e.phone = 'Mínimo 10 dígitos';
    if (!form.courts || Number(form.courts) < 1 || Number(form.courts) > 50) e.courts = 'Entre 1 y 50';
    if (!form.address || form.address.trim().length < 5) e.address = 'Mínimo 5 caracteres';
    if (!form.city || !CITIES.includes(form.city)) e.city = 'Seleccioná una ciudad';
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleSave = () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onSave({ ...complex, ...form, courts: Number(form.courts) });
    onClose();
  };

  return (
    <div className="gc-modal-overlay" role="dialog" aria-modal="true" aria-label="Editar complejo">
      <div className="gc-new-modal">
        <div className="gc-new-modal-header">
          <div className="gc-new-modal-title-row">
            <div className="gc-new-modal-icon-wrap">
              <Building2 size={20} />
            </div>
            <div>
              <h3 className="gc-new-modal-title">Editar Complejo</h3>
              <p className="gc-new-modal-subtitle">Modificá los datos del complejo.</p>
            </div>
          </div>
          <button className="gc-drawer-close" onClick={onClose} aria-label="Cerrar">
            <X size={20} />
          </button>
        </div>

        <div className="gc-new-modal-body">
          <div className="gc-new-field gc-new-field--full">
            <label className="gc-new-label">Nombre del complejo <span className="gc-required">*</span></label>
            <input
              name="name"
              className={`gc-new-input${errors.name ? ' gc-new-input--error' : ''}`}
              value={form.name}
              onChange={handleChange}
              placeholder="Ej: Padel Center Norte"
              maxLength={80}
            />
            {errors.name
              ? <span className="gc-new-error">{errors.name}</span>
              : <span className="gc-new-hint">{form.name.length}/80</span>}
          </div>

          <div className="gc-new-field">
            <label className="gc-new-label">Nombre del owner <span className="gc-required">*</span></label>
            <input
              name="owner"
              className={`gc-new-input${errors.owner ? ' gc-new-input--error' : ''}`}
              value={form.owner}
              onChange={handleChange}
              placeholder="Ej: Juan García"
              maxLength={60}
              onKeyDown={blockNonLetters}
            />
            {errors.owner
              ? <span className="gc-new-error">{errors.owner}</span>
              : <span className="gc-new-hint">{form.owner.length}/60 — solo letras</span>}
          </div>

          <div className="gc-new-field">
            <label className="gc-new-label">Email del owner</label>
            <input
              name="email"
              type="email"
              className="gc-new-input"
              value={form.email}
              onChange={handleChange}
              placeholder="juan@ejemplo.com"
              maxLength={100}
            />
          </div>

          <div className="gc-new-field">
            <label className="gc-new-label">Teléfono <span className="gc-required">*</span></label>
            <input
              name="phone"
              type="tel"
              className={`gc-new-input${errors.phone ? ' gc-new-input--error' : ''}`}
              value={form.phone}
              onChange={handleChange}
              placeholder="+54 11 1234 5678"
              maxLength={18}
              onKeyDown={blockNonPhone}
            />
            {errors.phone
              ? <span className="gc-new-error">{errors.phone}</span>
              : <span className="gc-new-hint">Mín. 10 dígitos — solo números y +</span>}
          </div>

          <div className="gc-new-field">
            <label className="gc-new-label">Número de pistas <span className="gc-required">*</span></label>
            <input
              name="courts"
              type="number"
              min="1"
              max="50"
              className={`gc-new-input${errors.courts ? ' gc-new-input--error' : ''}`}
              value={form.courts}
              onChange={handleChange}
              placeholder="Ej: 8"
              onKeyDown={blockNonDigits}
            />
            {errors.courts
              ? <span className="gc-new-error">{errors.courts}</span>
              : <span className="gc-new-hint">Entre 1 y 50</span>}
          </div>

          <div className="gc-new-field gc-new-field--full">
            <label className="gc-new-label">Dirección <span className="gc-required">*</span></label>
            <input
              name="address"
              className={`gc-new-input${errors.address ? ' gc-new-input--error' : ''}`}
              value={form.address}
              onChange={handleChange}
              placeholder="Ej: Av. Corrientes 1234"
              maxLength={120}
            />
            {errors.address
              ? <span className="gc-new-error">{errors.address}</span>
              : <span className="gc-new-hint">{form.address.length}/120 — mín. 5 caracteres</span>}
          </div>

          <div className="gc-new-field">
            <label className="gc-new-label">Ciudad <span className="gc-required">*</span></label>
            <select
              name="city"
              className={`gc-new-input${errors.city ? ' gc-new-input--error' : ''}`}
              value={form.city}
              onChange={handleChange}
            >
              <option value="" disabled>Seleccioná una ciudad...</option>
              {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            {errors.city && <span className="gc-new-error">{errors.city}</span>}
          </div>

          <div className="gc-new-field">
            <label className="gc-new-label">Provincia <span className="gc-required">*</span></label>
            <select
              name="province"
              className="gc-new-input"
              value={form.province}
              onChange={handleChange}
            >
              <option value="Tucumán">Tucumán</option>
            </select>
          </div>

          <div className="gc-new-field gc-new-field--full">
            <label className="gc-new-label">
              Observaciones <span className="gc-optional">(opcional)</span>
            </label>
            <textarea
              name="observations"
              className="gc-new-input gc-new-textarea"
              value={form.observations}
              onChange={handleChange}
              placeholder="Notas internas sobre este complejo..."
              rows={3}
              maxLength={300}
            />
            <span className="gc-new-hint">{form.observations.length}/300</span>
          </div>
        </div>

        <div className="gc-new-modal-footer">
          <p className="gc-new-footer-note"><span className="gc-required">*</span> Campos obligatorios</p>
          <div className="gc-new-footer-actions">
            <button
              type="button"
              className="gc-modal-btn gc-modal-btn--cancel"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              type="button"
              className="gc-modal-btn gc-modal-btn--approve"
              onClick={handleSave}
            >
              Guardar cambios
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
