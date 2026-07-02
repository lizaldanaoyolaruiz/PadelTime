import { z } from 'zod';

const NAME_RE = /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ0-9\s'\-&.]+$/;
const ADDRESS_RE = /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ0-9\s.,'-]+$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export const CATEGORIAS = [
  { value: 'amateur',     label: 'Amateur'     },
  { value: 'intermedio',  label: 'Intermedio'  },
  { value: 'avanzado',    label: 'Avanzado'    },
  { value: 'profesional', label: 'Profesional' },
  { value: 'mixto',       label: 'Mixto'       },
];

export const ESTADOS = [
  { value: 'activo',     label: 'Activo'     },
  { value: 'finalizado', label: 'Finalizado' },
  { value: 'cancelado',  label: 'Cancelado'  },
];

export const tournamentSchema = z
  .object({
    nombre:      z.string().min(3, 'Mínimo 3 caracteres').max(100, 'Máximo 100 caracteres').regex(NAME_RE, 'Solo letras, números, guiones y &'),
    descripcion: z.string().max(500, 'Máximo 500 caracteres').optional(),
    fechaInicio: z.string().min(1, 'La fecha de inicio es obligatoria').regex(DATE_RE, 'Formato de fecha inválido'),
    fechaFin:    z.string().min(1, 'La fecha de fin es obligatoria').regex(DATE_RE, 'Formato de fecha inválido'),
    ubicacion:   z.string().min(3, 'Mínimo 3 caracteres').max(100, 'Máximo 100 caracteres').regex(ADDRESS_RE, 'Contiene caracteres no permitidos'),
    cupoMaximo:  z.coerce
      .number({ error: 'Ingresá un número válido' })
      .int('Debe ser un número entero')
      .positive('Debe ser mayor a 0')
      .max(9999, 'Máximo 9999'),
    categoria: z.enum(
      ['amateur', 'intermedio', 'avanzado', 'profesional', 'mixto'],
      { error: 'Seleccioná una categoría' }
    ),
    estado: z.enum(
      ['activo', 'finalizado', 'cancelado'],
      { error: 'Seleccioná un estado' }
    ),
    whatsapp: z
      .string()
      .regex(/^\+?[0-9]{13}$/, 'Deben ser 13 dígitos, sin espacios (ej: +5493813550986)')
      .optional()
      .or(z.literal('')),
  })
  .refine(
    d => !d.fechaInicio || !d.fechaFin || new Date(d.fechaFin) >= new Date(d.fechaInicio),
    { message: 'La fecha de fin no puede ser anterior a la de inicio', path: ['fechaFin'] }
  );
