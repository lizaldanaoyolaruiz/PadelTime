import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
// Importa tus íconos de lucide-react aquí abajo si los usas
// import { Mail, Phone, ... } from 'lucide-react';

// 1. Esquema de validación con Zod (Se queda igual)
const contactSchema = z.object({
  nombre: z.string().min(3, { message: "El nombre debe tener al menos 3 caracteres" }),
  email: z.string().email({ message: "Introduce un email válido" }),
  asunto: z.string().min(1, { message: "Selecciona un asunto" }),
  mensaje: z.string().min(10, { message: "El mensaje debe tener al menos 10 caracteres" }),
});

export default function ContactPage() {
  const [status, setStatus] = useState({ type: null, message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: { asunto: 'Soporte Técnico' }
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setStatus({ type: null, message: '' });

    try {
      // Llamada a tu API interna que maneja el envío SMTP
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setStatus({ type: 'success', message: '¡Mensaje enviado con éxito!' });
        reset(); 
      } else {
        setStatus({ type: 'error', message: 'Hubo un error al enviar el mensaje.' });
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'Error de conexión con el servidor.' });
    } finally {
      setIsSubmitting(false);
    }
  };}