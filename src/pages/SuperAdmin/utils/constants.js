export const FILTERS = [
  { key: "ALL", label: "Todos" },
  { key: "pending", label: "Pendientes" },
  { key: "approved", label: "Aprobados" },
  { key: "rejected", label: "Rechazados" },
  { key: "suspended", label: "Suspendidos" },
];

export const STATUS_MAP = {
  pending: { label: "Pendiente", cls: "badge--pending" },
  approved: { label: "Aprobado", cls: "badge--approved" },
  rejected: { label: "Rechazado", cls: "badge--rejected" },
  suspended: { label: "Suspendido", cls: "badge--suspended" },
};

export const AVATAR_COLORS = [
  "#3B82F6",
  "#8B5CF6",
  "#EC4899",
  "#F59E0B",
  "#10B981",
  "#6366F1",
  "#EF4444",
  "#14B8A6",
];
