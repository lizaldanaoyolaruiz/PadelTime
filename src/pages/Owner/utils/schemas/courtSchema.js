import { z } from 'zod';

const NAME_RE = /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ0-9\s'-]+$/;

export const courtSchema = z.object({
  name: z
    .string()
    .min(3, 'Mínimo 3 caracteres')
    .max(50, 'Máximo 50 caracteres')
    .regex(NAME_RE, 'Solo letras, números y espacios'),
  type: z.enum(['crystal', 'panoramic'], { error: 'Seleccioná una superficie válida' }),
  description: z
    .string()
    .min(3, 'Mínimo 3 caracteres')
    .max(300, 'Máximo 300 caracteres'),
});
