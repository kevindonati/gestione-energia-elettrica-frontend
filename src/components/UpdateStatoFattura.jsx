import { useEffect, useState } from "react";
import { fetchWithAuth } from "../services/api";

function UpdateStatoFattura() {
  const [statiFattura, setStatiFattura] = useState([]);

  const [selectedId, setSelectedId] = useState("");
  const [nome, setNome] = useState("");

  const [loadingData, setLoadingData] = useState(true);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ==========================================
  // CARICAMENTO STATI FATTURA
  // ==========================================

  useEffect(() => {
    const fetchStatiFattura = async () => {
      try {
        setLoadingData(true);
        setError("");

        const data = await fetchWithAuth(
          "/stati-fattura"
        );

        setStatiFattura(
          data.content ?? data
        );

      } catch (err) {
        setError(err.message);

      } finally {
        setLoadingData(false);
      }
    };

    fetchStatiFattura();
  }, []);


  const handleSelectChange = (event) => {
    const id = event.target.value;

    setSelectedId(id);
    setError("");
    setSuccess("");

    if (!id) {
      setNome("");
      return;
    }

    const selectedStato =
      statiFattura.find(
        (stato) => String(stato.id) === String(id)
      );

    if (selectedStato) {
      setNome(selectedStato.nome);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedId) {
      setError(
        "Seleziona uno stato fattura da modificare."
      );

      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await fetchWithAuth(
        `/stati-fattura/${selectedId}`,
        {
          method: "PUT",

          body: JSON.stringify({
            nome: nome.trim(),
          }),
        }
      );

      setSuccess(
        "Stato fattura aggiornato con successo!"
      );

      setStatiFattura((previousStati) =>
        previousStati.map((stato) =>
          String(stato.id) === String(selectedId)
            ? {
                ...stato,
                nome: nome.trim(),
              }
            : stato
        )
      );

    } catch (err) {
      setError(err.message);

    } finally {
      setLoading(false);
    }
  };




  if (loadingData) {
    return (
      <div className="container mt-5">
        <div className="d-flex justify-content-center">

          <div
            className="spinner-border"
            role="status"
          >
            <span className="visually-hidden">
              Caricamento...
            </span>
          </div>

        </div>
      </div>
    );
  }



  return (
    <div className="container py-5">
      <div className="row justify-content-center">

        <div className="col-12 col-md-10 col-lg-7">

          <div className="card shadow-sm">

            <div className="card-body p-4">

              <h2 className="card-title mb-4">
                Modifica stato fattura
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


              <div className="mb-4">

                <label
                  htmlFor="statoFattura"
                  className="form-label"
                >
                  Seleziona stato da modificare
                </label>

                <select
                  className="form-select"
                  id="statoFattura"
                  value={selectedId}
                  onChange={handleSelectChange}
                >

                  <option value="">
                    Seleziona uno stato
                  </option>

                  {statiFattura.map((stato) => (

                    <option
                      key={stato.id}
                      value={stato.id}
                    >
                      {stato.nome}
                    </option>

                  ))}

                </select>

              </div>



              {selectedId && (

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
                      Modifica il nome dello stato selezionato.
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

                          Salvataggio...
                        </>
                      ) : (
                        "Aggiorna stato"
                      )}

                    </button>

                  </div>

                </form>

              )}

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default UpdateStatoFattura;