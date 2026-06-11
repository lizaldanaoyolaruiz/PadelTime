import { STATUS_MAP } from '../utils/constants';

export function StatusBadge({ status }) {
  const { label, cls } = STATUS_MAP[status] || { label: status, cls: '' };
  return <span className={`gc-badge ${cls}`}>{label}</span>;
}
