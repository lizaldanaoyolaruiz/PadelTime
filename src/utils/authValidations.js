import { z } from 'zod';

const NAME_RE   = /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ'-]+$/;
const STRONG_PW = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d])/;

const nameField = (label) =>
  z
    .string()
    .min(3,  `${label}: mínimo 3 caracteres`)
    .max(50,  `${label}: máximo 50 caracteres`)
    .regex(NAME_RE, `${label}: solo letras (sin números ni símbolos)`);

const passwordField = z
  .string()
  .min(8,  'Mínimo 8 caracteres')
  .max(64,  'Máximo 64 caracteres')
  .regex(STRONG_PW, 'Debe incluir mayúscula, minúscula, número y carácter especial');

const emailField = z
  .string()
  .min(3,   'Mínimo 3 caracteres')
  .max(100,  'Máximo 100 caracteres')
  .email('Ingresa un correo electrónico válido');

export const loginSchema = z.object({
  email:    emailField,
  password: passwordField,
});

export const registerSchema = z
  .object({
    nombre:          nameField('Nombre'),
    apellido:        nameField('Apellido'),
    email:           emailField,
    password:        passwordField,
    confirmPassword: z.string().min(3, 'Repite tu contraseña'),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });
