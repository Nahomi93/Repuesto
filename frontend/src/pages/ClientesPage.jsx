import { useEffect, useState } from "react";
import { useClientes } from "../context/ClienteContext";
import { ClienteCard } from "../components/clientes/ClienteCard";
import bienvenidoImage from "../imagenes/bienvenido.png";
import { FaSearch } from "react-icons/fa";

const CLIENTES_POR_PAGINA = 6; 

export function ClientesPage() {
  const { clientes, getClientes } = useClientes();
  const [searchTerm, setSearchTerm] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  
  useEffect(() => {
    getClientes();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
    setPaginaActual(1); 
  };

  const filteredClientes = clientes.filter(cliente =>
    cliente.username.toLowerCase().includes(searchTerm)
  );

  const indexOfLastCliente = paginaActual * CLIENTES_POR_PAGINA;
  const indexOfFirstCliente = indexOfLastCliente - CLIENTES_POR_PAGINA;
  const clientesEnPaginaActual = filteredClientes.slice(indexOfFirstCliente, indexOfLastCliente);

  const totalPaginas = Math.ceil(filteredClientes.length / CLIENTES_POR_PAGINA);

  return (
    <div className="flex flex-col items-center py-10">
      {clientes.length === 0 && (
        <div className="flex justify-center items-center flex-col mb-10">
          <img src={bienvenidoImage} alt="Bienvenido" className="mx-auto my-2" style={{ width: "64px" }} />
          <h1 className="font-bold text-xl text-center">
            Aún no hay clientes, agregue un cliente
          </h1>
        </div>
      )}

      <h1 className="font-bold text-2xl text-center -mr-64">
        Clientes Registrados
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
        {filteredClientes.length === 0 && searchTerm ? (
          <div className="text-center text-gray-500">
            No se encontraron clientes que coincidan con "{searchTerm}"
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
                  {clientesEnPaginaActual.map((cliente) => (
                    <ClienteCard cliente={cliente} key={cliente._id} />
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