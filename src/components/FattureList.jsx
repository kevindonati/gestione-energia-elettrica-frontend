import { useState, useEffect } from "react";
import { fetchWithAuth } from "../services/api";

export default function FattureList() {
  const [fatture, setFatture] = useState([]);

  // Stati per Filtri
  const [anno, setAnno] = useState("");
  const [data, setData] = useState("");
  const [minImporto, setMinImporto] = useState("");
  const [maxImporto, setMaxImporto] = useState("");

  // Stati per Ordinamento
  const [sortBy, setSortBy] = useState("id");
  const [sortOrder, setSortOrder] = useState("asc");

  // Funzione isolata per quando clicchi "Applica Filtri"
  const handleFilterClick = async () => {
    try {
      const params = new URLSearchParams({
        sortBy: sortBy,
        order: sortOrder,
      });

      if (anno) params.append("anno", anno);
      if (data) params.append("data", data);
      if (minImporto) params.append("minImporto", minImporto);
      if (maxImporto) params.append("maxImporto", maxImporto);

      const res = await fetchWithAuth(`/fatture?${params.toString()}`);
      setFatture(res.content || res);
    } catch (err) {
      console.error("Errore caricamento fatture:", err.message);
    }
  };

  // Caricamento automatico iniziale e al cambio di ordinamento
  useEffect(() => {
    let isMounted = true;

    const getInitialData = async () => {
      try {
        const params = new URLSearchParams({
          sortBy: sortBy,
          order: sortOrder,
        });

        if (anno) params.append("anno", anno);
        if (data) params.append("data", data);
        if (minImporto) params.append("minImporto", minImporto);
        if (maxImporto) params.append("maxImporto", maxImporto);

        const res = await fetchWithAuth(`/fatture?${params.toString()}`);
        if (isMounted) {
          setFatture(res.content || res);
        }
      } catch (err) {
        console.error("Errore caricamento fatture:", err.message);
      }
    };

    getInitialData();

    return () => {
      isMounted = false;
    };
  }, [sortBy, sortOrder]);

  return (
    <div className="card p-3 mb-4 shadow-sm">
      <h3 className="mb-3">Gestione Fatture</h3>

      {/* --- SEZIONE FILTRI --- */}
      <div className="row g-2 mb-3">
        <div className="col-md-3">
          <label className="form-label fw-bold">Anno</label>
          <input
            type="number"
            className="form-control"
            placeholder="Es. 2024"
            value={anno}
            onChange={(e) => setAnno(e.target.value)}
          />
        </div>

        <div className="col-md-3">
          <label className="form-label fw-bold">Data Precisa</label>
          <input
            type="date"
            className="form-control"
            value={data}
            onChange={(e) => setData(e.target.value)}
          />
        </div>

        <div className="col-md-3">
          <label className="form-label fw-bold">Importo Minimo</label>
          <input
            type="number"
            className="form-control"
            placeholder="Es. 100"
            value={minImporto}
            onChange={(e) => setMinImporto(e.target.value)}
          />
        </div>

        <div className="col-md-3">
          <label className="form-label fw-bold">Importo Massimo</label>
          <input
            type="number"
            className="form-control"
            placeholder="Es. 5000"
            value={maxImporto}
            onChange={(e) => setMaxImporto(e.target.value)}
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
            <option value="id">ID Fattura</option>
            <option value="data">Data</option>
            <option value="importo">Importo</option>
            <option value="anno">Anno</option>
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
          <button className="btn btn-primary w-100" onClick={handleFilterClick}>
            Applica Filtri
          </button>
        </div>
      </div>

      {/* --- TABELLA FATTURE --- */}
      <div className="table-responsive">
        <table className="table table-striped table-hover align-middle">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Data</th>
              <th>Importo</th>
              <th>Stato</th>
              <th>Cliente</th>
            </tr>
          </thead>
          <tbody>
            {fatture && fatture.length > 0 ? (
              fatture.map((f) => (
                <tr key={f.id}>
                  <td>{f.id}</td>
                  <td>{f.data}</td>
                  <td>€ {f.importo}</td>
                  <td>{f.statoFattura?.nome || f.stato || "N/D"}</td>
                  <td>{f.cliente?.ragioneSociale || f.clienteId || "N/D"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-3">
                  Nessuna fattura trovata
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
