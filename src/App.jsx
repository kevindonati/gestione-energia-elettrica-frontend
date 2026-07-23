import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Header from "./components/Header";
import Register from "./components/Register";
import Login from "./components/Login";
import Home from "./components/Home";
import FattureList from "./components/FattureList";
import ClientiList from "./components/ClientiList";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/auth/login" replace />;
  }
  return children;
};

function App() {
  const navigate = useNavigate();

  const handleLogin = async (credentials) => {
    try {
      const response = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Credenziali non valide");
      }

      const data = await response.json();
      console.log(data);
      if (data) {
        localStorage.setItem("token", data.accessToken);
      }

      console.log("Login effettuato con successo:", data);
      navigate("/home");
      return true;
    } catch (error) {
      console.error("Errore durante il login:", error.message);
      alert(`Login fallito: ${error.message}`);
      return false;
    }
  };

  const handleRegister = async (formData) => {
    try {
      const response = await fetch("http://localhost:3001/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Errore durante la registrazione");
      }

      const data = await response.json();
      console.log("Registrazione completata:", data);
      alert("Registrazione avvenuta con successo! Ora puoi accedere.");
      navigate("/auth/login");
      return true;
    } catch (error) {
      console.error("Errore durante la registrazione:", error.message);
      alert(`Registrazione fallita: ${error.message}`);
      return false;
    }
  };

  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<Navigate to="/auth/login" replace />} />

        <Route path="/auth/login" element={<Login onLogin={handleLogin} />} />
        <Route
          path="/auth/register"
          element={<Register onRegister={handleRegister} />}
        />

        {/* Rotta Protetta */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Header />
              <main className="container mt-4">
                <Home />
              </main>
            </ProtectedRoute>
          }
        />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <main className="container mt-4">
                <FattureList />
                <ClientiList />
                <Home />
              </main>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/auth/login" replace />} />
      </Routes>
    </div>
  );
}

export default App;
