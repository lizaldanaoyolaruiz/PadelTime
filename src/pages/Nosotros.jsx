import React from "react";
import { Container, Card, Col, Row } from "react-bootstrap";

const NosotrosPage = () => {
  return (
    <Container className="my-5">
      <Row className="text-center mb-5">
        <Col>
          <h1 className="display-3 fw-bold">EL FUTURO DEL PADEL</h1>
          <p className="lead fs-4">Nuestra mision es digitalizar el padel.</p>
          <p className="fs-5 text-secondary">
            Nacimos de la intersección entre la pasión por el deporte y la
            obsesión por la eficiencia tecnológica. En PadelSaaS, eliminamos las
            fricciones operativas para que los clubes crezcan y los jugadores
            nunca dejen de competir.
          </p>
        </Col>
      </Row>
      <Row className="g-4 mb-5 text-center">
        <Col md={3} sm={6}>
          <Card className="h-100 shadow-sm border-0">
            <Card.Body>
              <h2 className="display-4 fw-bold text-primary">404+</h2>
              <Card.Title>Clubes Activos</Card.Title>
              <Card.Text>
                Optimizando su gestión diaria con nuestra tecnología de punta.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6}>
          <Card className="h-100 shadow-sm border-0">
            <Card.Body>
              <h2 className="display-4 fw-bold text-primary">8+</h2>
              <Card.Title>Partido/Mes</Card.Title>
              <Card.Text>
                Reservas procesadas sin interrupciones ni errores humanos.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6}>
          <Card className="h-100 shadow-sm border-0">
            <Card.Body>
              <h2 className="display-4 fw-bold text-primary">4+</h2>
              <Card.Title>Canchas</Card.Title>
              <Card.Text>
                Digitalizadas y listas para ser reservadas en segundos.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6}>
          <Card className="h-100 shadow-sm border-0">
            <Card.Body>
              <h2 className="display-4 fw-bold text-primary">3+</h2>
              <Card.Title>Nuestra Vision 2027</Card.Title>
              <Card.Text>
                Liderar la transformación digital del deporte amateur en Europa,
                convirtiéndonos en el estándar de oro para la administración de
                recintos deportivos.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="g-4 mb-5">
        <Col md={6}>
          <Card className="h-100 border-0 bg-light">
            <Card.Body>
              <h3 className="fw-bold">Precision Tecnica</h3>
              <p>
                Algoritmos de optimización de horarios que maximizan la
                rentabilidad por cancha hasta en un 40%.{" "}
              </p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="h-100 border-0 bg-light">
            <Card.Body>
              <h3 className="fw-bold">Experiencia de Usuarios</h3>
              <p>
                Diseñado para ser veloz. Reservas completadas en menos de 3
                clics desde cualquier dispositivo.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <h2 className="text-center mb-4 fw-bold">El Equipo</h2>
      <p className="text-center text-secondary mb-5">
        Talento experto en SaaS y apasionados del deporte.
      </p>
      <Row className="g-4 mb-5 justify-content-center">
        <Col md={2} sm={4}>
          <Card className="text-center h-100 shadow-sm">
            <Card.Body>
              <h4 className="fw-bold">Marisol Lamas</h4>
              <p className="text-muted">Scrum Master</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={2} sm={4}>
          <Card className="text-center h-100 shadow-sm">
            <Card.Body>
              <h4 className="fw-bold">Aldana Liz Oyola Ruiz</h4>
              <p className="text-muted">Lider Tecnica</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={2} sm={4}>
          <Card className="text-center h-100 shadow-sm">
            <Card.Body>
              <h4 className="fw-bold">Facuando Camaño</h4>
            </Card.Body>
          </Card>
        </Col>
        <Col md={2} sm={4}>
          <Card className="text-center h-100 shadow-sm">
            <Card.Body>
              <h4 className="fw-bold">Octavio Fernández Caram</h4>
            </Card.Body>
          </Card>
        </Col>
        <Col md={2} sm={4}>
          <Card className="text-center h-100 shadow-sm">
            <Card.Body>
              <h4 className="fw-bold">Leandro Blanca</h4>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default NosotrosPage;
