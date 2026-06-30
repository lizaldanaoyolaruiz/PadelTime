export function SkeletonRow() {
  return (
    <tr>
      {[...Array(6)].map((_, i) => (
        <td key={i}>
          <div className="gc-skeleton" />
        </td>
      ))}
    </tr>
  );
}

export function SkeletonStatCard() {
  return (
    <div className="gc-stat-card">
      <div
        className="gc-skeleton"
        style={{ width: 44, height: 44, borderRadius: 10, marginBottom: 12 }}
      />
      <div
        className="gc-skeleton"
        style={{ width: 60, height: 28, marginBottom: 8, borderRadius: 6 }}
      />
      <div
        className="gc-skeleton"
        style={{ width: 100, height: 14, borderRadius: 4 }}
      />
    </div>
  );
}

export function SkeletonMobileCard() {
  return (
    <div className="gc-mobile-card">
      <div className="gc-skeleton" style={{ height: 72, borderRadius: 8 }} />
    </div>
  );
}
