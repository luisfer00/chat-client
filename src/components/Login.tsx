import React, { FormEventHandler, useEffect, useState } from "react";
import { Col, Form, Row, Button, Alert } from "react-bootstrap";
import socket from "../config/socket";

const Login = () => {
  const [name, setName] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    socket.on("error:login", (error) => {
      setError(error);
    });
  }, []);

  useEffect(() => {
    let timeOut: any
    if (error) {
      timeOut = setTimeout(() => setError(""), 2000);
    }

    return () => clearTimeout(timeOut)
  }, [error]);

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    const userName = name.trim();
    if (!userName) return setError('El nombre es requerido');

    socket.emit("user:login", userName);
  };

  return (
    <Row>
      <Col md={6}>
        <Form className="p-3 shadow rounded" onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            {error && <Alert variant='danger'>{error}</Alert>}
            <Form.Label>Nombre de usuario</Form.Label>
            <Form.Control
              placeholder="Usuario"
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Crear usuario
          </Button>
        </Form>
      </Col>
    </Row>
  );
};

export default Login;
