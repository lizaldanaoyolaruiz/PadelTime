import { z } from "zod";
import { CITIES } from "../../../../constants/cities";

const LETTERS_RE = /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s'\-.]+$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?[0-9]{13}$/;
const NAME_RE = /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ0-9\s'\-&.]+$/;
const ADDRESS_RE = /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ0-9\s.,'-]+$/;
const TIME_RE = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const complexSchema = z.object({
  name: z
    .string()
    .min(1, "Campo requerido")
    .min(3, "Mínimo 3 caracteres")
    .max(80, "Máximo 80 caracteres")
    .regex(NAME_RE, "Solo letras, números, guiones y &"),

  owner: z
    .string()
    .min(1, "Campo requerido")
    .min(3, "Mínimo 3 caracteres")
    .max(60, "Máximo 60 caracteres")
    .regex(LETTERS_RE, "Solo se permiten letras y espacios"),

  email: z
    .string()
    .min(1, "Campo requerido")
    .min(6, "Email demasiado corto")
    .max(100, "Máximo 100 caracteres")
    .regex(EMAIL_RE, "Formato inválido (ej: nombre@dominio.com)"),

  phone: z
    .string()
    .min(1, "Campo requerido")
    .regex(PHONE_RE, "Deben ser 13 dígitos, sin espacios (ej: +5493813550986)"),

  courts: z
    .string()
    .min(1, "Campo requerido")
    .refine((v) => !isNaN(parseInt(v)), "Debe ser un número entero")
    .refine((v) => parseInt(v) >= 1, "Mínimo 1 pista")
    .refine((v) => parseInt(v) <= 50, "Máximo 50 pistas"),

  city: z.enum(CITIES, { error: "Seleccioná una ciudad" }),

  openTime: z
    .string()
    .min(1, "El horario de apertura es requerido")
    .regex(TIME_RE, "Formato HH:MM requerido"),

  closeTime: z
    .string()
    .min(1, "El horario de cierre es requerido")
    .regex(TIME_RE, "Formato HH:MM requerido"),

  address: z
    .string()
    .min(5, "Mínimo 5 caracteres")
    .max(120, "Máximo 120 caracteres")
    .regex(ADDRESS_RE, "Contiene caracteres no permitidos"),

  province: z
    .string()
    .min(3, "Mínimo 3 caracteres")
    .max(50, "Máximo 50 caracteres")
    .regex(LETTERS_RE, "Solo se permiten letras y espacios")
    .optional()
    .default("Tucumán"),

  observations: z
    .string()
    .max(300, "Máximo 300 caracteres")
    .optional()
    .default(""),
})
  .refine(
    (d) => !d.openTime || !d.closeTime || d.openTime < d.closeTime,
    { message: "El cierre debe ser posterior a la apertura", path: ["closeTime"] }
  );
