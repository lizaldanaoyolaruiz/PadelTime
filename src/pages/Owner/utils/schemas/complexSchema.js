import { z } from 'zod';
import { CITIES } from '../../../../constants/cities';

const TIME_RE = /^([01]\d|2[0-3]):([0-5]\d)$/;
const NAME_RE = /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ0-9\s'\-&.]+$/;
const ADDRESS_RE = /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ0-9\s.,'-]+$/;

export const complexSchema = z
  .object({
    name: z
      .string()
      .min(3, 'Mínimo 3 caracteres')
      .max(100, 'Máximo 100 caracteres')
      .regex(NAME_RE, 'Solo letras, números, guiones y &'),
    city: z.enum(CITIES, { error: 'Seleccioná una ciudad' }),
    address: z
      .string()
      .min(5, 'Mínimo 5 caracteres')
      .max(120, 'Máximo 120 caracteres')
      .regex(ADDRESS_RE, 'Contiene caracteres no permitidos'),
    price: z.coerce
      .number({ error: 'Ingresá un número válido' })
      .positive('Debe ser mayor a 0')
      .max(999999, 'Precio demasiado alto'),
    openTime: z.string().min(1, 'El horario de apertura es requerido').regex(TIME_RE, 'Formato HH:MM requerido'),
    closeTime: z.string().min(1, 'El horario de cierre es requerido').regex(TIME_RE, 'Formato HH:MM requerido'),
    whatsapp: z
      .string()
      .min(1, 'El WhatsApp es requerido')
      .regex(/^\+?[0-9]{13}$/, 'Deben ser 13 dígitos, sin espacios (ej: +5493813550986)'),
    description: z
      .string()
      .min(3, 'Mínimo 3 caracteres')
      .max(500, 'Máximo 500 caracteres'),
    depositPercentage: z.preprocess(
      (val) => (val === '' || val === undefined || val === null ? undefined : Number(val)),
      z
        .number({
          error: (issue) =>
            issue.input === undefined
              ? 'El porcentaje de seña es requerido'
              : 'Ingresá un número válido',
        })
        .int('Debe ser un número entero')
        .min(0, 'Mínimo 0%')
        .max(100, 'Máximo 100%')
    ),
  })
  .refine(
    (d) => !d.openTime || !d.closeTime || d.openTime < d.closeTime,
    { message: 'El cierre debe ser posterior a la apertura', path: ['closeTime'] }
  );
