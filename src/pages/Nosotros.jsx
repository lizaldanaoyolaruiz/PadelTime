import React from "react";
import { Container, Card, Col, Row } from "react-bootstrap";
import "./nosotros.css";

const NosotrosPage = () => {
  return (
    <Container className="container">
      <Row className="row-principal">
        <Col>
          <h1 className="h1-hero">EL FUTURO DEL PADEL</h1>
          <p className="p-hero">Nuestra mision es digitalizar el padel.</p>
          <p className="p-hero-text">
            Nacimos de la intersección entre la pasión por el deporte y la
            obsesión por la eficiencia tecnológica. En PadelSaaS, eliminamos las
            fricciones operativas para que los clubes crezcan y los jugadores
            nunca dejen de competir.
          </p>
        </Col>
      </Row>
      <Row className="row-card">
        <Col md={3} sm={6}>
          <Card className="card">
            <Card.Body>
              <h2 className="text-titulo">404+</h2>
              <Card.Title>Clubes Activos</Card.Title>
              <Card.Text>
                Optimizando su gestión diaria con nuestra tecnología de punta.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6}>
          <Card className="card">
            <Card.Body>
              <h2 className="text-titulo">8+</h2>
              <Card.Title>Partido/Mes</Card.Title>
              <Card.Text>
                Reservas procesadas sin interrupciones ni errores humanos.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6}>
          <Card className="card">
            <Card.Body>
              <h2 className="text-titulo">4+</h2>
              <Card.Title>Canchas</Card.Title>
              <Card.Text>
                Digitalizadas y listas para ser reservadas en segundos.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6}>
          <Card className="card-descrip">
            <Card.Body>
              <h2 className="text-titulo">Nuestra Vision 2027</h2>
              <Card.Text>
                Liderar la transformación digital del deporte amateur en Europa,
                convirtiéndonos en el estándar de oro para la administración de
                recintos deportivos.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="row-description">
        <Col md={6}>
          <Card className="card-descrip">
            <Card.Body>
              <h3 className="text-titulo">Precision Tecnica</h3>
              <p>
                Algoritmos de optimización de horarios que maximizan la
                rentabilidad por cancha hasta en un 40%.{" "}
              </p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="card-descrip">
            <Card.Body>
              <h3 className="text-titulo">Experiencia de Usuarios</h3>
              <p>
                Diseñado para ser veloz. Reservas completadas en menos de 3
                clics desde cualquier dispositivo.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <h2 className="text-titulo">El Equipo</h2>
      <p className="text-descEquipo">
        Talento experto en SaaS y apasionados del deporte.
      </p>
      <Row className="row-intengrantes">
        <Col md={2} sm={4}>
          <Card className="card-integrante">
            <Card.Body>
              <img src="https://randomuser.me/api/portraits/women/68.jpg" alt="Marisol Lamas" className="avatar-img" />
              <h4 className="text-inten-nom">Marisol Lamas</h4>
              <p className="text-muted">Scrum Master</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={2} sm={4}>
          <Card className="card-integrante">
            <Card.Body>
              <img src="https://randomuser.me/api/portraits/women/32.jpg" alt="Aldana Liz Oyola Ruiz" className="avatar-img" />
              <h4 className="text-inten-nom">Aldana Liz Oyola Ruiz</h4>
              <p className="text-muted">Lider Tecnica</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={2} sm={4}>
          <Card className="card-integrante">
            <Card.Body>
              <img src="https://randomuser.me/api/portraits/men/52.jpg" alt="Facuando Camaño" className="avatar-img" />
              <h4 className="text-inten-nom">Facuando Camaño</h4>
            </Card.Body>
          </Card>
        </Col>
        <Col md={2} sm={4}>
          <Card className="card-integrante">
            <Card.Body>
              <img src="https://randomuser.me/api/portraits/men/33.jpg" alt="Octavio Fernández Caram" className="avatar-img" />  
              <h4 className="text-inten-nom">Octavio Fernández Caram</h4>
            </Card.Body>
          </Card>
        </Col>
        <Col md={2} sm={4}>
          <Card className="card-integrante">
            <Card.Body>
              <img src="https://randomuser.me/api/portraits/men/75.jpg" alt="Leandro Blanca" className="avatar-img" />  
              <h4 className="text-inten-nom">Leandro Blanca</h4>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default NosotrosPage;
