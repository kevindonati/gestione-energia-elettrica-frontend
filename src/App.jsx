import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Register from "./components/Register";
import Login from "./components/Login";
import Home from "./components/Home";

function App() {
  const handleLogin = async (credentials) => {
    try {
      const response = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Credenziali non valide");
      }

      const data = await response.json();

      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      console.log("Login effettuato con successo:", data);
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
      return true;
    } catch (error) {
      console.error("Errore durante la registrazione:", error.message);
      alert(`Registrazione fallita: ${error.message}`);
      return false;
    }
  };

  return (
    <BrowserRouter>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />

          <Route path="/login" element={<Login onLogin={handleLogin} />} />

          <Route
            path="/register"
            element={<Register onRegister={handleRegister} />}
          />

          <Route
            path="/home"
            element={
              <>
                <Header />
                <main className="container mt-4">
                  <Home />
                </main>
              </>
            }
          />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
