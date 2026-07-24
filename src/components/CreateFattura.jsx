import { useEffect, useState } from "react"
import { fetchWithAuth } from "../services/api"
import { Link } from "react-router-dom"

function CreateFattura() {
  const [clienti, setClienti] = useState([])
  const [statiFattura, setStatiFattura] = useState([])

  const [formData, setFormData] = useState({
    numero: "",
    data: "",
    importo: "",
    clienteId: "",
    statoFatturaId: "",
  })

  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingData(true)
        setError("")

        const [clientiData, statiData] = await Promise.all([
          fetchWithAuth("/clienti"),
          fetchWithAuth("/stati-fattura"),
        ])

        setClienti(clientiData.content ?? clientiData)
        setStatiFattura(statiData.content ?? statiData)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoadingData(false)
      }
    }

    fetchData()
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const data = await fetchWithAuth("/fatture", {
        method: "POST",
        body: JSON.stringify({
          numero: formData.numero,
          data: formData.data,
          importo: Number(formData.importo),
          clienteId: formData.clienteId,
          statoFatturaId: formData.statoFatturaId,
        }),
      })

      setSuccess(`Fattura creata con successo! ID: ${data?.id ?? ""}`)

      setFormData({
        numero: "",
        data: "",
        importo: "",
        clienteId: "",
        statoFatturaId: "",
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loadingData) {
    return (
      <div className="container mt-5">
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Caricamento...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-7">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <h2 className="card-title mb-4">Crea nuova fattura</h2>

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
                    placeholder="Es. FT-2026-001"
                    required
                  />

                  <div className="form-text">
                    Inserisci il numero identificativo della fattura.
                  </div>
                </div>

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
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>

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

                <div className="mb-4">
                  <label htmlFor="statoFatturaId" className="form-label m-0">
                    Stato fattura
                  </label>

                  <Link
                    className="small text-primary m-0 d-block"
                    to="/modifica-stato-fattura"
                  >
                    Modifica stato fattura
                  </Link>

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
                      "Crea fattura"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateFattura
