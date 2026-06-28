import "./ClientPanel.css";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

function PanelCliente() {
  const reservas = [
    {
      club: "La Caldera Padel",
      fecha: "15 julio, 2026",
      hora: "18:30 - 20:00",
      estado: "Confirmado",
    },
    {
      club: "Tucumam Psddel",
      fecha: "10 julio, 2024",
      hora: "10:00 - 11:30",
      estado: "Finalizado",
    },
    {
      club: "Alpha Padel",
      fecha: "04 Julio, 2024",
      hora: "20:00 - 21:30",
      estado: "Cancelado",
    },
  ];

  return (
    <div className="panel-cliente-page">
      <Navbar />

      <div className="panel">

        <div className="left-column">

         <div className="card profile-card">
            <div className="profile-header">
             <img
              src="https://i.pravatar.cc/150"
              alt="perfil"/>

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
          <div className="tag">
            PRÓXIMO PARTIDO
          </div>

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
            <li className="logout">
              Cerrar Sesión
            </li>
          </ul>
        </div>
      </div>

      <div className="right-column">

        <div className="tabs">
          <span className="active-tab">
            Mis Reservas
          </span>

          <span>Mis Favoritos</span>

          <span>Datos de Facturación</span>
        </div>

        <h2>Historial de Actividad</h2>

        {reservas.map((reserva, index) => (
          <div
            key={index}
            className="reservation-card"
          >
            <img
              src={`https://picsum.photos/100?random=${index}`}
              alt=""
            />

            <div className="reservation-info">
              <h3>{reserva.club}</h3>
              <p>{reserva.fecha}</p>
              <p>{reserva.hora}</p>
            </div>

            <span
              className={`status ${reserva.estado.toLowerCase()}`}
                >
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