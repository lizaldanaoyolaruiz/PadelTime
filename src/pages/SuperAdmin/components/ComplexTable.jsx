import {
  Eye,
  CheckCircle,
  XCircle,
  PauseCircle,
  Pencil,
  Trash2,
} from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { ComplexAvatar } from "./ComplexAvatar";
import { SkeletonRow } from "./Skeletons";
import { EmptyState } from "./EmptyState";
import { formatDate } from "../utils/utils";

export function ComplexTable({ filtered, loading, onDetail, onAction }) {
  return (
    <div className="gc-table-wrap">
      <table className="gc-table">
        <thead>
          <tr>
            <th>Complejo</th>
            <th>Owner</th>
            <th>Ubicación</th>
            <th>Fecha Registro</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            [...Array(5)].map((_, i) => <SkeletonRow key={i} />)
          ) : filtered.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ padding: 0 }}>
                <EmptyState />
              </td>
            </tr>
          ) : (
            filtered.map((complex) => (
              <tr
                key={complex._id}
                className="gc-table-row"
                style={{ cursor: "pointer" }}
                onClick={() => onDetail(complex)}
              >
                <td>
                  <div className="gc-complex-cell">
                    <ComplexAvatar name={complex.name} />
                    <span className="gc-complex-name">{complex.name}</span>
                  </div>
                </td>
                <td>
                  <div className="gc-owner-cell">
                    <span className="gc-owner-name">{complex.owner?.name}</span>
                    <span className="gc-owner-email">
                      {complex.owner?.email}
                    </span>
                  </div>
                </td>
                <td>
                  <span className="gc-location">
                    {complex.city}, {complex.province}
                  </span>
                </td>
                <td>
                  <span className="gc-date">
                    {formatDate(complex.registeredAt)}
                  </span>
                </td>
                <td>
                  <StatusBadge status={complex.status} />
                </td>
                <td onClick={(e) => e.stopPropagation()}>
                  <div className="gc-row-actions">
                    <button
                      className="gc-action-btn gc-action-btn--view"
                      onClick={() => onDetail(complex)}
                      title="Ver detalle"
                      aria-label="Ver detalle"
                    >
                      <Eye size={14} />
                    </button>
                    {complex.status === "pending" && (
                      <>
                        <button
                          className="gc-action-btn gc-action-btn--approve"
                          onClick={() => onAction("approve", complex)}
                          title="Aprobar"
                          aria-label="Aprobar"
                        >
                          <CheckCircle size={14} />
                        </button>
                        <button
                          className="gc-action-btn gc-action-btn--reject"
                          onClick={() => onAction("reject", complex)}
                          title="Rechazar"
                          aria-label="Rechazar"
                        >
                          <XCircle size={14} />
                        </button>
                      </>
                    )}
                    {complex.status === "approved" && (
                      <button
                        className="gc-action-btn gc-action-btn--suspend"
                        onClick={() => onAction("suspend", complex)}
                        title="Suspender"
                        aria-label="Suspender"
                      >
                        <PauseCircle size={14} />
                      </button>
                    )}
                    <button
                      className="gc-action-btn gc-action-btn--edit"
                      onClick={() => onAction("edit", complex)}
                      title="Editar"
                      aria-label="Editar"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      className="gc-action-btn gc-action-btn--delete"
                      onClick={() => onAction("delete", complex)}
                      title="Eliminar"
                      aria-label="Eliminar"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
