import { useEffect, useState } from "react";
import { useReparaciones } from "../context/ReparacionContext";
import { ReparacionCard } from "../components/reparaciones/ReparacionCard";
import { FaSearch, FaDownload } from "react-icons/fa";
import { downloadReporteReparacionesRequest } from "../api/reparacion"; // Importa la función
import { reportePDF } from "../components/reportePDF";
import { useAuth } from "../context/AuthContext";
import { reporteCalificacion } from "../components/reporteCalificacion";

const REPARACIONES_POR_PAGINA = 6;

export function HistorialReparacionesPage() {
  const { reparaciones, getReparaciones, descargarReporte  } = useReparaciones();
  const [searchTerm, setSearchTerm] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const [reparacionesFinalizadas, setReparacionesFinalizadas] = useState([]);
  const { user } = useAuth();
  useEffect(() => {
    getReparaciones();
  }, []);

  useEffect(() => {
    const finalizadas = reparaciones.filter((reparacion) => reparacion.finalizado === true);
    setReparacionesFinalizadas(finalizadas);
    console.log (reparacionesFinalizadas);
  }, [reparaciones]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
    setPaginaActual(1);
  };


  const filteredReparaciones = reparacionesFinalizadas.filter(reparacion =>
    reparacion.cliente.username.toLowerCase().includes(searchTerm) ||
    reparacion.tecnico.nombre.toLowerCase().includes(searchTerm)
  );

  const indexOfLastReparacion = paginaActual * REPARACIONES_POR_PAGINA;
  const indexOfFirstReparacion = indexOfLastReparacion - REPARACIONES_POR_PAGINA;
  const reparacionesEnPaginaActual = filteredReparaciones.slice(indexOfFirstReparacion, indexOfLastReparacion);

  const totalPaginas = Math.ceil(filteredReparaciones.length / REPARACIONES_POR_PAGINA);
  const btnReporte = () => {
    reportePDF(reparacionesFinalizadas, user.username);
  };

  const btnReporteCalificaciones = () => {
    reporteCalificacion(reparacionesFinalizadas, user.username);
  };

  return (
    <div className="flex flex-col items-center py-10">
      <h1 className="font-bold text-2xl text-center mb-6">Historial de Reparaciones</h1>

      <button
        onClick={()=> btnReporte()}
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors mb-6"
      >
        <FaDownload className="inline-block mr-2" /> Descargar Reporte del historial
      </button>

      <button
        onClick={()=> btnReporteCalificaciones()}
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors mb-6"
      >
        <FaDownload className="inline-block mr-2" /> Descargar Reporte de calificaciones
      </button>

      <div className="relative w-72 max-w-4xl mb-6">
        <div className="absolute mt-3 ml-2">
          <FaSearch className="text-gray-500" />
        </div>
        <input
          type="text"
          placeholder="Buscar por cliente o técnico..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full pl-10 px-6 py-2 border border-gray-300 text-sm rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />
      </div>

      <div className="w-full max-w-4xl mx-auto mt-10 mb-48 mr-12">
        {filteredReparaciones.length === 0 && searchTerm ? (
          <div className="text-center text-gray-500">
            No se encontraron reparaciones finalizadas que coincidan con "{searchTerm}"
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-center text-xs text-gray-500 uppercase tracking-wider">Cliente</th>
                    <th className="px-4 py-3 text-center text-xs text-gray-500 uppercase tracking-wider">Estado</th>
                    <th className="px-4 py-3 text-center text-xs text-gray-500 uppercase tracking-wider">Técnico</th>
                    <th className="px-4 py-3 text-center text-xs text-gray-500 uppercase tracking-wider">Descripción problema Cliente</th>
                    <th className="px-4 py-3 text-center text-xs text-gray-500 uppercase tracking-wider">Problema Diagnosticado</th>
                    <th className="px-4 py-3 text-center text-xs text-gray-500 uppercase tracking-wider">Fecha Devolución</th>
                    <th className="px-4 py-3 text-center text-xs text-gray-500 uppercase tracking-wider">Fecha Recepción</th>
                    <th className="px-4 py-3 text-center text-xs text-gray-500 uppercase tracking-wider">Accesorios</th>
                    <th className="px-4 py-3 text-center text-xs text-gray-500 uppercase tracking-wider">Garantía</th>
                    <th className="px-4 py-3 text-center text-xs text-gray-500 uppercase tracking-wider">Costo Total</th>
                    <th className="px-4 py-3 text-center text-xs text-gray-500 uppercase tracking-wider">Costo Reparacion</th>
                    <th className="px-4 py-3 text-center text-xs text-gray-500 uppercase tracking-wider">Costo Adicional</th>
                    <th className="px-4 py-3 text-center text-xs text-gray-500 uppercase tracking-wider">Calificación</th>
                    <th className="px-4 py-3 text-center text-xs text-gray-500 uppercase tracking-wider">Fotos</th>
                    <th className="px-4 py-3 text-center text-xs text-gray-500 uppercase tracking-wider">Reportes</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reparacionesEnPaginaActual.map(reparacion => (
                    <ReparacionCard key={reparacion._id} reparacion={reparacion} estadoFormulario={false}/>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-center mt-4">
              <nav className="flex items-center space-x-2">
                <button
                  disabled={paginaActual === 1}
                  onClick={() => setPaginaActual(paginaActual - 1)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                >
                  Anterior
                </button>
                {Array.from({ length: totalPaginas }, (_, index) => (
                  <button
                    key={index}
                    onClick={() => setPaginaActual(index + 1)}
                    className={`px-4 py-2 rounded-md ${paginaActual === index + 1 ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-700'} hover:bg-yellow-600 hover:text-white`}
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  disabled={paginaActual === totalPaginas}
                  onClick={() => setPaginaActual(paginaActual + 1)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
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

export default HistorialReparacionesPage;
