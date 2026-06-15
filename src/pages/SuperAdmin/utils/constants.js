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
