import { useEffect, useState } from "react";
import { useGarantias } from "../context/GarantiaContext";
import { GarantiaCard } from "../components/garantia/GarantiaCard";
import { FaSearch } from "react-icons/fa";

const GARANTIAS_POR_PAGINA = 6;

export function GarantiasPage() {
  const { garantias = [], getGarantias, importGarantias } = useGarantias();  // Importar la función del contexto
  const [searchTerm, setSearchTerm] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const [file, setFile] = useState(null);
  
  useEffect(() => {
    console.log("Fetching garantias...");
    getGarantias();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
    setPaginaActual(1);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Por favor, selecciona un archivo CSV");
      return;
    }

    try {
      await importGarantias(file);  // Usar la función del contexto
      alert("Archivo importado exitosamente");
      getGarantias();  // Recargar las garantías después de la importación
    } catch (error) {
      console.error("Error al importar CSV", error);
      alert("Error al importar el archivo CSV");
    }
  };

  const filteredGarantias = garantias.filter(garantia =>
    garantia.nombre_cliente.toLowerCase().includes(searchTerm) ||
    garantia.apellido_cliente.toLowerCase().includes(searchTerm) ||
    garantia.equipo_comprado.toLowerCase().includes(searchTerm)
  );

  const indexOfLastGarantia = paginaActual * GARANTIAS_POR_PAGINA;
  const indexOfFirstGarantia = indexOfLastGarantia - GARANTIAS_POR_PAGINA;
  const garantiasEnPaginaActual = filteredGarantias.slice(indexOfFirstGarantia, indexOfLastGarantia);

  const totalPaginas = Math.ceil(filteredGarantias.length / GARANTIAS_POR_PAGINA);

  return (
    <div className="flex flex-col items-center py-10">
      {garantias.length === 0 && (
        <div className="flex justify-center items-center p-10">
          <div>
            <h1 className="font-bold text-xl">
              Aún no hay equipos con garantía, agregue un nuevo equipo con garantía
            </h1>
          </div>
        </div>
      )}

      <h1 className="font-bold text-2xl text-center -mr-64">
        Garantías Registradas
      </h1>
      {/* Formulario para cargar archivo CSV */}
      <div className="w-full max-w-4xl mx-auto mt-6 mb-6">
        <h2 className="text-lg font-semibold">Importar Garantías desde un archivo CSV</h2>
        <form onSubmit={handleUpload} className="flex flex-col items-center">
          <input type="file" accept=".csv" onChange={handleFileChange} className="mb-4" />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Importar CSV
          </button>
        </form>
      </div>

      <div className="w-full max-w-4xl mx-auto mt-10 mb-48 mr-3.5">
        {filteredGarantias.length === 0 && searchTerm ? (
          <div className="text-center text-gray-500">
            No se encontraron garantías que coincidan con "{searchTerm}"
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-center text-xs text-gray-500 uppercase tracking-wider">Nro Factura</th>
                    <th className="px-4 py-3 text-center text-xs text-gray-500 uppercase tracking-wider">Equipo Comprado</th>
                    <th className="px-4 py-3 text-center text-xs text-gray-500 uppercase tracking-wider">Nombre del Cliente</th>
                    <th className="px-4 py-3 text-center text-xs text-gray-500 uppercase tracking-wider">Apellido del Cliente</th>
                    <th className="px-4 py-3 text-center text-xs text-gray-500 uppercase tracking-wider">NIT del Cliente</th>
                    <th className="px-4 py-3 text-center text-xs text-gray-500 uppercase tracking-wider">Garantía</th>
                    <th className="px-4 py-3 text-center text-xs text-gray-500 uppercase tracking-wider">Tiempo de Garantía</th>
                    <th className="px-4 py-3 text-center text-xs text-gray-500 uppercase tracking-wider">Fecha de Inicio de Garantía</th>
                    <th className="px-4 py-3 text-center text-xs text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {garantiasEnPaginaActual.map((garantia) => (
                    <GarantiaCard garantia={garantia} key={garantia._id} />
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex justify-center">
              <nav className="flex items-center space-x-2">
                <button
                  onClick={() => setPaginaActual((pagina) => Math.max(pagina - 1, 1))}
                  disabled={paginaActual === 1}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm bg-gray-200 hover:bg-gray-300"
                >
                  Anterior
                </button>
                {Array.from({ length: totalPaginas }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setPaginaActual(i + 1)}
                    className={`px-4 py-2 border border-gray-300 rounded-md text-sm ${
                      paginaActual === i + 1 ? "bg-yellow-500 text-white" : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setPaginaActual((pagina) => Math.min(pagina + 1, totalPaginas))}
                  disabled={paginaActual === totalPaginas}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm bg-gray-200 hover:bg-gray-300"
                >
                  Siguiente
                </button>
              </nav>
            </div>
          </>
        )}
      </div>
    </div>
  );
}