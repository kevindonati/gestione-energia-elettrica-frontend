import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchWithAuth } from "../services/api";

function ClientiEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [indirizzi, setIndirizzi] = useState([]);

  const [formData, setFormData] = useState({
    tipoCliente: "SRL",
    ragioneSociale: "",
    partitaIva: "",
    email: "",
    dataUltimoContatto: "",
    fatturatoAnnuale: "",
    pec: "",
    telefono: "",
    nomeContatto: "",
    cognomeContatto: "",
    emailContatto: "",
    telefonoContatto: "",
    sedeOperativa: "",
    sedeLegale: "",
  });

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingData(true);
        setError("");

        const [indirizziData, clienteData] = await Promise.all([
          fetchWithAuth("/indirizzi"),
          fetchWithAuth(`/clienti/${id}`),
        ]);

        setIndirizzi(indirizziData.content ?? indirizziData);

        if (clienteData) {
          setFormData({
            tipoCliente: clienteData.tipoCliente ?? "SRL",
            ragioneSociale: clienteData.ragioneSociale ?? "",
            partitaIva: clienteData.partitaIva ?? "",
            email: clienteData.email ?? "",
            dataUltimoContatto: clienteData.dataUltimoContatto
              ? clienteData.dataUltimoContatto.split("T")[0]
              : "",
            fatturatoAnnuale: clienteData.fatturatoAnnuale ?? "",
            pec: clienteData.pec ?? "",
            telefono: clienteData.telefono ?? "",
            nomeContatto: clienteData.nomeContatto ?? "",
            cognomeContatto: clienteData.cognomeContatto ?? "",
            emailContatto: clienteData.emailContatto ?? "",
            telefonoContatto: clienteData.telefonoContatto ?? "",
            sedeOperativa:
              clienteData.sedeOperativa?.id ?? clienteData.sedeOperativa ?? "",
            sedeLegale:
              clienteData.sedeLegale?.id ?? clienteData.sedeLegale ?? "",
          });
        }
      } catch (err) {
        setError(
          err.message || "Errore durante il recupero dei dati del cliente.",
        );
      } finally {
        setLoadingData(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await fetchWithAuth(`/clienti/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tipoCliente: formData.tipoCliente,
          ragioneSociale: formData.ragioneSociale,
          partitaIva: formData.partitaIva,
          email: formData.email,
          dataUltimoContatto: formData.dataUltimoContatto || null,
          fatturatoAnnuale: Number(formData.fatturatoAnnuale) || 0,
          pec: formData.pec,
          telefono: formData.telefono,
          nomeContatto: formData.nomeContatto,
          cognomeContatto: formData.cognomeContatto,
          emailContatto: formData.emailContatto,
          telefonoContatto: formData.telefonoContatto,
          sedeOperativa: formData.sedeOperativa || null,
          sedeLegale: formData.sedeLegale || null,
        }),
      });

      setSuccess("Cliente aggiornato con successo!");
    } catch (err) {
      setError(
        err.message || "Si è verificato un errore durante l'aggiornamento.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="container mt-5">
        <div className="d-flex justify-content-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Caricamento dati cliente...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-9">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="card-title mb-0">Modifica Cliente</h2>
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => navigate(-1)}
                >
                  Indietro
                </button>
              </div>

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              {success && (
                <div className="alert alert-success" role="alert">
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <h5 className="text-primary mb-3">Dati Aziendali</h5>
                <div className="row g-3 mb-4">
                  <div className="col-md-8">
                    <label htmlFor="ragioneSociale" className="form-label">
                      Ragione sociale
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="ragioneSociale"
                      name="ragioneSociale"
                      value={formData.ragioneSociale}
                      onChange={handleChange}
                      placeholder="Es. Acme S.r.l."
                      required
                    />
                  </div>

                  <div className="col-md-4">
                    <label htmlFor="tipoCliente" className="form-label">
                      Tipo cliente
                    </label>
                    <select
                      className="form-select"
                      id="tipoCliente"
                      name="tipoCliente"
                      value={formData.tipoCliente}
                      onChange={handleChange}
                      required
                    >
                      <option value="PA">PA</option>
                      <option value="SAS">SAS</option>
                      <option value="SPA">SPA</option>
                      <option value="SRL">SRL</option>
                    </select>
                  </div>

                  <div className="col-md-4">
                    <label htmlFor="partitaIva" className="form-label">
                      Partita IVA
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="partitaIva"
                      name="partitaIva"
                      value={formData.partitaIva}
                      onChange={handleChange}
                      maxLength="11"
                      minLength="11"
                      placeholder="11 cifre"
                      required
                    />
                  </div>

                  <div className="col-md-4">
                    <label htmlFor="fatturatoAnnuale" className="form-label">
                      Fatturato annuale (€)
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">€</span>
                      <input
                        type="number"
                        className="form-control"
                        id="fatturatoAnnuale"
                        name="fatturatoAnnuale"
                        value={formData.fatturatoAnnuale}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div className="col-md-4">
                    <label htmlFor="dataUltimoContatto" className="form-label">
                      Data ultimo contatto
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      id="dataUltimoContatto"
                      name="dataUltimoContatto"
                      value={formData.dataUltimoContatto}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-4">
                    <label htmlFor="telefono" className="form-label">
                      Telefono aziendale
                    </label>
                    <input
                      type="tel"
                      className="form-control"
                      id="telefono"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                      placeholder="+39 011 123456"
                      required
                    />
                  </div>

                  <div className="col-md-4">
                    <label htmlFor="email" className="form-label">
                      Email aziendale
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="info@azienda.it"
                      required
                    />
                  </div>

                  <div className="col-md-4">
                    <label htmlFor="pec" className="form-label">
                      PEC
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="pec"
                      name="pec"
                      value={formData.pec}
                      onChange={handleChange}
                      placeholder="azienda@pec.it"
                      required
                    />
                  </div>
                </div>

                <h5 className="text-primary mb-3">Contatto Principale</h5>
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label htmlFor="nomeContatto" className="form-label">
                      Nome contatto
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="nomeContatto"
                      name="nomeContatto"
                      value={formData.nomeContatto}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="cognomeContatto" className="form-label">
                      Cognome contatto
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="cognomeContatto"
                      name="cognomeContatto"
                      value={formData.cognomeContatto}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="emailContatto" className="form-label">
                      Email contatto
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="emailContatto"
                      name="emailContatto"
                      value={formData.emailContatto}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="telefonoContatto" className="form-label">
                      Telefono contatto
                    </label>
                    <input
                      type="tel"
                      className="form-control"
                      id="telefonoContatto"
                      name="telefonoContatto"
                      value={formData.telefonoContatto}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <h5 className="text-primary mb-3">Sedi</h5>
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label htmlFor="sedeOperativa" className="form-label">
                      Sede operativa
                    </label>
                    <select
                      className="form-select"
                      id="sedeOperativa"
                      name="sedeOperativa"
                      value={formData.sedeOperativa}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Seleziona un indirizzo</option>
                      {indirizzi.map((ind) => (
                        <option key={ind.id} value={ind.id}>
                          {ind.via} {ind.civico}, {ind.localita} ({ind.cap})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="sedeLegale" className="form-label">
                      Sede legale
                    </label>
                    <select
                      className="form-select"
                      id="sedeLegale"
                      name="sedeLegale"
                      value={formData.sedeLegale}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Seleziona un indirizzo</option>
                      {indirizzi.map((ind) => (
                        <option key={ind.id} value={ind.id}>
                          {ind.via} {ind.civico}, {ind.localita} ({ind.cap})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => navigate(-1)}
                  >
                    Annulla
                  </button>
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
                      "Salva modifiche"
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

export default ClientiEdit;
