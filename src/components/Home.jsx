import { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Spinner,
  Alert,
  Button,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../App.css";
import ClientiList from "./ClientiList";
import FattureList from "./FattureList";

const Home = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem("token");

        const response = await fetch("http://localhost:3001/utenti/me", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Impossibile recuperare i dati utente");
        }
        const data = await response.json();
        setUserData(data);

        console.log(data);

        setTimeout(() => {
          setUserData({
            name: data.name,
            surname: data.surname,
            username: data.username,
            email: data.email,
            ruoli: data.ruoli,
          });
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/auth/login");
  };

  const isAdmin = () => {
    console.log("Controllo se utente è admin");
    if (!userData) {
      console.log("Userdata non trovato");
      return false;
    }
    console.log("Utente è admin");
    return userData.ruoli.includes("ADMIN");
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-dark">
        <Spinner animation="border" variant="warning" />
      </div>
    );
  }

  return (
    <div className="home-container py-5" style={{ minHeight: "100vh" }}>
      <Container>
        {error && <Alert variant="danger">{error}</Alert>}

        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="text-black fw-bold">Dashboard Utente</h2>
          <Button variant="outline-light" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </div>

        <Row className="g-4">
          <Col md={6} lg={4}>
            <Card className="glass-card text-black h-100 border-0 shadow">
              <Card.Body>
                <Card.Title className="fw-bold border-bottom pb-2 mb-3">
                  Profilo Utente
                </Card.Title>
                <Card.Text>
                  <strong>Nome:</strong> {userData?.name}
                </Card.Text>
                <Card.Text>
                  <strong>Cognome:</strong> {userData?.surname}
                </Card.Text>
                <Card.Text>
                  <strong>Username:</strong> {userData?.username}
                </Card.Text>
                <Card.Text>
                  <strong>Email:</strong> {userData?.email}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6} lg={8}>
            <Card className="glass-card text-black h-100 border-0 shadow">
              <Card.Body>
                <Card.Title className="fw-bold border-bottom pb-2 mb-3">
                  Pannello di Controllo
                </Card.Title>
                <Row className="text-center my-4">
                  <Col>
                    <div className="p-3 bg-black bg-opacity-10 rounded">
                      <h3 className="text-black fw-bold">2.4 kW</h3>
                      <p className="text-black-50 mb-0">Consumo Attuale</p>
                    </div>
                  </Col>
                  <Col>
                    <div className="p-3 bg-black bg-opacity-10 rounded">
                      <h3 className="text-black fw-bold">Attivo</h3>
                      <p className="text-black-50 mb-0">Stato Contatore</p>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        {isAdmin() && (
          <div className="admin-section mt-5 pt-3">
            <hr className="my-5" />
            <h3 className="mb-4 text-center fw-bold text-black">
              Gestione Clienti e Fatture
            </h3>
            <ClientiList />
            <hr className="my-5" />
            <FattureList />
          </div>
        )}
      </Container>
    </div>
  );
};

export default Home;
