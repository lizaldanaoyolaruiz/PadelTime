import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Upload, X, ImagePlus } from 'lucide-react';
import { getMyComplex, createComplex, updateComplex, uploadComplexPhotos } from '../../api/complexApi';
import './MyComplex.css';

const schema = z.object({
  nombre:      z.string().min(2, 'Mínimo 2 caracteres'),
  direccion:   z.string().min(5, 'Ingresá la dirección completa'),
  ciudad:      z.string().min(2, 'Ingresá la ciudad'),
  whatsapp:    z.string().min(8, 'Número inválido').regex(/^\+?[\d\s\-()+]+$/, 'Solo números y +'),
  descripcion: z.string().optional(),
});

export default function MyComplex() {
  const [complejo,     setComplejo]     = useState(null);
  const [loading,      setLoading]      = useState(true);
  const [saving,       setSaving]       = useState(false);
  const [images,       setImages]       = useState([]); // strings (URLs ya subidas)
  const [newFiles,     setNewFiles]     = useState([]); // File objects pendientes
  const [uploadingImg, setUploadingImg] = useState(false);
  const fileRef = useRef(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  useEffect(() => {
    getMyComplex()
      .then(res => {
        const data = res.data.complex;
        setComplejo(data);
        setImages(data.photos || data.imagenes || []);
        reset({
          nombre:      data.name || data.nombre,
          direccion:   data.address || data.direccion,
          ciudad:      data.city || data.ciudad,
          whatsapp:    data.whatsapp,
          descripcion: data.description || data.descripcion || '',
        });
      })
      .catch(err => {
        if (err.response?.status !== 404) toast.error('Error cargando el complejo');
      })
      .finally(() => setLoading(false));
  }, [reset]);

  const handleFiles = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    if (images.length + newFiles.length + files.length > 5) {
      toast.error('Máximo 5 imágenes permitidas');
      return;
    }
    setNewFiles(prev => [...prev, ...files]);
    if (fileRef.current) fileRef.current.value = '';
  };

  const removeImage = (idx) => setImages(prev => prev.filter((_, i) => i !== idx));
  const removeNewFile = (idx) => setNewFiles(prev => prev.filter((_, i) => i !== idx));

  const onSubmit = async (data) => {
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
      toast.success(complejo ? 'Complejo actualizado correctamente' : 'Complejo creado — pendiente de aprobación');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al guardar los cambios');
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
          <span className={`status-badge status-${complejo.estado}`}>
            {complejo.estado === 'pendiente_aprobacion' ? 'Pendiente de aprobación'
              : complejo.estado === 'activo'  ? 'Activo'
              : complejo.estado === 'inactivo' ? 'Inactivo'
              : complejo.estado}
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* Images */}
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
                {uploadingImg
                  ? <Upload size={24} className="spin" />
                  : <ImagePlus size={24} />
                }
                <span>{uploadingImg ? 'Subiendo...' : 'Agregar foto'}</span>
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

        {/* General info */}
        <div className="form-section">
          <h3 className="section-title">Información general</h3>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Nombre del complejo</label>
              <input
                className={`form-input${errors.nombre ? ' input-error' : ''}`}
                placeholder="Ej: Club Central Padel"
                {...register('nombre')}
              />
              {errors.nombre && <span className="error-msg">{errors.nombre.message}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">WhatsApp de contacto</label>
              <input
                className={`form-input${errors.whatsapp ? ' input-error' : ''}`}
                placeholder="+54 9 11 1234-5678"
                {...register('whatsapp')}
              />
              {errors.whatsapp && <span className="error-msg">{errors.whatsapp.message}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Dirección</label>
              <input
                className={`form-input${errors.direccion ? ' input-error' : ''}`}
                placeholder="Av. Corrientes 1234"
                {...register('direccion')}
              />
              {errors.direccion && <span className="error-msg">{errors.direccion.message}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Ciudad</label>
              <input
                className={`form-input${errors.ciudad ? ' input-error' : ''}`}
                placeholder="Buenos Aires"
                {...register('ciudad')}
              />
              {errors.ciudad && <span className="error-msg">{errors.ciudad.message}</span>}
            </div>

            <div className="form-group form-group--full">
              <label className="form-label">Descripción <span className="label-optional">(opcional)</span></label>
              <textarea
                className="form-input form-textarea"
                rows={3}
                placeholder="Contale a los jugadores sobre tu complejo, instalaciones, estacionamiento, vestuarios..."
                {...register('descripcion')}
              />
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
