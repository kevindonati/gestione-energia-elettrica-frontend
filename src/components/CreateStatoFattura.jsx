import { useState } from "react";
import { fetchWithAuth } from "../services/api";

function CreateStatoFattura() {
  const [nome, setNome] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const data = await fetchWithAuth("/stati-fattura", {
        method: "POST",
        body: JSON.stringify({
          nome: nome.trim(),
        }),
      });

      setSuccess(
        `Stato fattura creato con successo! ID: ${data?.id ?? ""}`
      );

      setNome("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-7">
          <div className="card shadow-sm">
            <div className="card-body p-4">

              <h2 className="card-title mb-4">
                Crea nuovo stato fattura
              </h2>

              {error && (
                <div
                  className="alert alert-danger"
                  role="alert"
                >
                  {error}
                </div>
              )}

              {success && (
                <div
                  className="alert alert-success"
                  role="alert"
                >
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmit}>

                <div className="mb-4">
                  <label
                    htmlFor="nome"
                    className="form-label"
                  >
                    Nome stato
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    id="nome"
                    name="nome"
                    value={nome}
                    onChange={(event) =>
                      setNome(event.target.value)
                    }
                    placeholder="Es. PAGATA"
                    required
                  />

                  <div className="form-text">
                    Inserisci il nome del nuovo stato della fattura.
                  </div>
                </div>

                <div className="d-flex justify-content-end">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        />

                        Creazione...
                      </>
                    ) : (
                      "Crea stato"
                    )}
                  </button>
                </div>

              </form>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateStatoFattura;