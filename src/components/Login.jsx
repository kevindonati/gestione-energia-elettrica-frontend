import { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../App.css";

const Login = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const loginStyle = {
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (onLogin) {
      onLogin(credentials);
    }

    navigate("/home");
  };

  return (
    <div style={loginStyle} className="registration-container">
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={5}>
            <div className="glass-card p-5 mt-5">
              <div className="text-center mb-4">
                <h2 className="fw-bold text-black">Bentornato</h2>
                <p className="text-black-50">Accedi al tuo account</p>
              </div>

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label className="text-black">Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="Inserisci la tua email"
                    value={credentials.email}
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
                    value={credentials.password}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Button
                  variant="warning"
                  className="w-100 py-2 fw-bold shadow-sm"
                  type="submit"
                >
                  ACCEDI
                </Button>

                <div className="text-center mt-3">
                  <small className="text-white-50">
                    Non hai un account?{" "}
                    <Link to="/register" className="text-warning fw-bold">
                      Registrati
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

export default Login;
