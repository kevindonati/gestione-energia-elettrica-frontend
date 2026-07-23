import ClientiList from "./ClientiList";
import FattureList from "./FattureList";

export default function HomeAdmin() {
  return (
    <div className="container pb-5">
      <h1 className="mb-4 text-center">Dashboard Gestionale</h1>
      <ClientiList />
      <hr className="my-5" />
      <FattureList />
    </div>
  );
}
