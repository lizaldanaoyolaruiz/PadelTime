import { Car, Container } from "lucide-react";
import React from "react";
import { Card, Col, Row } from "react-bootstrap";

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
    </Container>
  );
};

export default NosotrosPage;
