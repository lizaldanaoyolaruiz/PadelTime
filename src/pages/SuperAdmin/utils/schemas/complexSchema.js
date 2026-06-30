import { z } from "zod";
import { CITIES } from "../../../../constants/cities";

const LETTERS_RE = /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s'\-.]+$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?[0-9][\d\s\-()]{8,}$/;
const NAME_RE = /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ0-9\s'\-&.]+$/;

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
    .regex(PHONE_RE, "Solo números, +, guiones y paréntesis")
    .refine((v) => v.replace(/\D/g, "").length >= 10, "Mínimo 10 dígitos")
    .refine((v) => v.replace(/\D/g, "").length <= 15, "Máximo 15 dígitos"),

  courts: z
    .string()
    .min(1, "Campo requerido")
    .refine((v) => !isNaN(parseInt(v)), "Debe ser un número entero")
    .refine((v) => parseInt(v) >= 1, "Mínimo 1 pista")
    .refine((v) => parseInt(v) <= 50, "Máximo 50 pistas"),

  city: z.enum(CITIES, {
    errorMap: () => ({ message: "Seleccioná una ciudad" }),
  }),

  address: z
    .string()
    .min(5, "Mínimo 5 caracteres")
    .max(120, "Máximo 120 caracteres"),

  observations: z
    .string()
    .max(300, "Máximo 300 caracteres")
    .optional()
    .default(""),
});
