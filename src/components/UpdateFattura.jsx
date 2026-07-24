import { useEffect, useState } from "react";
import { fetchWithAuth } from "../services/api";

function UpdateFattura() {
  const [fatture, setFatture] = useState([]);
  const [clienti, setClienti] = useState([]);
  const [statiFattura, setStatiFattura] = useState([]);

  const [selectedFatturaId, setSelectedFatturaId] = useState("");

  const [formData, setFormData] = useState({
    numero: "",
    data: "",
    importo: "",
    clienteId: "",
    statoFatturaId: "",
  });

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [loadingFattura, setLoadingFattura] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingData(true);
        setError("");

        const [fattureData, clientiData, statiData] = await Promise.all([
          fetchWithAuth("/fatture"),
          fetchWithAuth("/clienti"),
          fetchWithAuth("/stati-fattura"),
        ]);

        setFatture(fattureData.content ?? fattureData);

        setClienti(clientiData.content ?? clientiData);

        setStatiFattura(statiData.content ?? statiData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, []);

  const handleFatturaChange = async (event) => {
    const fatturaId = event.target.value;

    setSelectedFatturaId(fatturaId);

    if (!fatturaId) {
      setFormData({
        numero: "",
        data: "",
        importo: "",
        clienteId: "",
        statoFatturaId: "",
      });

      return;
    }

    try {
      setLoadingFattura(true);
      setError("");
      setSuccess("");

      const fatturaData = await fetchWithAuth(`/fatture/${fatturaId}`);

      setFormData({
        numero: fatturaData.numero,
        data: fatturaData.data,
        importo: fatturaData.importo,
        clienteId: fatturaData.cliente.id,
        statoFatturaId: fatturaData.statoFattura.id,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingFattura(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedFatturaId) {
      setError("Seleziona una fattura da modificare.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await fetchWithAuth(`/fatture/${selectedFatturaId}`, {
        method: "PUT",

        body: JSON.stringify({
          numero: formData.numero,
          data: formData.data,
          importo: Number(formData.importo),
          clienteId: formData.clienteId,
          statoFatturaId: formData.statoFatturaId,
        }),
      });

      setSuccess("Fattura aggiornata con successo!");

      setFatture((previousFatture) =>
        previousFatture.map((fattura) =>
          fattura.id === selectedFatturaId
            ? {
                ...fattura,
                numero: formData.numero,
                data: formData.data,
                importo: Number(formData.importo),
              }
            : fattura,
        ),
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
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Caricamento...</span>
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
              <h2 className="card-title mb-4">Modifica fattura</h2>

              {/* MESSAGGIO ERRORE */}

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              {/* MESSAGGIO SUCCESSO */}

              {success && (
                <div className="alert alert-success" role="alert">
                  {success}
                </div>
              )}

              {/* ==================================
                  DROPDOWN FATTURE
              ================================== */}

              <div className="mb-4">
                <label htmlFor="fatturaId" className="form-label">
                  Seleziona la fattura da modificare
                </label>

                <select
                  className="form-select"
                  id="fatturaId"
                  value={selectedFatturaId}
                  onChange={handleFatturaChange}
                  disabled={loadingFattura}
                >
                  <option value="">Seleziona una fattura</option>

                  {fatture.map((fattura) => (
                    <option key={fattura.id} value={fattura.id}>
                      {fattura.numero} - {fattura.data} - € {fattura.importo}
                    </option>
                  ))}
                </select>

                {loadingFattura && (
                  <div className="form-text">Caricamento dati fattura...</div>
                )}
              </div>

              {selectedFatturaId && !loadingFattura && (
                <form onSubmit={handleSubmit}>
                  {/* NUMERO */}

                  <div className="mb-3">
                    <label htmlFor="numero" className="form-label">
                      Numero fattura
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      id="numero"
                      name="numero"
                      value={formData.numero}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* DATA */}

                  <div className="mb-3">
                    <label htmlFor="data" className="form-label">
                      Data
                    </label>

                    <input
                      type="date"
                      className="form-control"
                      id="data"
                      name="data"
                      value={formData.data}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* IMPORTO */}

                  <div className="mb-3">
                    <label htmlFor="importo" className="form-label">
                      Importo (€)
                    </label>

                    <div className="input-group">
                      <span className="input-group-text">€</span>

                      <input
                        type="number"
                        className="form-control"
                        id="importo"
                        name="importo"
                        value={formData.importo}
                        onChange={handleChange}
                        min="0.01"
                        step="0.01"
                        required
                      />
                    </div>
                  </div>

                  {/* CLIENTE */}

                  <div className="mb-3">
                    <label htmlFor="clienteId" className="form-label">
                      Cliente
                    </label>

                    <select
                      className="form-select"
                      id="clienteId"
                      name="clienteId"
                      value={formData.clienteId}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Seleziona un cliente</option>

                      {clienti.map((cliente) => (
                        <option key={cliente.id} value={cliente.id}>
                          {cliente.ragioneSociale} - P.Iva: {cliente.partitaIva}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* STATO */}

                  <div className="mb-4">
                    <label htmlFor="statoFatturaId" className="form-label">
                      Stato fattura
                    </label>

                    <select
                      className="form-select"
                      id="statoFatturaId"
                      name="statoFatturaId"
                      value={formData.statoFatturaId}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Seleziona uno stato</option>

                      {statiFattura.map((stato) => (
                        <option key={stato.id} value={stato.id}>
                          {stato.nome}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* BUTTON */}

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
                        "Aggiorna fattura"
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

export default UpdateFattura;
