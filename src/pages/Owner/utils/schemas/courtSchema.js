import { z } from 'zod';

export const courtSchema = z.object({
  name: z
    .string()
    .min(3, 'Mínimo 3 caracteres')
    .max(50, 'Máximo 50 caracteres'),
  type: z.string().min(1, 'Seleccioná una superficie'),
  pricePerHour: z.coerce
    .number({ invalid_type_error: 'Ingresá un número válido' })
    .positive('Debe ser mayor a 0')
    .max(999999, 'Precio demasiado alto'),
  description: z
    .string()
    .min(3, 'Mínimo 3 caracteres')
    .max(300, 'Máximo 300 caracteres'),
});
