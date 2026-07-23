import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Register from "./components/Register";
import Login from "./components/Login";

function App() {
  // Esempio di gestione chiamata API per il Login
  const handleLogin = async (credentials) => {
    console.log("Dati Login inviati:", credentials);
    // Qui inserirai la fetch/axios verso il tuo backend (es. POST /auth/login)
  };

  // Esempio di gestione chiamata API per la Registrazione
  const handleRegister = async (formData) => {
    console.log("Dati Registrazione inviati:", formData);
    // Qui inserirai la fetch/axios verso il tuo backend (es. POST /auth/register)
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
                  <h2 className="text-white">Benvenuto!</h2>
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
