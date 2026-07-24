import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchWithAuth } from "../services/api";

function ClientiAvatarUpload() {
  const { id } = useParams();

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [currentLogoUrl, setCurrentLogoUrl] = useState("");

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchClienteLogo = async () => {
      try {
        setLoadingData(true);
        setError("");

        const clienteData = await fetchWithAuth(`/clienti/${id}`);

        const logoUrl = clienteData?.logoAziendale || "";

        setCurrentLogoUrl(logoUrl);
        setPreviewUrl(logoUrl);
      } catch (err) {
        setError(
          err.message || "Errore durante il recupero dei dati del cliente.",
        );
      } finally {
        setLoadingData(false);
      }
    };

    if (id) {
      fetchClienteLogo();
    }
  }, [id]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setError("");
    setSuccess("");

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Seleziona un file immagine valido (PNG, JPG, WEBP).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("L'immagine non può superare i 5MB.");
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      setError("Seleziona un'immagine prima di salvare.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();
      formData.append("logo", selectedFile);
      const updatedCliente = await fetchWithAuth(`/clienti/${id}/logo`, {
        method: "PATCH",
        body: formData,
      });

      setSuccess("Logo aziendale aggiornato con successo!");

      const newLogoUrl = updatedCliente?.logoAziendale || previewUrl;
      setCurrentLogoUrl(newLogoUrl);
      setSelectedFile(null);
    } catch (err) {
      setError(err.message || "Errore durante il caricamento del logo.");
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return null;
  }

  return (
    <div className="container py-3">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-9">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4">
              <h5 className="card-title text-primary mb-3">Logo Aziendale</h5>

              {error && (
                <div className="alert alert-danger py-2" role="alert">
                  {error}
                </div>
              )}

              {success && (
                <div className="alert alert-success py-2" role="alert">
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="d-flex align-items-center gap-4">
                  <div
                    className="rounded-circle overflow-hidden bg-light border d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{ width: "96px", height: "96px" }}
                  >
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt="Logo Aziendale"
                        className="w-100 h-100"
                        style={{ objectFit: "cover" }}
                      />
                    ) : (
                      <span className="text-muted fw-bold small">NO LOGO</span>
                    )}
                  </div>

                  <div className="flex-grow-1">
                    <label
                      htmlFor="logoInput"
                      className="form-label fw-semibold"
                    >
                      Carica o sostituisci logo
                    </label>
                    <input
                      type="file"
                      className="form-control mb-1"
                      id="logoInput"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    <div className="form-text">
                      Formati supportati: JPG, PNG, WEBP (Max 5MB)
                    </div>
                  </div>
                </div>

                {selectedFile && (
                  <div className="d-flex justify-content-end gap-2 mt-3">
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => {
                        setSelectedFile(null);
                        setPreviewUrl(currentLogoUrl);
                        setError("");
                      }}
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
                          Caricamento...
                        </>
                      ) : (
                        "Salva Logo"
                      )}
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClientiAvatarUpload;
