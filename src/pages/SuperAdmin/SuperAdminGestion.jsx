import { useState } from "react";



import "./SuperAdminGestion.css"

export default function SuperAdminDashboard() {
  
  const [owners, setOwners] = useState([
    {
      id: 1,
      name: "Mari Lamas",
      email: "a.garrido@padelmaster.com",
      complexes: 4,
      status: "ACTIVO",
    },
    {
      id: 2,
      name: "Aldana Ruiz",
      email: "b.luna@lunapadel.es",
      complexes: 2,
      status: "SUSPENDIDO",
    },
  ]);


  const stats = {
    complexes: 142,
    reservations: 12840,
    users: 45200,
  };

  const toggleStatus = (id) => {
    setOwners(
      owners.map((owner) =>
        owner.id === id
          ? {
              ...owner,
              status:
                owner.status === "ACTIVO"
                  ? "SUSPENDIDO"
                  : "ACTIVO",
            }
          : owner
      )
    );
  };

  return (
    <div className="super-admin">
      <h1>Panel Super Admin</h1>

      <div className="stats-container">
        <div className="stat-card">
          <h3>Total Complejos</h3>
          <p>{stats.complexes}</p>
        </div>

        <div className="stat-card">
          <h3>Reservas</h3>
          <p>{stats.reservations}</p>
        </div>

        <div className="stat-card">
          <h3>Usuarios</h3>
          <p>{stats.users}</p>
        </div>
      </div>

      <div className="owners-section">
        <h2>Gestión de Owners</h2>

        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Complejos</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {owners.map((owner) => (
              <tr key={owner.id}>
                <td>{owner.name}</td>
                <td>{owner.email}</td>
                <td>{owner.complexes}</td>
                <td>
                  <span
                    className={
                      owner.status === "ACTIVO"
                        ? "active"
                        : "suspended"
                    }
                  >
                    {owner.status}
                  </span>
                </td>

                <td>
                  <button
                    onClick={() => toggleStatus(owner.id)}
                  >
                    {owner.status === "ACTIVO"
                      ? "Suspender"
                      : "Activar"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
