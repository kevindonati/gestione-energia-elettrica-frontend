import { useState, useEffect } from "react";
import { fetchWithAuth } from "../services/api";

export default function FattureList() {
  const [fatture, setFatture] = useState([]);

  const [anno, setAnno] = useState("");
  const [data, setData] = useState("");
  const [minImporto, setMinImporto] = useState("");
  const [maxImporto, setMaxImporto] = useState("");

  const loadFatture = async () => {
    try {
      const params = new URLSearchParams();
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

  useEffect(() => {
    loadFatture();
  }, []);

  return (
    <div className="card p-3 shadow-sm">
      <h3>Filtro Fatture</h3>

      <div className="row g-2 mb-3 align-items-end">
        <div className="col-md-2">
          <label className="form-label">Anno</label>
          <input
            type="number"
            className="form-control"
            placeholder="Es. 2024"
            value={anno}
            onChange={(e) => setAnno(e.target.value)}
          />
        </div>

        <div className="col-md-3">
          <label className="form-label">Data Precisa</label>
          <input
            type="date"
            className="form-control"
            value={data}
            onChange={(e) => setData(e.target.value)}
          />
        </div>

        <div className="col-md-2">
          <label className="form-label">Importo Min</label>
          <input
            type="number"
            className="form-control"
            value={minImporto}
            onChange={(e) => setMinImporto(e.target.value)}
          />
        </div>

        <div className="col-md-2">
          <label className="form-label">Importo Max</label>
          <input
            type="number"
            className="form-control"
            value={maxImporto}
            onChange={(e) => setMaxImporto(e.target.value)}
          />
        </div>

        <div className="col-md-3">
          <button className="btn btn-success w-100" onClick={loadFatture}>
            Filtra Fatture
          </button>
        </div>
      </div>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Data</th>
            <th>Importo</th>
            <th>Stato</th>
            <th>Cliente</th>
          </tr>
        </thead>
        <tbody>
          {fatture.map((f) => (
            <tr key={f.id}>
              <td>{f.id}</td>
              <td>{f.data}</td>
              <td>€ {f.importo}</td>
              <td>{f.statoFattura?.nome || f.stato}</td>
              <td>{f.cliente?.ragioneSociale || f.clienteId}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
