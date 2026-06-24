import { z } from 'zod';

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

export const torneoSchema = z
  .object({
    nombre:      z.string().min(3, 'Mínimo 3 caracteres').max(100, 'Máximo 100 caracteres'),
    descripcion: z.string().max(500, 'Máximo 500 caracteres').optional(),
    fechaInicio: z.string().min(1, 'La fecha de inicio es obligatoria'),
    fechaFin:    z.string().min(1, 'La fecha de fin es obligatoria'),
    ubicacion:   z.string().min(3, 'Mínimo 3 caracteres').max(100, 'Máximo 100 caracteres'),
    cupoMaximo:  z.coerce
      .number({ invalid_type_error: 'Ingresá un número válido' })
      .int('Debe ser un número entero')
      .positive('Debe ser mayor a 0')
      .max(9999, 'Máximo 9999'),
    categoria: z.enum(
      ['amateur', 'intermedio', 'avanzado', 'profesional', 'mixto'],
      { errorMap: () => ({ message: 'Seleccioná una categoría' }) }
    ),
    estado: z.enum(
      ['activo', 'finalizado', 'cancelado'],
      { errorMap: () => ({ message: 'Seleccioná un estado' }) }
    ),
  })
  .refine(
    d => !d.fechaInicio || !d.fechaFin || new Date(d.fechaFin) >= new Date(d.fechaInicio),
    { message: 'La fecha de fin no puede ser anterior a la de inicio', path: ['fechaFin'] }
  );
