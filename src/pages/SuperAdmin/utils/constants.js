import { UserPlus, CheckCircle, AlertTriangle } from 'lucide-react';

export const FILTERS = [
  { key: 'ALL',       label: 'Todos'       },
  { key: 'PENDING',   label: 'Pendientes'  },
  { key: 'APPROVED',  label: 'Aprobados'   },
  { key: 'REJECTED',  label: 'Rechazados'  },
  { key: 'SUSPENDED', label: 'Suspendidos' },
];

export const STATUS_MAP = {
  PENDING:   { label: 'Pendiente',  cls: 'badge--pending'   },
  APPROVED:  { label: 'Aprobado',   cls: 'badge--approved'  },
  REJECTED:  { label: 'Rechazado',  cls: 'badge--rejected'  },
  SUSPENDED: { label: 'Suspendido', cls: 'badge--suspended' },
};

export const AVATAR_COLORS = [
  '#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B',
  '#10B981', '#6366F1', '#EF4444', '#14B8A6',
];

export const CHART_DATA = [
  { label: 'SEM 1', value: 28 },
  { label: 'SEM 2', value: 44 },
  { label: 'SEM 3', value: 72 },
  { label: 'SEM 4', value: 58 },
];

export const RECENT_ACTIVITY = [
  {
    Icon: UserPlus,
    colorCls: 'activity--user',
    title: 'Nuevo usuario registrado',
    detail: 'Carlos G. se unió como Jugador Pro en Club Madrid.',
    time: 'hace 5 min',
  },
  {
    Icon: CheckCircle,
    colorCls: 'activity--approved',
    title: 'Club Aprobado',
    detail: 'Padel Hub Sevilla ha sido activado correctamente.',
    time: 'hace 2 horas',
  },
  {
    Icon: AlertTriangle,
    colorCls: 'activity--error',
    title: 'Fallo en Pago',
    detail: "Error en la renovación automática de 'Elite Padel'.",
    time: 'hace 4 horas',
  },
];
