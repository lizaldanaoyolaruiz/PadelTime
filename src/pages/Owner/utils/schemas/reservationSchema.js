import { z } from 'zod';

export const reservationSchema = z.object({
  canchaId: z.string().min(1, 'Seleccioná una cancha'),
  fecha: z
    .string()
    .min(1, 'La fecha es requerida')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha inválida')
    .refine(
      (val) => val >= new Date().toISOString().split('T')[0],
      'La fecha no puede ser anterior a hoy'
    ),
  horaInicio: z
    .string()
    .min(1, 'Seleccioná un horario')
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Formato HH:MM requerido'),
  jugadorNombre: z
    .string()
    .min(3, 'Mínimo 3 caracteres')
    .max(50, 'Máximo 50 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/, 'Solo letras permitidas'),
  jugadorApellido: z
    .string()
    .min(3, 'Mínimo 3 caracteres')
    .max(50, 'Máximo 50 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/, 'Solo letras permitidas'),
  jugadorEmail: z
    .string()
    .min(5, 'Email demasiado corto')
    .email('Email inválido'),
  jugadorTelefono: z
    .string()
    .min(1, 'El teléfono es requerido')
    .regex(/^\+?[\d\s\-]{7,15}$/, 'Teléfono inválido (7–15 dígitos)'),
  observaciones: z
    .string()
    .min(3, 'Mínimo 3 caracteres')
    .max(200, 'Máximo 200 caracteres'),
});
