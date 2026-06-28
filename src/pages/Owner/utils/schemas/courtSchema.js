import { z } from 'zod';

export const courtSchema = z.object({
  name: z
    .string()
    .min(3, 'Mínimo 3 caracteres')
    .max(50, 'Máximo 50 caracteres'),
  type: z.enum(['crystal', 'panoramic'], { errorMap: () => ({ message: 'Seleccioná una superficie válida' }) }),
  description: z
    .string()
    .min(3, 'Mínimo 3 caracteres')
    .max(300, 'Máximo 300 caracteres'),
});
