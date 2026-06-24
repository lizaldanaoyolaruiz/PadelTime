import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { torneoSchema } from '../schemas/torneoSchema';

const DEFAULTS = {
  nombre: '', descripcion: '', fechaInicio: '', fechaFin: '',
  ubicacion: '', cupoMaximo: '', categoria: '', estado: 'activo',
};

export function useTorneoForm(torneo = null) {
  return useForm({
    resolver: zodResolver(torneoSchema),
    defaultValues: torneo
      ? {
          nombre:      torneo.nombre,
          descripcion: torneo.descripcion || '',
          fechaInicio: torneo.fechaInicio?.split('T')[0] || '',
          fechaFin:    torneo.fechaFin?.split('T')[0]    || '',
          ubicacion:   torneo.ubicacion,
          cupoMaximo:  torneo.cupoMaximo,
          categoria:   torneo.categoria,
          estado:      torneo.estado,
        }
      : DEFAULTS,
  });
}
