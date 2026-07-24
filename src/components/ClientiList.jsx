import { useState, useEffect } from "react"
import { fetchWithAuth } from "../services/api"
import { Container } from "react-bootstrap"

export default function ClientiList() {
  const [clienti, setClienti] = useState([])

  // Stati per Filtri
  const [nome, setNome] = useState("")
  const [fatturatoMin, setFatturatoMin] = useState("")
  const [dataInserimento, setDataInserimento] = useState("")
  const [dataUltimoContatto, setDataUltimoContatto] = useState("")

  // Stati per Ordinamento
  const [sortBy, setSortBy] = useState("ragioneSociale")
  const [sortOrder, setSortOrder] = useState("asc")

  // Funzione isolata per quando clicchi "Applica Filtri"
  const handleFilterClick = async () => {
    try {
      const params = new URLSearchParams({
        sortBy: sortBy,
        order: sortOrder,
      })

      if (nome) params.append("nome", nome)
      if (fatturatoMin) params.append("fatturato", fatturatoMin)
      if (dataInserimento) params.append("dataInserimento", dataInserimento)
      if (dataUltimoContatto)
        params.append("dataUltimoContatto", dataUltimoContatto)

      const data = await fetchWithAuth(`/clienti?${params.toString()}`)
      setClienti(data.content || data)
    } catch (err) {
      console.error("Errore caricamento clienti:", err.message)
    }
  }

  // Caricamento automatico iniziale e al cambio di ordinamento
  useEffect(() => {
    let isMounted = true

    const getInitialData = async () => {
      try {
        const params = new URLSearchParams({
          sortBy: sortBy,
          order: sortOrder,
        })

        if (nome) params.append("nome", nome)
        if (fatturatoMin) params.append("fatturato", fatturatoMin)
        if (dataInserimento) params.append("dataInserimento", dataInserimento)
        if (dataUltimoContatto)
          params.append("dataUltimoContatto", dataUltimoContatto)

        const data = await fetchWithAuth(`/clienti?${params.toString()}`)
        if (isMounted) {
          setClienti(data.content || data)
        }
      } catch (err) {
        console.error("Errore caricamento clienti:", err.message)
      }
    }

    getInitialData()

    return () => {
      isMounted = false
    }
  }, [sortBy, sortOrder])

  return (
    <Container className="mt-5">
      <div className="card p-3 mb-4 shadow-sm">
        <h3 className="mb-3">Gestione Clienti</h3>

        {/* --- SEZIONE FILTRI --- */}
        <div className="row g-2 mb-3">
          <div className="col-md-3">
            <label className="form-label fw-bold">Cerca Nome</label>
            <input
              type="text"
              className="form-control"
              placeholder="Parte del nome..."
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </div>

          <div className="col-md-3">
            <label className="form-label fw-bold">Fatturato Minimo</label>
            <input
              type="number"
              className="form-control"
              placeholder="Es. 50000"
              value={fatturatoMin}
              onChange={(e) => setFatturatoMin(e.target.value)}
            />
          </div>

          <div className="col-md-3">
            <label className="form-label fw-bold">Data Inserimento</label>
            <input
              type="date"
              className="form-control"
              value={dataInserimento}
              onChange={(e) => setDataInserimento(e.target.value)}
            />
          </div>

          <div className="col-md-3">
            <label className="form-label fw-bold">Data Ultimo Contatto</label>
            <input
              type="date"
              className="form-control"
              value={dataUltimoContatto}
              onChange={(e) => setDataUltimoContatto(e.target.value)}
            />
          </div>
        </div>

        {/* --- SEZIONE ORDINAMENTO E PULSANTE --- */}
        <div className="row g-2 mb-4 align-items-end">
          <div className="col-md-5">
            <label className="form-label fw-bold">Ordina Per</label>
            <select
              className="form-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="ragioneSociale">Nome / Ragione Sociale</option>
              <option value="fatturatoAnnuale">Fatturato Annuale</option>
              <option value="dataInserimento">Data Inserimento</option>
              <option value="dataUltimoContatto">Data Ultimo Contatto</option>
              <option value="indirizzoSedeLegale.comune.provincia">
                Provincia Sede Legale
              </option>
            </select>
          </div>

          <div className="col-md-4">
            <label className="form-label fw-bold">Direzione</label>
            <select
              className="form-select"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="asc">Crescente (ASC)</option>
              <option value="desc">Decrescente (DESC)</option>
            </select>
          </div>

          <div className="col-md-3">
            <button
              className="btn btn-primary w-100"
              onClick={handleFilterClick}
            >
              Applica Filtri
            </button>
          </div>
        </div>
      </div>
      {/* --- TABELLA CLIENTI --- */}
      <div className="table-responsive">
        <table className="table table-striped table-hover align-middle">
          <thead className="table-dark">
            <tr>
              <th>Nome</th>
              <th>Fatturato</th>
              <th>Data Ins.</th>
              <th>Ultimo Contatto</th>
              <th>Provincia</th>
            </tr>
          </thead>
          <tbody>
            {clienti && clienti.length > 0 ? (
              clienti.map((c) => (
                <tr key={c.id || c.ragioneSociale}>
                  <td>{c.ragioneSociale || c.nome}</td>
                  <td>€ {c.fatturatoAnnuale}</td>
                  <td>{c.dataInserimento}</td>
                  <td>{c.dataUltimoContatto}</td>
                  <td>{c.sedeLegale?.comune?.provincia?.nome || "N/D"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-3">
                  Nessun cliente trovato
                </td>
              </tr>
            )}
            {console.log(clienti)}
          </tbody>
        </table>
      </div>
    </Container>
  )
}
