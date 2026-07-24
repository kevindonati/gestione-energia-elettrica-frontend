import { useState, useEffect } from "react"
import { fetchWithAuth } from "../services/api"
import { Container } from "react-bootstrap"

export default function FattureList() {
  const [fatture, setFatture] = useState([])

  const [anno, setAnno] = useState("")
  const [start, setStart] = useState("")
  const [end, setEnd] = useState("")
  const [minImporto, setMinImporto] = useState("")
  const [maxImporto, setMaxImporto] = useState("")

  const [sortBy, setSortBy] = useState("id")
  const [sortOrder, setSortOrder] = useState("asc")

  const loadFatture = async ({
    annoValue = anno,
    startValue = start,
    endValue = end,
    minImportoValue = minImporto,
    maxImportoValue = maxImporto,
    sortByValue = sortBy,
    sortOrderValue = sortOrder,
  } = {}) => {
    try {
      const params = new URLSearchParams({
        sortBy: sortByValue,
        order: sortOrderValue,
      })

      if (annoValue) {
        params.append("anno", annoValue)
      }

      if (startValue) {
        params.append("start", startValue)
      }

      if (endValue) {
        params.append("end", endValue)
      }

      if (minImportoValue) {
        params.append("minImporto", minImportoValue)
      }

      if (maxImportoValue) {
        params.append("maxImporto", maxImportoValue)
      }

      const res = await fetchWithAuth(`/fatture?${params.toString()}`)

      setFatture(res.content || [])
    } catch (err) {
      console.error("Errore caricamento fatture:", err.message)

      setFatture([])
    }
  }

  useEffect(() => {
    const loadInitialFatture = async () => {
      try {
        const params = new URLSearchParams({
          sortBy: "id",
          order: "asc",
        })

        const res = await fetchWithAuth(`/fatture?${params.toString()}`)

        setFatture(res.content || [])
      } catch (err) {
        console.error("Errore caricamento fatture:", err.message)

        setFatture([])
      }
    }

    loadInitialFatture()
  }, [])

  const handleFilterClick = () => {
    loadFatture()
  }

  const handleSortChange = async (newSortBy, newSortOrder) => {
    setSortBy(newSortBy)
    setSortOrder(newSortOrder)

    await loadFatture({
      sortByValue: newSortBy,
      sortOrderValue: newSortOrder,
    })
  }

  const handleResetFilters = () => {
    setAnno("")
    setStart("")
    setEnd("")
    setMinImporto("")
    setMaxImporto("")

    loadFatture({
      annoValue: "",
      startValue: "",
      endValue: "",
      minImportoValue: "",
      maxImportoValue: "",
    })
  }

  return (
    <Container className="mt-5">
      <div className="card p-3 mb-4 shadow-sm">
        <h3 className="mb-3">Gestione Fatture</h3>

        <div className="row g-3 mb-4">
          <div className="col-md-4">
            <label className="form-label fw-bold">Anno</label>

            <input
              type="number"
              className="form-control"
              placeholder="Es. 2024"
              value={anno}
              onChange={(e) => setAnno(e.target.value)}
            />
          </div>

          <div className="col-md-4">
            <label className="form-label fw-bold">Data Inizio</label>

            <input
              type="date"
              className="form-control"
              value={start}
              onChange={(e) => setStart(e.target.value)}
            />
          </div>

          <div className="col-md-4">
            <label className="form-label fw-bold">Data Fine</label>

            <input
              type="date"
              className="form-control"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
            />
          </div>

          <div className="col-md-4">
            <label className="form-label fw-bold">Importo Minimo</label>

            <input
              type="number"
              className="form-control"
              placeholder="Es. 100"
              min="0"
              step="0.01"
              value={minImporto}
              onChange={(e) => setMinImporto(e.target.value)}
            />
          </div>

          <div className="col-md-4">
            <label className="form-label fw-bold">Importo Massimo</label>

            <input
              type="number"
              className="form-control"
              placeholder="Es. 5000"
              min="0"
              step="0.01"
              value={maxImporto}
              onChange={(e) => setMaxImporto(e.target.value)}
            />
          </div>
        </div>

        <div className="row g-3 mb-4 align-items-end">
          <div className="col-md-4">
            <label className="form-label fw-bold">Ordina Per</label>

            <select
              className="form-select"
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value, sortOrder)}
            >
              <option value="id">ID Fattura</option>

              <option value="data">Data</option>

              <option value="importo">Importo</option>
            </select>
          </div>

          <div className="col-md-4">
            <label className="form-label fw-bold">Direzione</label>

            <select
              className="form-select"
              value={sortOrder}
              onChange={(e) => handleSortChange(sortBy, e.target.value)}
            >
              <option value="asc">Crescente (ASC)</option>

              <option value="desc">Decrescente (DESC)</option>
            </select>
          </div>

          <div className="col-md-4 d-flex gap-2">
            <button
              type="button"
              className="btn btn-primary flex-grow-1"
              onClick={handleFilterClick}
            >
              Applica Filtri
            </button>

            <button
              type="button"
              className="btn btn-secondary flex-grow-1"
              onClick={handleResetFilters}
            >
              Reset Filtri
            </button>
          </div>
        </div>
      </div>
      <div className="table-responsive">
        <table className="table table-striped table-hover align-middle">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Numero Fattura</th>
              <th>Data</th>
              <th>Importo</th>
              <th>Stato</th>
              <th>Cliente</th>
            </tr>
          </thead>

          <tbody>
            {fatture.length > 0 ? (
              fatture.map((f) => (
                <tr key={f.id}>
                  <td>{f.id}</td>

                  <td>{f.numeroFattura || "N/D"}</td>

                  <td>{f.data}</td>

                  <td>€ {f.importo}</td>

                  <td>{f.statoFattura?.nome || f.stato || "N/D"}</td>

                  <td>{f.cliente?.ragioneSociale || f.clienteId || "N/D"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-3">
                  Nessuna fattura trovata
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Container>
  )
}
