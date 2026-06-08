import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import "./contact.css";

const contactSchema = z.object({
  nombre: z.string().min(3, {
    message: "El nombre debe tener al menos 3 caracteres",
  }),
  email: z.string().email({
    message: "Introduce un email válido",
  }),
  asunto: z.string().min(1, {
    message: "Selecciona un asunto",
  }),
  mensaje: z.string().min(10, {
    message: "El mensaje debe tener al menos 10 caracteres",
  }),
});

export default function ContactPage() {
  const [status, setStatus] = useState({
    type: null,
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      asunto: "Soporte Técnico",
    },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      console.log(data);

      setStatus({
        type: "success",
        message: "¡Mensaje enviado con éxito!",
      });

      reset();
    } catch {
      setStatus({
        type: "error",
        message: "Error al enviar el mensaje",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
      <div className="hero">
        <h1>HABLEMOS DE JUEGO</h1>

        <p>
          ¿Tienes dudas sobre nuestra plataforma o quieres registrar tu club?
          Estamos listos para elevar tu experiencia deportiva al siguiente
          nivel.
        </p>
      </div>

      <div className="contact-grid">
        <div className="form-card">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row">
              <div className="field">
                <label>Nombre</label>
                <input
                  placeholder="Tu nombre completo"
                  {...register("nombre")}
                />
                {errors.nombre && (
                  <span>{errors.nombre.message}</span>
                )}
              </div>

              <div className="field">
                <label>Email</label>
                <input
                  placeholder="ejemplo@email.com"
                  {...register("email")}
                />
                {errors.email && (
                  <span>{errors.email.message}</span>
                )}
              </div>
            </div>

            <div className="field">
              <label>Asunto</label>

              <select {...register("asunto")}>
                <option value="Soporte Técnico">
                  Soporte Técnico
                </option>
                <option value="Ventas">
                  Ventas
                </option>
                <option value="Otros">
                  Otros
                </option>
              </select>

              {errors.asunto && (
                <span>{errors.asunto.message}</span>
              )}
            </div>

            <div className="field">
              <label>Mensaje</label>

              <textarea
                rows="6"
                placeholder="¿En qué podemos ayudarte hoy?"
                {...register("mensaje")}
              />

              {errors.mensaje && (
                <span>{errors.mensaje.message}</span>
              )}
            </div>

            <button
              className="submit-btn"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "ENVIANDO..."
                : "ENVIAR MENSAJE"}
            </button>

            {status.message && (
              <p
                className={`status ${status.type}`}
              >
                {status.message}
              </p>
            )}
          </form>
        </div>

        <div className="sidebar">
          <div className="info-card support">
            <h3>Soporte Técnico</h3>

            <p>Atención 24/7 para clubes Premium</p>

            <div className="contact-data">
              <p>📧 soporte@padelsaas.com</p>
              <p>📞 +34 900 123 456</p>
            </div>
          </div>

          <div className="info-card">
            <h3>WhatsApp Directo</h3>
            <p>Respondemos en menos de 15 min</p>
          </div>

          <div className="info-card">
            <h4>SÍGUENOS EN REDES</h4>

            <div className="socials">
              <button>🌐</button>
              <button>📷</button>
              <button>▶️</button>
              <button>🔗</button>
            </div>
          </div>

          <img
            src="https://images.unsplash.com/photo-1622279457486-62dcc4a431d9?w=1200"
            alt="Padel"
            className="padel-image"
          />
        </div>
      </div>
    </div>
  );
}