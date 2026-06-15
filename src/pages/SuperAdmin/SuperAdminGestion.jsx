import { useState } from "react";
import "./SuperAdminGestion.css";
import { Building2, MapPin, Users, Calendar, Search } from "lucide-react";

export default function SuperAdminGestion() {
  const [complexList, setComplexList] = useState([
    {
      id: 1,
      name: "Padel Center Madrid",
      owner: "Alejandro Garrido",
      courts: 8,
      city: "Madrid",
      status: "Activo",
    },
    {
      id: 2,
      name: "Club Smash",
      owner: "Beatriz Luna",
      courts: 4,
      city: "Barcelona",
      status: "Suspendido",
    },
    {
      id: 3,
      name: "Padel Pro",
      owner: "Club Social",
      courts: 6,
      city: "Valencia",
      status: "Activo",
    },
  ]);

  const [search, setSearch] = useState("");
  const [selectedComplex, setSelectedComplex] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const [newComplex, setNewComplex] = useState({
    name: "",
    owner: "",
    courts: "",
    city: "",
  });
  const handleAddComplex = () => {
    if (
      !newComplex.name ||
      !newComplex.owner ||
      !newComplex.courts ||
      !newComplex.city
    ) {
      alert("Completa todos los campos");
      return;
    }

    const complex = {
      id: Date.now(),
      ...newComplex,
      courts: Number(newComplex.courts),
      status: "Activo",
    };

    setComplexList([...complexList, complex]);

    setNewComplex({
      name: "",
      owner: "",
      courts: "",
      city: "",
    });

    setShowAddModal(false);
  };
  const handleStatus = (id) => {
    setComplexList((prev) =>
      prev.map((complex) =>
        complex.id === id
          ? {
              ...complex,
              status: complex.status === "Activo" ? "Suspendido" : "Activo",
            }
          : complex,
      ),
    );
  };

  const handleEdit = (id) => {
    const newName = prompt("Ingrese el nuevo nombre del complejo");

    if (!newName) return;

    setComplexList((prev) =>
      prev.map((complex) =>
        complex.id === id ? { ...complex, name: newName } : complex,
      ),
    );
  };

  const filteredComplexes = complexList.filter(
    (complex) =>
      complex.name.toLowerCase().includes(search.toLowerCase()) ||
      complex.owner.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="complexes-page">
      <div className="stats-grid">
        <div className="stat-card">
          <Building2 size={28} />
          <h3>Total Complejos</h3>
          <h2>{complexList.length}</h2>
        </div>

        <div className="stat-card">
          <Calendar size={28} />
          <h3>Reservas Mes</h3>
          <h2>12.840</h2>
        </div>

        <div className="stat-card">
          <Users size={28} />
          <h3>Usuarios Activos</h3>
          <h2>45.2k</h2>
        </div>

        <div className="stat-card">
          <MapPin size={28} />
          <h3>Canchas Totales</h3>
          <h2>
            {complexList.reduce((acc, complex) => acc + complex.courts, 0)}
          </h2>
        </div>
      </div>

      <div className="table-container">
        <div className="table-header">
          <h2>Gestión de Complejos</h2>

          <div className="search-box">
            <Search size={18} />
            <input
              type="text"
              placeholder="Buscar complejo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <button className="add-btn" onClick={() => setShowAddModal(true)}>
            + Agregar Complejo
          </button>
        </div>

        <table>
          <thead>
            <tr>
              <th>Complejo</th>
              <th>Owner</th>
              <th>Canchas</th>
              <th>Ciudad</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {filteredComplexes.map((complex) => (
              <tr key={complex.id}>
                <td>{complex.name}</td>
                <td>{complex.owner}</td>
                <td>{complex.courts}</td>
                <td>{complex.city}</td>

                <td>
                  <span
                    className={`badge ${
                      complex.status === "Activo" ? "active" : "inactive"
                    }`}
                  >
                    {complex.status}
                  </span>
                </td>

                <td>
                  <button
                    className="edit-btn"
                    onClick={() => handleEdit(complex.id)}
                  >
                    Editar
                  </button>

                  <button
                    className="view-btn"
                    onClick={() => setSelectedComplex(complex)}
                  >
                    Ver
                  </button>

                  <button
                    className={
                      complex.status === "Activo"
                        ? "suspend-btn"
                        : "activate-btn"
                    }
                    onClick={() => handleStatus(complex.id)}
                  >
                    {complex.status === "Activo" ? "Suspender" : "Activar"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedComplex && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{selectedComplex.name}</h2>

            <p>
              <strong>Owner:</strong> {selectedComplex.owner}
            </p>

            <p>
              <strong>Canchas:</strong> {selectedComplex.courts}
            </p>

            <p>
              <strong>Ciudad:</strong> {selectedComplex.city}
            </p>

            <p>
              <strong>Estado:</strong> {selectedComplex.status}
            </p>

            <button
              className="close-btn"
              onClick={() => setSelectedComplex(null)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Nuevo Complejo</h2>

            <input
              type="text"
              placeholder="Nombre"
              value={newComplex.name}
              onChange={(e) =>
                setNewComplex({
                  ...newComplex,
                  name: e.target.value,
                })
              }
            />

            <input
              type="text"
              placeholder="Owner"
              value={newComplex.owner}
              onChange={(e) =>
                setNewComplex({
                  ...newComplex,
                  owner: e.target.value,
                })
              }
            />

            <input
              type="number"
              placeholder="Cantidad de canchas"
              value={newComplex.courts}
              onChange={(e) =>
                setNewComplex({
                  ...newComplex,
                  courts: e.target.value,
                })
              }
            />

            <input
              type="text"
              placeholder="Ciudad"
              value={newComplex.city}
              onChange={(e) =>
                setNewComplex({
                  ...newComplex,
                  city: e.target.value,
                })
              }
            />

            <div className="modal-actions">
              <button className="add-btn" onClick={handleAddComplex}>
                Guardar
              </button>

              <button
                className="close-btn"
                onClick={() => setShowAddModal(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
