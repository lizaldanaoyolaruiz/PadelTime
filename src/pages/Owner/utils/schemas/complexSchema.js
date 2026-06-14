import { z } from 'zod';

const TIME_RE = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const complexSchema = z
  .object({
    name: z
      .string()
      .min(3, 'Mínimo 3 caracteres')
      .max(100, 'Máximo 100 caracteres'),
    location: z
      .string()
      .min(5, 'Mínimo 5 caracteres')
      .max(200, 'Máximo 200 caracteres'),
    city: z
      .string()
      .min(3, 'Mínimo 3 caracteres')
      .max(50, 'Máximo 50 caracteres')
      .regex(/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/, 'Solo letras permitidas'),
    price: z.coerce
      .number({ invalid_type_error: 'Ingresá un número válido' })
      .positive('Debe ser mayor a 0')
      .max(999999, 'Precio demasiado alto'),
    openTime: z.string().min(1, 'El horario de apertura es requerido').regex(TIME_RE, 'Formato HH:MM requerido'),
    closeTime: z.string().min(1, 'El horario de cierre es requerido').regex(TIME_RE, 'Formato HH:MM requerido'),
    whatsapp: z
      .string()
      .min(1, 'El WhatsApp es requerido')
      .regex(/^\+?[\d\s\-]{7,15}$/, 'Teléfono inválido (7–15 dígitos)'),
    description: z
      .string()
      .min(3, 'Mínimo 3 caracteres')
      .max(500, 'Máximo 500 caracteres'),
    depositPercentage: z
      .string()
      .min(1, 'El porcentaje es requerido')
      .pipe(
        z.coerce
          .number({ invalid_type_error: 'Ingresá un número válido' })
          .min(0, 'Mínimo 0%')
          .max(100, 'Máximo 100%')
      ),
  })
  .refine(
    (d) => !d.openTime || !d.closeTime || d.openTime < d.closeTime,
    { message: 'El cierre debe ser posterior a la apertura', path: ['closeTime'] }
  );
