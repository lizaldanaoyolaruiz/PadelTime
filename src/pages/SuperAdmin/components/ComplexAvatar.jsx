import { avatarColor } from '../utils/utils';

export function ComplexAvatar({ name }) {
  const letter = name?.[0]?.toUpperCase() || '?';
  return (
    <div className="gc-avatar" style={{ background: avatarColor(name || '') }}>
      {letter}
    </div>
  );
}
