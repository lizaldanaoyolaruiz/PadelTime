import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import api from "../../services/axios";
import { toastError } from "../../utils/toasts";
import Swal from "sweetalert2";
import "./BookingConfirmation.css";

const MESES = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [datosReserva, setDatosReserva] = useState(location.state || null);
  const [cargando, setCargando] = useState(!location.state);
  const [errorCarga, setErrorCarga] = useState(null);
  const [procesandoPago, setProcesandoPago] = useState(false);
  const [procesandoWA, setProcesandoWA] = useState(false);
  const [pagoIniciado, setPagoIniciado] = useState(false);
  const [pagoRechazado, setPagoRechazado] = useState(false);
  const [bookingId, setBookingId] = useState(null);

  const mercadopagoActive = datosReserva?.mercadopagoActive ?? false;

  useEffect(() => {
    if (!pagoIniciado || !bookingId) return;

    const check = async () => {
      try {
        await api.patch(`/bookings/${bookingId}/verify-mp`).catch(() => {});
        const res = await api.get(`/bookings/${bookingId}`);
        const status = res.data.booking?.status;
        if (status === "confirmed") navigate("/panelcliente");
        else if (status === "cancelled" || status === "rejected") {
          setPagoIniciado(false);
          setPagoRechazado(true);
        }
      } catch {}
    };

    const interval = setInterval(check, 5000);
    return () => clearInterval(interval);
  }, [pagoIniciado, bookingId, navigate]);

  useEffect(() => {
    if (location.state) return;

    const courtId = searchParams.get("courtId");
    const complexId = searchParams.get("complexId");
    const date = searchParams.get("date");
    const startTime = searchParams.get("startTime");
    const endTime = searchParams.get("endTime");

    if (!courtId || !complexId || !date || !startTime || !endTime) {
      setErrorCarga("Datos de reserva incompletos.");
      setCargando(false);
      return;
    }

    (async () => {
      try {
        const [courtRes, complexRes] = await Promise.all([
          api.get(`/courts/public/${courtId}`),
          api.get(`/complexes/public/${complexId}`),
        ]);

        const court = courtRes.data.court;
        const complex = complexRes.data.complex;

        const fechaObj = new Date(`${date}T12:00:00`);
        const precioAlquiler = court.pricePerHour || 0;
        const depositPct = complex.depositPercentage || 30;
        const total = precioAlquiler;
        const senia = Math.round((total * depositPct) / 100);

        setDatosReserva({
          courtId,
          complexId,
          date,
          startTime,
          endTime,
          canchaNombre: court.name,
          canchaImagen: court.photo || null,
          clubNombre: complex.name,
          ubicacion: complex.city || complex.location || "",
          dia: fechaObj.getDate(),
          mesNombre: MESES[fechaObj.getMonth()],
          anio: fechaObj.getFullYear(),
          horario: `${startTime} - ${endTime}`,
          precioAlquiler,
          precioLuz: 0,
          total,
          senia,
        });
      } catch {
        setErrorCarga(
          "No se pudo cargar la información de la cancha. Intentá de nuevo.",
        );
      } finally {
        setCargando(false);
      }
    })();
  }, []);

  if (cargando) {
    return (
      <div style={{ textAlign: "center", padding: "100px", color: "#fff" }}>
        <p>Cargando información de la reserva...</p>
      </div>
    );
  }

  if (errorCarga || !datosReserva) {
    return (
      <div style={{ textAlign: "center", padding: "100px", color: "#fff" }}>
        <h2>{errorCarga || "No hay ninguna reserva en proceso."}</h2>
        <button
          onClick={() => navigate("/")}
          style={{ padding: "10px", marginTop: "20px", cursor: "pointer" }}
        >
          Volver al inicio
        </button>
      </div>
    );
  }

  const handleMercadoPago = async () => {
    setProcesandoPago(true);
    try {
      const res = await api.post("/bookings", {
        court: datosReserva.courtId,
        complex: datosReserva.complexId,
        date: datosReserva.date,
        startTime: datosReserva.startTime,
        endTime: datosReserva.endTime,
        totalAmount: datosReserva.total,
        depositAmount: datosReserva.senia,
        confirmationMethod: "mercadopago",
      });

      const initPoint = res.data.payment?.initPoint;
      if (initPoint) {
        await Swal.fire({
          background: "#1f2937",
          color: "#ffffff",
          icon: "info",
          title: "¡Ya casi terminás!",
          html: "Serás redirigido a <strong>Mercado Pago</strong> para completar el pago.<br><br>Cuando el pago sea confirmado recibirás un <strong>email con los detalles de tu reserva</strong>.",
          confirmButtonText: "Ir a Mercado Pago",
          confirmButtonColor: "#a3e635",
          allowOutsideClick: false,
        });
        const bid = res.data.booking?._id;
        setBookingId(bid);
        window.open(initPoint, "_blank");
        setProcesandoPago(false);
        setPagoIniciado(true);
      } else {
        setProcesandoPago(false);
      }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Error al crear la reserva. Por favor intentá de nuevo.";
      toastError(message);
      setProcesandoPago(false);
    }
  };

  const handleWhatsApp = async () => {
    setProcesandoWA(true);
    try {
      const res = await api.post("/bookings", {
        court: datosReserva.courtId,
        complex: datosReserva.complexId,
        date: datosReserva.date,
        startTime: datosReserva.startTime,
        endTime: datosReserva.endTime,
        totalAmount: datosReserva.total,
        depositAmount: datosReserva.senia,
        confirmationMethod: "whatsapp",
      });

      const whatsappNumber = res.data.complex?.whatsapp;
      const text = encodeURIComponent(
        `Hola! Quiero confirmar mi reserva de ${datosReserva.canchaNombre} el día ${datosReserva.dia} de ${datosReserva.mesNombre} a las ${datosReserva.horario}.`,
      );
      window.open(`https://wa.me/${whatsappNumber}?text=${text}`, "_blank");
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Error al crear la reserva. Por favor intentá de nuevo.";
      toastError(message);
    } finally {
      setProcesandoWA(false);
    }
  };

  const formatearDinero = (monto) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(monto);
  };

  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="confirmation-main">
        <div className="confirmation-container">
          <div className="confirmation-left">
            <h1 className="confirmation-title">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="#bef264"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                width="24"
                height="24"
              >
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              Confirmar Reserva
            </h1>

            <div className="summary-card">
              <div className="club-summary-header">
                {datosReserva.canchaImagen && (
                  <img
                    src={datosReserva.canchaImagen}
                    alt={datosReserva.canchaNombre}
                    className="club-summary-img"
                  />
                )}
                <div className="club-summary-info">
                  <h2>{datosReserva.clubNombre}</h2>
                  <span className="location">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      width="14"
                      height="14"
                    >
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    {datosReserva.ubicacion}
                  </span>
                  <span className="court-badge">
                    {datosReserva.canchaNombre}
                  </span>
                </div>
              </div>

              <div className="datetime-row">
                <div className="datetime-block">
                  <span className="label">FECHA</span>
                  <span className="value">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#bef264"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      width="16"
                      height="16"
                    >
                      <rect
                        x="3"
                        y="4"
                        width="18"
                        height="18"
                        rx="2"
                        ry="2"
                      ></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    {datosReserva.dia} de {datosReserva.mesNombre}{" "}
                    {datosReserva.anio}
                  </span>
                </div>
                <div className="datetime-block">
                  <span className="label">HORARIO</span>
                  <span className="value">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#bef264"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      width="16"
                      height="16"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    {datosReserva.horario} (1h)
                  </span>
                </div>
              </div>
            </div>

            <div className="breakdown-card">
              <span className="label">Desglose de Pago</span>
              <div className="breakdown-row">
                <span>Alquiler {datosReserva.canchaNombre}</span>
                <span>{formatearDinero(datosReserva.precioAlquiler)}</span>
              </div>
              {datosReserva.precioLuz > 0 && (
                <div className="breakdown-row">
                  <span>Luz (Nocturno)</span>
                  <span>{formatearDinero(datosReserva.precioLuz)}</span>
                </div>
              )}

              <div className="breakdown-total">
                <span>Total Reserva</span>
                <span className="total-amount">
                  {formatearDinero(datosReserva.total)}
                </span>
              </div>

              <div className="deposit-warning">
                <div className="warning-header">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    width="16"
                    height="16"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                  </svg>
                  <span>
                    Seña requerida: {formatearDinero(datosReserva.senia)}
                  </span>
                </div>
                <p>El resto se abona en el club el día del turno.</p>
              </div>
            </div>
          </div>

          <div className="confirmation-right">
            <div className="payment-methods-card">
              <h2>Selecciona un método</h2>

              {mercadopagoActive && (
                <div className="method-box">
                  <div className="method-icon mp-icon">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      width="28"
                      height="28"
                    >
                      <rect
                        x="2"
                        y="4"
                        width="20"
                        height="16"
                        rx="2"
                        ry="2"
                      ></rect>
                      <line x1="2" y1="10" x2="22" y2="10"></line>
                    </svg>
                  </div>
                  <h3>Mercado Pago</h3>
                  <p>Confirmación Inmediata</p>
                  {pagoIniciado ? (
                    <div className="pago-iniciado-msg">
                      <span>✅ Pago iniciado</span>
                      <p>
                        Completá el pago en la pestaña de Mercado Pago.
                        Recibirás un email cuando tu reserva esté confirmada.
                      </p>
                    </div>
                  ) : (
                    <>
                      {pagoRechazado && (
                        <div className="pago-rechazado-msg">
                          <span>❌ Pago rechazado</span>
                          <p>
                            Tu pago no fue aprobado. Podés intentarlo
                            nuevamente.
                          </p>
                        </div>
                      )}
                      <button
                        className="btn-mp"
                        onClick={() => {
                          setPagoRechazado(false);
                          handleMercadoPago();
                        }}
                        disabled={procesandoPago}
                      >
                        {procesandoPago
                          ? "PROCESANDO..."
                          : pagoRechazado
                            ? "REINTENTAR PAGO"
                            : "PAGAR AHORA"}
                      </button>
                    </>
                  )}
                </div>
              )}

              {mercadopagoActive && (
                <div className="divider">
                  <span>O TAMBIÉN</span>
                </div>
              )}

              <div className="method-box">
                <div className="method-icon wa-icon">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    width="28"
                    height="28"
                  >
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                  </svg>
                </div>
                <h3>WhatsApp</h3>
                <p>Estado: Pendiente</p>
                <button
                  className="btn-wa"
                  onClick={handleWhatsApp}
                  disabled={procesandoWA}
                >
                  {procesandoWA ? "PROCESANDO..." : "RESERVAR VÍA CHAT"}
                </button>
              </div>

              <p className="terms-text">
                Al confirmar, aceptas nuestros{" "}
                <a href="#terminos">Términos de Servicio</a>.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BookingConfirmation;
