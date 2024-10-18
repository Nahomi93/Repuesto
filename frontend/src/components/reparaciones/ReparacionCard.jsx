import { useReparaciones } from "../../context/ReparacionContext";
import { Button, ButtonLink, Card, Label, ImageGallery } from "../ui";
import { useAuth } from "../../context/AuthContext";
import { PDFDownloadLink } from '@react-pdf/renderer';
import Pdf from '../../pages/Pdf.jsx';
import { FaEdit, FaTrash } from "react-icons/fa";
import { Link, useNavigate} from "react-router-dom";
import { useState } from "react";  // Importar useState para manejar el estado local


export function ReparacionCard({ reparacion }) {
  const { user } = useAuth();
  const { deleteReparacion, calificarReparacion, updateReparacion } = useReparaciones();
  const navigate = useNavigate();
  

  // Estado local para aceptar cambios
  const [aceptacionCambios, setAceptacionCambios] = useState(reparacion.aceptacion_cambios);

  const handleUpdate = async () => {
    try {
      await calificarReparacion(reparacion._id, { aceptacion_cambios: true });
      setAceptacionCambios(true);  // Actualiza el estado localmente
    } catch (error) {
      console.error("Error al aceptar cambios", error);
    }
  };
  const handleTerminar = async () => {
    try {
      await calificarReparacion(reparacion._id, { finalizado: true });
      
      navigate("/historial-reparaciones"); 
    
    } catch (error) {
      console.error("Error al finalizar reparación", error);
    }
  };
  // Calcular el costo total
  const totalCotizacion = reparacion.cotizacion
    .filter(cotizacion => cotizacion.aceptado) // Filtrar cotizaciones aceptadas
    .reduce((total, cotizacion) => total + cotizacion.precio, 0); // Sumar los precios

  const costoTotal = reparacion.costo + totalCotizacion; // Sumar costo de la reparación
  return (
    <tr key={reparacion._id} className="bg-white border-b hover:bg-gray-50">
      <td className="px-4 py-3 text-sm font-medium text-gray-900">{reparacion.cliente.username}</td>
      <td className="px-4 py-3 text-sm text-gray-500">{reparacion.tecnico.username}</td>
      <td className="px-4 py-3 text-sm text-gray-500">{reparacion.description_problema}</td>
      <td className="px-4 py-3 text-sm text-gray-500">
        {reparacion.problemaDiagnosticado || "No diagnosticado"}
      </td>
      <td className="px-4 py-3 text-sm text-gray-500">{reparacion.fecha_devolucion}</td>
      <td className="px-4 py-3 text-sm text-gray-500">{reparacion.fecha_recepcion}</td>
      <td className="px-4 py-3 text-sm text-gray-500">{reparacion.accesorios_dejados}</td>
      <td className="px-4 py-3 text-sm text-gray-500">
        {reparacion.garantia ? "Tiene Garantía" : "No Tiene Garantía"}
      </td>
      <td className="px-4 py-3 text-sm text-gray-500">{costoTotal.toFixed(2)}</td>
      <td className="px-4 py-3 text-sm text-gray-500">{reparacion.costo}</td>
      {reparacion.cotizacion.map((cotizacion) => (
        <tr key={cotizacion._id}>
          <td className="px-4 py-3 text-sm text-gray-500">{cotizacion.componente || "N/A"}</td>
          <td className="px-4 py-3 text-sm text-gray-500">{cotizacion.precio.toFixed(2) || "0.00"}</td>
          <td className="px-4 py-3 text-sm text-gray-500">
            {cotizacion.aceptado ? "Sí se aceptó" : "No se aceptó"}
          </td>
        </tr>
      ))}
      <td className="px-4 py-3 text-sm text-gray-500">{reparacion.calificacion}</td>

      {/* Utiliza el estado local para reflejar el cambio de aceptación */}
      <td className="px-4 py-3 text-sm text-gray-500">
        {aceptacionCambios ? 'Aceptado' : 'No Aceptado'}
      </td>

      <td className="px-4 py-3 text-sm">
        {reparacion.fotos && reparacion.fotos.length > 0 ? (
          <ImageGallery photos={reparacion.fotos} />
        ) : (
          'No hay fotos disponibles.'
        )}
      </td>
      <td className="px-4 py-3 text-sm flex gap-x-2">
        {(user.rol === 'Administrador' || user.rol === 'Tecnico') && (
          <>
            {(reparacion.finalizado === false || reparacion.finalizado === null) && (
              <>
                <button
                  onClick={() => deleteReparacion(reparacion._id)}
                  className="text-red-500 hover:text-red-700">
                  <FaTrash />
                </button>
                <Link
                  to={`/reparaciones/${reparacion._id}`}
                  className="text-green-500 hover:text-green-700 text-lg">
                  <FaEdit />
                </Link>
                <Button onClick={handleTerminar} className="text-yellow-500 hover:text-yellow-700">
                  Terminar trabajo
                </Button>
              </>
            )};
            <PDFDownloadLink document={<Pdf reparacion={reparacion} />} fileName='reparacion_boleta.pdf'>
              {({ loading }) => loading ? (
                <Button>Cargando Documento...</Button>
              ) : (
                <Button className="reporte">Descargar Reportes</Button>
              )}
            </PDFDownloadLink>



          </>
        )}
        {user.rol === 'Cliente' && !reparacion.calificacion && (reparacion.finalizado === false || reparacion.finalizado === null)
          && (
            <>
              <ButtonLink to={`/calificar/${reparacion._id}`} className="text-green-500 hover:text-green-700">
                Calificar
              </ButtonLink>
              {!aceptacionCambios && (
                <Button onClick={handleUpdate} className="text-yellow-500 hover:text-yellow-700">
                  Aceptar cambios
                </Button>
              )}
              <ButtonLink to={`/reparaciones/${reparacion._id}`}
                className="text-green-500 hover:text-green-700">
                Aceptar cotizaciones
              </ButtonLink>
            </>
          )}
      </td>
    </tr>
  );
}
