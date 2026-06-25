import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { complexSchema } from '../schemas/complexSchema';

const DEFAULT_VALUES = {
  name: '', city: '', address: '', price: '',
  openTime: '', closeTime: '', whatsapp: '',
  description: '', depositPercentage: '',
};

export function useComplexForm() {
  return useForm({
    resolver: zodResolver(complexSchema),
    defaultValues: DEFAULT_VALUES,
  });
}
