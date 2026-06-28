import { Building2 } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="gc-empty">
      <div className="gc-empty-icon">
        <Building2 size={38} />
      </div>
      <h3>No se encontraron complejos</h3>
      <p>Intenta ajustar los filtros o el término de búsqueda.</p>
    </div>
  );
}
