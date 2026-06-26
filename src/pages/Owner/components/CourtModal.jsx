import { useState, useRef } from 'react';
import { X, ImagePlus, Upload, Star } from 'lucide-react';
import { useCourtForm } from '../utils/hooks/useCourtForm';
import { SUPERFICIES } from '../utils/constants';
import { blockNonDigits } from '../utils/validations';
import { uploadCourtPhotos, deleteCourtPhoto } from '../../../services/courtService';
import { errorAlert } from '../../../utils/alerts';
import './MyComplex.css';

export default function CourtModal({ cancha, onClose, onSave }) {
  const isEdit = Boolean(cancha?._id);
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useCourtForm(cancha);

  const [images, setImages] = useState(() => {
    const saved = cancha?.photos?.length ? cancha.photos : (cancha?.photo ? [cancha.photo] : []);
    return saved;
  });
  const [newFiles,     setNewFiles]     = useState([]);
  const [principalUrl, setPrincipalUrl] = useState(cancha?.photo || null);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [deletingUrl,  setDeletingUrl]  = useState(null);
  const fileRef = useRef(null);

  const watchedName = watch('name', '');
  const watchedDesc = watch('description', '');

  const handleFiles = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    if (fileRef.current) fileRef.current.value = '';

    if (images.length + newFiles.length + files.length > 5) {
      errorAlert('Máximo 5 imágenes permitidas.');
      return;
    }

    if (cancha?._id) {
      setUploadingImg(true);
      try {
        const res = await uploadCourtPhotos(cancha._id, files);
        const updated = res.data.photos || [];
        setImages(updated);
        if (!principalUrl) setPrincipalUrl(updated[0] || null);
      } catch {
        errorAlert('Error al subir las fotos. Intentá de nuevo.');
      } finally {
        setUploadingImg(false);
      }
    } else {
      setNewFiles(prev => [...prev, ...files]);
    }
  };

  const handleRemoveImage = async (url) => {
    if (!cancha?._id) return;
    setDeletingUrl(url);
    try {
      await deleteCourtPhoto(cancha._id, url);
      const next = images.filter(u => u !== url);
      setImages(next);
      if (principalUrl === url) setPrincipalUrl(next[0] || null);
    } catch {
      errorAlert('Error al eliminar la foto.');
    } finally {
      setDeletingUrl(null);
    }
  };

  const removeNewFile = (idx) => setNewFiles(prev => prev.filter((_, i) => i !== idx));

  const onSubmit = (data) => onSave(data, newFiles, principalUrl, images);

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div className="modal-header">
          <h3>{isEdit ? 'Editar cancha' : 'Nueva cancha'}</h3>
          <button className="modal-close" onClick={onClose}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="modal-form">
          {/* Fotos */}
          <div className="form-group">
            <label className="form-label">Fotos de la cancha</label>
            <div className="images-grid images-grid--sm">
              {images.map((url, i) => {
                const isPrincipal = principalUrl === url;
                return (
                  <div key={url} className={`img-thumb${isPrincipal ? ' img-thumb--principal' : ''}`}>
                    <img src={url} alt={`Foto ${i + 1}`} />
                    <button
                      type="button"
                      className="img-remove"
                      onClick={() => handleRemoveImage(url)}
                      disabled={!!deletingUrl}
                      title="Eliminar"
                    >
                      <X size={14} />
                    </button>
                    {isPrincipal ? (
                      <span className="img-badge"><Star size={9} /> Principal</span>
                    ) : (
                      <button
                        type="button"
                        className="img-set-principal"
                        onClick={() => setPrincipalUrl(url)}
                        title="Marcar como foto principal"
                      >
                        <Star size={12} />
                      </button>
                    )}
                  </div>
                );
              })}

              {newFiles.map((file, i) => (
                <div key={`new-${i}`} className="img-thumb img-thumb--pending">
                  <img src={URL.createObjectURL(file)} alt={file.name} />
                  <button type="button" className="img-remove" onClick={() => removeNewFile(i)} title="Quitar">
                    <X size={14} />
                  </button>
                  <span className="img-badge img-badge--pending">Al guardar</span>
                </div>
              ))}

              {images.length + newFiles.length < 5 && (
                <button
                  type="button"
                  className="img-add"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploadingImg}
                >
                  {uploadingImg ? <Upload size={18} className="spin" /> : <ImagePlus size={18} />}
                  <span>{uploadingImg ? 'Subiendo...' : 'Agregar'}</span>
                </button>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              style={{ display: 'none' }}
              onChange={handleFiles}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Nombre de la cancha</label>
            <input
              className={`form-input${errors.name ? ' input-error' : ''}`}
              placeholder="Ej: Cancha 1"
              maxLength={50}
              {...register('name')}
            />
            {errors.name
              ? <span className="error-msg">{errors.name.message}</span>
              : <span className="form-hint">{watchedName.length}/50 — mín. 3 caracteres</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Superficie</label>
            <select
              className={`form-input form-select${errors.type ? ' input-error' : ''}`}
              {...register('type')}
            >
              <option value="">Seleccioná...</option>
              {SUPERFICIES.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
            {errors.type && <span className="error-msg">{errors.type.message}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Descripción</label>
            <textarea
              className={`form-input form-textarea${errors.description ? ' input-error' : ''}`}
              rows={2}
              maxLength={300}
              placeholder="Ej: Cancha techada con iluminación LED..."
              {...register('description')}
            />
            {errors.description
              ? <span className="error-msg">{errors.description.message}</span>
              : <span className="form-hint">{watchedDesc.length}/300 — mín. 3 caracteres</span>}
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-primary" disabled={isSubmitting || uploadingImg}>
              {isSubmitting ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear cancha'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
