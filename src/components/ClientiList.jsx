import { useState, useEffect } from "react";
import { fetchWithAuth } from "../services/api";
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function ClientiList() {
  const [clienti, setClienti] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(0);
  const navigate = useNavigate();

  const handleEditClick = (id) => {
    navigate(`/modifica-cliente/${id}`);
  };

  const [ragioneSociale, setRagioneSociale] = useState("");
  const [fatturatoMin, setFatturatoMin] = useState("");
  const [fatturatoMax, setFatturatoMax] = useState("");
  const [dataInserimentoStart, setDataInserimentoStart] = useState("");
  const [dataInserimentoEnd, setDataInserimentoEnd] = useState("");
  const [dataUltimoContattoStart, setDataUltimoContattoStart] = useState("");
  const [dataUltimoContattoEnd, setDataUltimoContattoEnd] = useState("");

  const [activeFilters, setActiveFilters] = useState({});

  const [sortBy, setSortBy] = useState("ragioneSociale");

  useEffect(() => {
    let ignore = false;

    const loadData = async () => {
      try {
        const params = new URLSearchParams({
          page,
          size: 10,
          sortBy,
        });

        if (activeFilters.ragioneSociale)
          params.append("ragioneSociale", activeFilters.ragioneSociale);
        if (activeFilters.fatturatoMin)
          params.append("fatturatoMin", activeFilters.fatturatoMin);
        if (activeFilters.fatturatoMax)
          params.append("fatturatoMax", activeFilters.fatturatoMax);
        if (activeFilters.dataInserimentoStart)
          params.append(
            "dataInserimentoStart",
            activeFilters.dataInserimentoStart,
          );
        if (activeFilters.dataInserimentoEnd)
          params.append("dataInserimentoEnd", activeFilters.dataInserimentoEnd);
        if (activeFilters.dataUltimoContattoStart)
          params.append(
            "dataUltimoContattoStart",
            activeFilters.dataUltimoContattoStart,
          );
        if (activeFilters.dataUltimoContattoEnd)
          params.append(
            "dataUltimoContattoEnd",
            activeFilters.dataUltimoContattoEnd,
          );

        const res = await fetchWithAuth(`/clienti?${params.toString()}`);

        if (!ignore) {
          setClienti(res.content || []);
          setTotalPages(res.totalPages || 0);
        }
      } catch (err) {
        if (!ignore) {
          console.error("Errore nel caricamento dei clienti:", err.message);
          setClienti([]);
        }
      }
    };

    loadData();

    return () => {
      ignore = true;
    };
  }, [page, sortBy, activeFilters]);

  const handleFilterClick = () => {
    setPage(0);
    setActiveFilters({
      ragioneSociale,
      fatturatoMin,
      fatturatoMax,
      dataInserimentoStart,
      dataInserimentoEnd,
      dataUltimoContattoStart,
      dataUltimoContattoEnd,
    });
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setPage(0);
  };

  const handleResetFilters = () => {
    setRagioneSociale("");
    setFatturatoMin("");
    setFatturatoMax("");
    setDataInserimentoStart("");
    setDataInserimentoEnd("");
    setDataUltimoContattoStart("");
    setDataUltimoContattoEnd("");
    setPage(0);
    setActiveFilters({});
  };

  return (
    <Container className="mt-5">
      <div className="card p-3 mb-4 shadow-sm">
        <h3 className="mb-3">Gestione Clienti</h3>

        <div className="row g-3 mb-3">
          <div className="col-md-4">
            <label className="form-label fw-bold">Ragione Sociale</label>
            <input
              type="text"
              className="form-control"
              placeholder="Cerca per nome..."
              value={ragioneSociale}
              onChange={(e) => setRagioneSociale(e.target.value)}
            />
          </div>

          <div className="col-md-4">
            <label className="form-label fw-bold">Fatturato Minimo (€)</label>
            <input
              type="number"
              className="form-control"
              placeholder="Es. 10000"
              value={fatturatoMin}
              onChange={(e) => setFatturatoMin(e.target.value)}
            />
          </div>

          <div className="col-md-4">
            <label className="form-label fw-bold">Fatturato Massimo (€)</label>
            <input
              type="number"
              className="form-control"
              placeholder="Es. 500000"
              value={fatturatoMax}
              onChange={(e) => setFatturatoMax(e.target.value)}
            />
          </div>
        </div>

        <div className="row g-3 mb-4">
          <div className="col-md-3">
            <label className="form-label fw-bold">Inserimento Da</label>
            <input
              type="date"
              className="form-control"
              value={dataInserimentoStart}
              onChange={(e) => setDataInserimentoStart(e.target.value)}
            />
          </div>

          <div className="col-md-3">
            <label className="form-label fw-bold">Inserimento A</label>
            <input
              type="date"
              className="form-control"
              value={dataInserimentoEnd}
              onChange={(e) => setDataInserimentoEnd(e.target.value)}
            />
          </div>

          <div className="col-md-3">
            <label className="form-label fw-bold">Ultimo Contatto Da</label>
            <input
              type="date"
              className="form-control"
              value={dataUltimoContattoStart}
              onChange={(e) => setDataUltimoContattoStart(e.target.value)}
            />
          </div>

          <div className="col-md-3">
            <label className="form-label fw-bold">Ultimo Contatto A</label>
            <input
              type="date"
              className="form-control"
              value={dataUltimoContattoEnd}
              onChange={(e) => setDataUltimoContattoEnd(e.target.value)}
            />
          </div>
        </div>

        <div className="row g-3 align-items-end">
          <div className="col-md-6">
            <label className="form-label fw-bold">Ordina Per</label>
            <select
              className="form-select"
              value={sortBy}
              onChange={handleSortChange}
            >
              <option value="ragioneSociale">Ragione Sociale</option>
              <option value="fatturatoAnnuale">Fatturato Annuale</option>
              <option value="dataInserimento">Data Inserimento</option>
              <option value="dataUltimoContatto">Data Ultimo Contatto</option>
              <option value="sedeLegale.comune.provincia.nome">
                Provincia Sede Legale
              </option>
            </select>
          </div>

          <div className="col-md-6 d-flex gap-2">
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
        <table className="table table-striped table-hover align-middle shadow-sm">
          <thead className="table-dark">
            <tr>
              <th>Logo</th>
              <th>Ragione Sociale</th>
              <th>Tipo</th>
              <th>P. IVA</th>
              <th>Fatturato</th>
              <th>Email / PEC</th>
              <th>Sede Operativa</th>
              <th className="text-center">Azioni</th>
            </tr>
          </thead>

          <tbody>
            {clienti.length > 0 ? (
              clienti.map((c) => (
                <tr key={c.id}>
                  <td>
                    {c.logoAziendale ? (
                      <img
                        src={c.logoAziendale}
                        alt="Logo"
                        style={{
                          width: "40px",
                          height: "40px",
                          objectFit: "cover",
                          borderRadius: "50%",
                        }}
                      />
                    ) : (
                      <span className="text-muted fs-7">N/D</span>
                    )}
                  </td>
                  <td className="fw-bold">{c.ragioneSociale}</td>
                  <td>
                    <span className="badge bg-info text-dark">
                      {c.tipoCliente}
                    </span>
                  </td>
                  <td>{c.partitaIva}</td>
                  <td>
                    €{" "}
                    {c.fatturatoAnnuale
                      ? c.fatturatoAnnuale.toLocaleString()
                      : "0"}
                  </td>
                  <td>
                    <div>{c.email}</div>
                    <small className="text-muted">{c.pec}</small>
                  </td>
                  <td>
                    {c.sedeOperativa
                      ? `${c.sedeOperativa.via}, ${c.sedeOperativa.civico} - ${c.sedeOperativa.comune.nome} - ${c.sedeOperativa.comune.provincia.nome}`
                      : "N/D"}
                  </td>
                  <td className="text-center">
                    <button
                      className="btn btn-warning btn-sm"
                      onClick={() => handleEditClick(c.id)}
                    >
                      Modifica
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-4">
                  Nessun cliente trovato
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="d-flex justify-content-center gap-2 my-4">
          <button
            className="btn btn-outline-primary"
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
          >
            Precedente
          </button>
          <span className="align-self-center fw-bold">
            Pagina {page + 1} di {totalPages}
          </span>
          <button
            className="btn btn-outline-primary"
            disabled={page + 1 >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Successiva
          </button>
        </div>
      )}
    </Container>
  );
}

export default ClientiList;
