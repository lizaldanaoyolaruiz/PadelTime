import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { reservationSchema } from '../schemas/reservationSchema';

const DEFAULT_VALUES = {
  canchaId: '', fecha: '',
  horaInicio: '', jugadorNombre: '', jugadorApellido: '',
  jugadorEmail: '', jugadorTelefono: '', observaciones: '',
};

export function useReservationForm() {
  return useForm({
    resolver: zodResolver(reservationSchema),
    defaultValues: DEFAULT_VALUES,
  });
}
