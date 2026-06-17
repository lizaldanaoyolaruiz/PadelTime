import "./ClientPanel.css";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

function PanelCliente() {
  const reservas = [
    {
      complejo: "La Caldera Padel",
      cancha: "Pista 1",
      fecha: "15 julio, 2026",
      hora: "18:30 - 20:00",
      estado: "Confirmada",
      fechaCompleta: "2026-07-15",
    },
    {
      complejo: "Tucuman Padel",
      cancha: "Pista 3",
      fecha: "10 julio, 2025",
      hora: "10:00 - 11:30",
      estado: "Pendiente",
      fechaCompleta: "2025-07-10",
    },
    {
      complejo: "Alpha Padel",
      cancha: "Pista 2",
      fecha: "04 marzo, 2025",
      hora: "20:00 - 21:30",
      estado: "Finalizado",
      fechaCompleta: "2025-03-04",
    },
    {
      complejo: "Bullnes Padel",
      cancha: "Pista 4",
      fecha: "20 enero, 2025",
      hora: "16:00 - 17:30",
      estado: "Cancelado",
      fechaCompleta: "2025-01-20",
    },
    {
      complejo: "City Padel",
      cancha: "Pista 1",
      fecha: "05 noviembre, 2024",
      hora: "09:00 - 10:30",
      estado: "Finalizado",
      fechaCompleta: "2024-11-05",
    },
  ];
  const reservasOrdenadas = [...reservas].sort(
    (a, b) => new Date(b.fechaCompleta) - new Date(a.fechaCompleta),
  );

  return (
    <div className="panel-cliente-page">
      <Navbar />

      <div className="panel">
        <div className="left-column">
          <div className="card profile-card">
            <div className="profile-header">
              <img src="https://i.pravatar.cc/150" alt="perfil" />

              <div>
                <h2>Facundo Camaño</h2>
                <p>Nivel: 2.2 • Jugador Novato</p>
              </div>
            </div>

            <div className="stats">
              <div className="stat-box">
                <span>PARTIDOS</span>
                <h3>12</h3>
              </div>

              <div className="stat-box">
                <span>VICTORIAS</span>
                <h3>1</h3>
              </div>
            </div>
          </div>

          <div className="next-match">
            <div className="tag">PRÓXIMO PARTIDO</div>

            <h1>Mañana, 18:30</h1>

            <p>En Bullnes Padel</p>

            <div className="countdown">
              <div>
                <h2>22</h2>
                <span>HORAS</span>
              </div>

              <div>
                <h2>14</h2>
                <span>MINS</span>
              </div>
            </div>
          </div>

          <div className="card settings-card">
            <h3>Configuración de Cuenta</h3>

            <ul>
              <li>Editar Información</li>
              <li>Notificaciones</li>
              <li className="logout">Cerrar Sesión</li>
            </ul>
          </div>
        </div>

        <div className="right-column">
          <div className="tabs">
            <span className="active-tab">Mis Reservas</span>

            <span>Mis Favoritos</span>

            <span>Datos de Facturación</span>
          </div>

          <h2>Historial de Actividad</h2>

          {reservasOrdenadas.map((reserva, index) => (
            <div key={index} className="reservation-card">
              <img src={`https://picsum.photos/100?random=${index}`} alt="" />

              <div className="reservation-info">
                <h3>{reserva.complejo}</h3>

                <p>
                  <strong>Cancha:</strong> {reserva.cancha}
                </p>

                <p>
                  <strong>Fecha:</strong> {reserva.fecha}
                </p>

                <p>
                  <strong>Horario:</strong> {reserva.hora}
                </p>
              </div>

              <span className={`status ${reserva.estado.toLowerCase()}`}>
                {reserva.estado}
              </span>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default PanelCliente;
