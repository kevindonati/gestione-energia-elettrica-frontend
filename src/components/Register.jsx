import { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../App.css";

const Register = ({ onRegister }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    name: "",
    surname: "",
  });

  const navigate = useNavigate();

  const registrationStyle = {
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (onRegister) {
      onRegister(formData);
    }

    navigate("/login");
  };

  return (
    <div style={registrationStyle} className="registration-container">
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={5}>
            <div className="glass-card p-5 my-5">
              <div className="text-center mb-4">
                <h2 className="fw-bold text-black">Crea Account</h2>
                <p className="text-black-50">
                  Inserisci i tuoi dati per registrarti
                </p>
              </div>

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label className="text-black">Nome</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    placeholder="Inserisci il tuo nome"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="text-black">Cognome</Form.Label>
                  <Form.Control
                    type="text"
                    name="surname"
                    placeholder="Inserisci il tuo cognome"
                    value={formData.surname}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="text-black">Username</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    placeholder="Scegli un username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="text-black">Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="esempio@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="text-black">Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="Inserisci la password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Button
                  variant="warning"
                  className="w-100 py-2 fw-bold shadow-sm"
                  type="submit"
                >
                  REGISTRATI
                </Button>

                <div className="text-center mt-3">
                  <small className="text-black-50">
                    Hai già un account?{" "}
                    <Link to="/login" className="text-warning fw-bold">
                      Accedi qui
                    </Link>
                  </small>
                </div>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Register;
