import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { courtSchema } from '../schemas/courtSchema';

const DEFAULT_VALUES = {
  name: '', type: '', description: '',
};

export function useCourtForm(cancha = null) {
  return useForm({
    resolver: zodResolver(courtSchema),
    defaultValues: cancha
      ? {
          name:        cancha.name,
          type:        cancha.type,
          description: cancha.description || '',
        }
      : DEFAULT_VALUES,
  });
}
