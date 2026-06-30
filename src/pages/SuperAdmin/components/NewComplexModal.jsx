import { X, Building2 } from "lucide-react";
import { toast } from "sonner";
import { useComplexForm } from "../utils/hooks/useComplexForm";
import {
  blockNonLetters,
  blockNonPhone,
  blockNonDigits,
} from "../utils/validations";
import { createComplexByAdmin } from "../../../services/complexService";
import { CITIES } from "../../../constants/cities";

export function NewComplexModal({ onClose, onCreated }) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useComplexForm();

  const watchedName = watch("name", "");
  const watchedOwner = watch("owner", "");
  const watchedObservations = watch("observations", "");

  const onSubmit = async (data) => {
    try {
      const res = await createComplexByAdmin({
        name: data.name,
        ownerEmail: data.email,
        city: data.city,
        address: data.address,
        observations: data.observations,
      });
      toast.success(
        `Complejo "${res.data.complex.name}" creado correctamente.`,
      );
      onCreated(res.data.complex);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error al crear el complejo.");
    }
  };

  return (
    <div
      className="gc-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Nuevo complejo"
    >
      <div className="gc-new-modal">
        <div className="gc-new-modal-header">
          <div className="gc-new-modal-title-row">
            <div className="gc-new-modal-icon-wrap">
              <Building2 size={20} />
            </div>
            <div>
              <h3 className="gc-new-modal-title">Nuevo Complejo</h3>
              <p className="gc-new-modal-subtitle">
                Completá los datos para registrar el complejo.
              </p>
            </div>
          </div>
          <button
            className="gc-drawer-close"
            onClick={onClose}
            aria-label="Cerrar"
          >
            <X size={20} />
          </button>
        </div>

        <form
          className="gc-new-modal-body"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          {/* Nombre del complejo */}
          <div className="gc-new-field gc-new-field--full">
            <label className="gc-new-label">
              Nombre del complejo <span className="gc-required">*</span>
            </label>
            <input
              {...register("name")}
              className={`gc-new-input${errors.name ? " gc-new-input--error" : ""}`}
              placeholder="Ej: Padel Center Norte"
              maxLength={80}
            />
            {errors.name ? (
              <span className="gc-new-error">{errors.name.message}</span>
            ) : (
              <span className="gc-new-hint">
                {watchedName.length}/80 — mín. 3 caracteres
              </span>
            )}
          </div>

          <div className="gc-new-field">
            <label className="gc-new-label">
              Nombre del owner <span className="gc-required">*</span>
            </label>
            <input
              {...register("owner")}
              className={`gc-new-input${errors.owner ? " gc-new-input--error" : ""}`}
              placeholder="Ej: Juan García"
              maxLength={60}
              onKeyDown={blockNonLetters}
            />
            {errors.owner ? (
              <span className="gc-new-error">{errors.owner.message}</span>
            ) : (
              <span className="gc-new-hint">
                {watchedOwner.length}/60 — solo letras
              </span>
            )}
          </div>

          <div className="gc-new-field">
            <label className="gc-new-label">
              Email del owner <span className="gc-required">*</span>
            </label>
            <input
              {...register("email")}
              className={`gc-new-input${errors.email ? " gc-new-input--error" : ""}`}
              type="email"
              placeholder="juan@ejemplo.com"
              maxLength={100}
            />
            {errors.email && (
              <span className="gc-new-error">{errors.email.message}</span>
            )}
          </div>

          <div className="gc-new-field">
            <label className="gc-new-label">
              Teléfono <span className="gc-required">*</span>
            </label>
            <input
              {...register("phone")}
              className={`gc-new-input${errors.phone ? " gc-new-input--error" : ""}`}
              type="tel"
              placeholder="+34 911 000 000"
              maxLength={18}
              onKeyDown={blockNonPhone}
            />
            {errors.phone ? (
              <span className="gc-new-error">{errors.phone.message}</span>
            ) : (
              <span className="gc-new-hint">
                Mín. 10 dígitos — solo números y +
              </span>
            )}
          </div>

          <div className="gc-new-field">
            <label className="gc-new-label">
              Número de pistas <span className="gc-required">*</span>
            </label>
            <input
              {...register("courts")}
              className={`gc-new-input${errors.courts ? " gc-new-input--error" : ""}`}
              type="number"
              min="1"
              max="50"
              placeholder="Ej: 8"
              onKeyDown={blockNonDigits}
            />
            {errors.courts ? (
              <span className="gc-new-error">{errors.courts.message}</span>
            ) : (
              <span className="gc-new-hint">Entre 1 y 50</span>
            )}
          </div>

          <div className="gc-new-field">
            <label className="gc-new-label">
              Ciudad <span className="gc-required">*</span>
            </label>
            <select
              {...register("city")}
              className={`gc-new-input${errors.city ? " gc-new-input--error" : ""}`}
            >
              <option value="" disabled>
                Seleccioná una ciudad...
              </option>
              {CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {errors.city && (
              <span className="gc-new-error">{errors.city.message}</span>
            )}
          </div>

          <div className="gc-new-field gc-new-field--full">
            <label className="gc-new-label">
              Dirección <span className="gc-required">*</span>
            </label>
            <input
              {...register("address")}
              className={`gc-new-input${errors.address ? " gc-new-input--error" : ""}`}
              placeholder="Ej: Av. Aconquija 1234"
              maxLength={120}
            />
            {errors.address ? (
              <span className="gc-new-error">{errors.address.message}</span>
            ) : (
              <span className="gc-new-hint">Mín. 5 caracteres — máx. 120</span>
            )}
          </div>

          <div className="gc-new-field gc-new-field--full">
            <label className="gc-new-label">
              Observaciones <span className="gc-optional">(opcional)</span>
            </label>
            <textarea
              {...register("observations")}
              className={`gc-new-input gc-new-textarea${errors.observations ? " gc-new-input--error" : ""}`}
              placeholder="Notas internas sobre este complejo..."
              rows={3}
              maxLength={300}
            />
            {errors.observations ? (
              <span className="gc-new-error">
                {errors.observations.message}
              </span>
            ) : (
              <span className="gc-new-hint">
                {watchedObservations.length}/300
              </span>
            )}
          </div>

          <div
            className="gc-new-modal-footer"
            style={{
              justifyContent: "center",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <div className="gc-new-footer-actions">
              <button
                type="button"
                className="gc-modal-btn gc-modal-btn--cancel"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="gc-modal-btn gc-modal-btn--approve"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Guardando..." : "Guardar complejo"}
              </button>
            </div>
            <p className="gc-new-footer-note">
              <span className="gc-required">*</span> Campos obligatorios
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
