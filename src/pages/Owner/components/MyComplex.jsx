import { useState, useEffect, useRef } from 'react';
import { Upload, X, ImagePlus } from 'lucide-react';
import { getMyComplex, createComplex, updateComplex, uploadComplexPhotos } from '../../../api/complexApi';
import { confirmSave, successAlert, errorAlert } from '../../../utils/alerts';
import { useComplexForm } from '../utils/hooks/useComplexForm';
import { blockNonLetters, blockNonPhone, blockNonDigits } from '../utils/validations';
import './MyComplex.css';

export default function MyComplex() {
  const [complejo,     setComplejo]     = useState(null);
  const [loading,      setLoading]      = useState(true);
  const [saving,       setSaving]       = useState(false);
  const [images,       setImages]       = useState([]);
  const [newFiles,     setNewFiles]     = useState([]);
  const [uploadingImg, setUploadingImg] = useState(false);
  const fileRef = useRef(null);

  const { register, handleSubmit, reset, watch, formState: { errors } } = useComplexForm();

  const watchedName        = watch('name', '');
  const watchedLocation    = watch('location', '');
  const watchedDescription = watch('description', '');

  useEffect(() => {
    getMyComplex()
      .then(res => {
        const data = res.data.complex || res.data;
        setComplejo(data);
        setImages(data.photos || data.imagenes || []);
        reset({
          name:              data.name              || '',
          location:          data.location          || '',
          city:              data.city              || '',
          price:             data.price             || '',
          openTime:          data.openTime          || '',
          closeTime:         data.closeTime         || '',
          whatsapp:          data.whatsapp          || '',
          description:       data.description       || '',
          depositPercentage: data.depositPercentage ?? '',
        });
      })
      .catch(err => {
        const status = err.response?.status;
        if (status && ![404, 401, 403].includes(status)) errorAlert('Error cargando el complejo.');
      })
      .finally(() => setLoading(false));
  }, [reset]);

  const handleFiles = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    if (images.length + newFiles.length + files.length > 5) {
      errorAlert('Máximo 5 imágenes permitidas.');
      return;
    }
    setNewFiles(prev => [...prev, ...files]);
    if (fileRef.current) fileRef.current.value = '';
  };

  const removeImage    = (idx) => setImages(prev => prev.filter((_, i) => i !== idx));
  const removeNewFile  = (idx) => setNewFiles(prev => prev.filter((_, i) => i !== idx));

  const onSubmit = async (data) => {
    const confirm = await confirmSave();
    if (!confirm.isConfirmed) return;

    setSaving(true);
    try {
      let saved;
      if (complejo) {
        const res = await updateComplex(complejo._id, data);
        saved = res.data.complex || res.data;
      } else {
        const res = await createComplex(data);
        saved = res.data.complex || res.data;
      }

      if (newFiles.length) {
        setUploadingImg(true);
        const res = await uploadComplexPhotos(saved._id, newFiles);
        saved = res.data.complex || saved;
        setNewFiles([]);
      }

      setComplejo(saved);
      setImages(saved.photos || saved.imagenes || []);
      await successAlert(
        complejo ? 'Complejo actualizado correctamente.' : 'Complejo creado — pendiente de aprobación.'
      );
    } catch (err) {
      await errorAlert(err.response?.data?.message || 'Error al guardar los cambios.');
    } finally {
      setSaving(false);
      setUploadingImg(false);
    }
  };

  if (loading) return <div className="panel-loading">Cargando complejo...</div>;

  return (
    <div className="panel-wrap">
      <div className="panel-header">
        <div>
          <h2>Mi Complejo</h2>
          <p className="panel-subtitle">Configurá tu espacio para que los jugadores puedan encontrarte y reservar online.</p>
        </div>
        {complejo && (
          <span className={`status-badge status-${complejo.status || complejo.estado}`}>
            {(complejo.status || complejo.estado) === 'pendiente_aprobacion' ? 'Pendiente de aprobación'
              : (complejo.status || complejo.estado) === 'activo'   ? 'Activo'
              : (complejo.status || complejo.estado) === 'inactivo' ? 'Inactivo'
              : (complejo.status || complejo.estado)}
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* Fotos */}
        <div className="form-section">
          <h3 className="section-title">Fotos del complejo</h3>
          <p className="section-desc">Subí hasta 5 fotos. Serán visibles en el portal público de reservas.</p>
          <div className="images-grid">
            {images.map((url, i) => (
              <div key={`saved-${i}`} className="img-thumb">
                <img src={url} alt={`Foto ${i + 1}`} />
                <button type="button" className="img-remove" onClick={() => removeImage(i)} title="Eliminar">
                  <X size={14} />
                </button>
                {i === 0 && <span className="img-badge">Principal</span>}
              </div>
            ))}
            {newFiles.map((file, i) => (
              <div key={`new-${i}`} className="img-thumb img-thumb--pending">
                <img src={URL.createObjectURL(file)} alt={file.name} />
                <button type="button" className="img-remove" onClick={() => removeNewFile(i)} title="Quitar">
                  <X size={14} />
                </button>
                <span className="img-badge img-badge--pending">Pendiente</span>
              </div>
            ))}
            {images.length + newFiles.length < 5 && (
              <button
                type="button"
                className="img-add"
                onClick={() => fileRef.current?.click()}
                disabled={uploadingImg}
              >
                {uploadingImg ? <Upload size={24} className="spin" /> : <ImagePlus size={24} />}
                <span>{uploadingImg ? 'Subiendo...' : 'Agregar foto'}</span>
              </button>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handleFiles} />
        </div>

        {/* Información general */}
        <div className="form-section">
          <h3 className="section-title">Información general</h3>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Nombre del complejo</label>
              <input
                className={`form-input${errors.name ? ' input-error' : ''}`}
                placeholder="Ej: Club Central Padel"
                maxLength={100}
                {...register('name')}
              />
              {errors.name
                ? <span className="error-msg">{errors.name.message}</span>
                : <span className="form-hint">{watchedName.length}/100 — mín. 3 caracteres</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Ciudad</label>
              <input
                className={`form-input${errors.city ? ' input-error' : ''}`}
                placeholder="Buenos Aires"
                maxLength={50}
                onKeyDown={blockNonLetters}
                {...register('city')}
              />
              {errors.city
                ? <span className="error-msg">{errors.city.message}</span>
                : <span className="form-hint">Solo letras — mín. 3</span>}
            </div>

            <div className="form-group form-group--full">
              <label className="form-label">Dirección</label>
              <input
                className={`form-input${errors.location ? ' input-error' : ''}`}
                placeholder="Av. Corrientes 1234"
                maxLength={200}
                {...register('location')}
              />
              {errors.location
                ? <span className="error-msg">{errors.location.message}</span>
                : <span className="form-hint">{watchedLocation.length}/200 — mín. 5 caracteres</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Precio por hora ($)</label>
              <input
                type="number"
                min="0"
                step="100"
                className={`form-input${errors.price ? ' input-error' : ''}`}
                placeholder="Ej: 3000"
                onKeyDown={blockNonDigits}
                {...register('price')}
              />
              {errors.price
                ? <span className="error-msg">{errors.price.message}</span>
                : <span className="form-hint">Solo números — máx. $999.999</span>}
            </div>

            <div className="form-group">
              <label className="form-label">WhatsApp</label>
              <input
                type="tel"
                className={`form-input${errors.whatsapp ? ' input-error' : ''}`}
                placeholder="+54 9 11 1234-5678"
                maxLength={18}
                onKeyDown={blockNonPhone}
                {...register('whatsapp')}
              />
              {errors.whatsapp
                ? <span className="error-msg">{errors.whatsapp.message}</span>
                : <span className="form-hint">Solo números y + — 7 a 15 dígitos</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Horario de apertura</label>
              <input
                type="time"
                className={`form-input${errors.openTime ? ' input-error' : ''}`}
                {...register('openTime')}
              />
              {errors.openTime && <span className="error-msg">{errors.openTime.message}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Horario de cierre</label>
              <input
                type="time"
                className={`form-input${errors.closeTime ? ' input-error' : ''}`}
                {...register('closeTime')}
              />
              {errors.closeTime && <span className="error-msg">{errors.closeTime.message}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Porcentaje de seña</label>
              <input
                type="number"
                min="0"
                max="100"
                className={`form-input${errors.depositPercentage ? ' input-error' : ''}`}
                placeholder="Ej: 30"
                onKeyDown={blockNonDigits}
                {...register('depositPercentage')}
              />
              {errors.depositPercentage
                ? <span className="error-msg">{errors.depositPercentage.message}</span>
                : <span className="form-hint">Solo números — entre 0 y 100</span>}
            </div>

            <div className="form-group form-group--full">
              <label className="form-label">Descripción</label>
              <textarea
                className={`form-input form-textarea${errors.description ? ' input-error' : ''}`}
                rows={3}
                maxLength={500}
                placeholder="Contale a los jugadores sobre tu complejo, instalaciones, estacionamiento, vestuarios..."
                {...register('description')}
              />
              {errors.description
                ? <span className="error-msg">{errors.description.message}</span>
                : <span className="form-hint">{watchedDescription.length}/500 — mín. 3 caracteres</span>}
            </div>
          </div>
        </div>

        {!complejo && (
          <div className="info-notice">
            Al crear el complejo quedará en estado <strong>pendiente de aprobación</strong> hasta que el equipo de PadelSaaS lo active.
          </div>
        )}

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'Guardando...' : complejo ? 'Guardar cambios' : 'Crear complejo'}
          </button>
        </div>
      </form>
    </div>
  );
}
