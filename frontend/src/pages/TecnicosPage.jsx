import { useEffect, useState } from "react";
import { useTecnicos } from "../context/TecnicoContext";
import { TecnicoCard } from "../components/tecnicos/TecnicoCard";
import { FaSearch } from "react-icons/fa";

const TECNICOS_POR_PAGINA = 6; // Número de técnicos por página

export function TecnicoPage() {
  const { tecnicos, getTecnicos } = useTecnicos();
  const [searchTerm, setSearchTerm] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  
  useEffect(() => {
    getTecnicos();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
    setPaginaActual(1); // Resetear la página actual al buscar
  };

  const filteredTecnicos = tecnicos.filter(tecnico =>
    tecnico.username.toLowerCase().includes(searchTerm)
  );

  const indexOfLastTecnico = paginaActual * TECNICOS_POR_PAGINA;
  const indexOfFirstTecnico = indexOfLastTecnico - TECNICOS_POR_PAGINA;
  const tecnicosEnPaginaActual = filteredTecnicos.slice(indexOfFirstTecnico, indexOfLastTecnico);

  const totalPaginas = Math.ceil(filteredTecnicos.length / TECNICOS_POR_PAGINA);

  return (
    <div className="flex flex-col items-center py-10">
      {tecnicos.length === 0 && (
        <div className="flex justify-center items-center p-10">
          <div>
            <h1 className="font-bold text-xl">
              Aún no hay técnicos, agregue un nuevo técnico
            </h1>
          </div>
        </div>
      )}

      <h1 className="font-bold text-2xl text-center -mr-64">
        Técnicos Registrados
      </h1>

      <div className="relative w-72 max-w-4xl -ml-56 mt-20">
        <div className="absolute mt-3 ml-2">
          <FaSearch className="text-gray-500" />
        </div>
        <input
          type="text"
          placeholder="Buscar por nombre de usuario..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full pl-10 px-6 py-2 border border-gray-300 text-sm rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />
      </div>

      <div className="w-full max-w-4xl mx-auto mt-10 mb-48 mr-3.5">
        {filteredTecnicos.length === 0 && searchTerm ? (
          <div className="text-center text-gray-500">
            No se encontraron técnicos que coincidan con "{searchTerm}"
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-center text-xs text-gray-500 uppercase tracking-wider">Nombre de Usuario</th>
                    <th className="px-4 py-3 text-center text-xs text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-4 py-3 text-center text-xs text-gray-500 uppercase tracking-wider">Teléfono</th>
                    <th className="px-4 py-3 text-center text-xs text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tecnicosEnPaginaActual.map((tecnico) => (
                    <TecnicoCard tecnico={tecnico} key={tecnico._id} />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Controles de Paginación */}
            <div className="mt-4 flex justify-center">
              <nav className="flex items-center space-x-2">
                <button
                  onClick={() => setPaginaActual(pagina => Math.max(pagina - 1, 1))}
                  disabled={paginaActual === 1}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm bg-gray-200 hover:bg-gray-300"
                >
                  Anterior
                </button>
                {Array.from({ length: totalPaginas }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setPaginaActual(i + 1)}
                    className={`px-4 py-2 border border-gray-300 rounded-md text-sm ${paginaActual === i + 1 ? 'bg-yellow-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setPaginaActual(pagina => Math.min(pagina + 1, totalPaginas))}
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
