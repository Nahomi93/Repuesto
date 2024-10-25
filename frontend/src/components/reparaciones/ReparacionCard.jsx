import { useReparaciones } from "../../context/ReparacionContext";
import { Button, ButtonLink, Card, Label, ImageGallery } from "../ui";
import { useAuth } from "../../context/AuthContext";
import { PDFDownloadLink } from '@react-pdf/renderer';
import Pdf from '../../pages/Pdf';
import { FaEdit, FaTrash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";  // Importar useState y useEffect
import { format } from 'date-fns';

export function ReparacionCard({ reparacion, updateEstado, estadoFormulario }) {
  const { user } = useAuth();
  const { deleteReparacion, calificarReparacion, updateReparacion } = useReparaciones();
  const [estado, setEstado] = useState(reparacion.estado);
  const navigate = useNavigate();

  // Estado local para aceptar cambios
  const [aceptacionCambios, setAceptacionCambios] = useState(reparacion.aceptacion_cambios);

  // Estado para almacenar el total de cotizaciones aceptadas
  const [totalCotizacionAceptada, setTotalCotizacionAceptada] = useState(0);

  useEffect(() => {
    // Calcular el total de cotizaciones aceptadas
    const total = reparacion.cotizacion
      .filter(cotizacion => cotizacion.aceptado)
      .reduce((sum, cotizacion) => sum + parseFloat(cotizacion.precio || 0), 0);

    setTotalCotizacionAceptada(total);
  }, [reparacion.cotizacion]);

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

  const handleEstadoChange = async (nuevoEstado) => {
    try {
      await updateEstado(reparacion._id, nuevoEstado);
      setEstado(nuevoEstado);  // Actualiza localmente el estado
    } catch (error) {
      console.error("Error al actualizar el estado:", error);
    }
  };

  const costoTotal = reparacion.costo + totalCotizacionAceptada; // Sumar cotización aceptada + costo reparación
  console.log(reparacion)
  return (
    <tr key={reparacion._id} className="bg-white border-b hover:bg-gray-50">
      {(user.rol === "Tecnico" || user.rol === "Administrador") && (
        <td className="px-4 py-3 text-sm font-medium text-gray-500">
          {reparacion.cliente.username}
        </td>
      )}
      <td>{estado}</td>
      <td className="px-4 py-3 text-sm text-gray-500">{reparacion.tecnico.username}</td>
      {(user.rol === "Tecnico" || user.rol === "Administrador" ) && (
        <td className="px-4 py-3 text-sm text-gray-500">{reparacion.description_problema || "No diagnosticado"}</td>
      )}
      {(user.rol === "Tecnico" || user.rol === "Administrador" || user.rol === "Cliente") && (
        <td className="px-4 py-3 text-sm text-gray-500">{reparacion.problemaDiagnosticado || "No diagnosticado"}</td>
      )}
      <td className="px-4 py-3 text-sm text-gray-500">{format(reparacion.fecha_devolucion, 'dd/MM/yyyy')}</td>
      {(user.rol === "Tecnico" || user.rol === "Administrador") && (
      <td className="px-4 py-3 text-sm text-gray-500">{format(reparacion.fecha_recepcion, 'dd/MM/yyyy')}</td>
      )}
      <td className="px-4 py-3 text-sm text-gray-500">
        {reparacion.accesorios_dejados && reparacion.accesorios_dejados.length > 0 
          ? reparacion.accesorios_dejados 
          : "Sin Accesorios"}
      </td>


      <td className="px-4 py-3 text-sm text-gray-500">
        {reparacion.garantia ? "Tiene Garantía" : "No Tiene Garantía"}
      </td>

      {/* Mostrar el total de cotizaciones aceptadas */}
      <td className="px-4 py-3 text-sm text-gray-500">
        Total Cotización Aceptada: {totalCotizacionAceptada.toFixed(2)}
      </td>

      {/* Mostrar el costo total de la reparación */}
      <td className="px-4 py-3 text-sm text-gray-500">
        {costoTotal.toFixed(2)}
      </td>

      <td className="px-4 py-3 text-sm">
        {reparacion.cotizacion.map((cotizacion) => (
          <div key={cotizacion._id} className="mb-2">
            <div>Componente: {cotizacion.componente || "N/A"}</div>
            <div>Precio: {cotizacion.precio.toFixed(2) || "0.00"}</div>
            <div>Aceptado: {cotizacion.aceptado ? "Sí" : "No"}</div>
          </div>
        ))}
      </td>

      <td className="px-4 py-3 text-sm text-gray-500">{reparacion.calificacion || "No calificado"}</td>
      {/* <td className="px-4 py-3 text-sm text-gray-500">
        {aceptacionCambios ? "Aceptado" : "No Aceptado"}
      </td> */}

      <td className="px-4 py-3 text-sm">
        {reparacion.fotos && reparacion.fotos.length > 0 ? (
          <ImageGallery photos={reparacion.fotos} />
        ) : (
          "No hay fotos disponibles."
        )}
      </td>

      <td className="px-4 py-3 text-sm flex gap-x-2">
        {(estadoFormulario === true) && (
          <>
        {(user.rol === "Administrador" || user.rol === "Tecnico") && (
          <>
            <button
              onClick={() => deleteReparacion(reparacion._id)}
              className="text-red-500 hover:text-red-700"
            >
              <FaTrash />
            </button>
            <button onClick={() => handleEstadoChange("Recibido")} className="px-3 py-1 bg-gray-200 rounded">
              Recibido
            </button>
            <button onClick={() => handleEstadoChange("En Reparación")} className="px-3 py-1 bg-blue-500 text-white rounded">
              En Reparación
            </button>
            <button onClick={() => handleEstadoChange("Entregado")} className="px-3 py-1 bg-yellow-500 text-white rounded">
              Entregado
            </button>
            <Link to={`/reparaciones/${reparacion._id}`} className="text-green-500 hover:text-green-700">
              <FaEdit />
            </Link>
            <Button onClick={handleTerminar} className="text-yellow-500 hover:text-yellow-700">
            Archivar Reparación
            </Button>
            <PDFDownloadLink document={<Pdf reparacion={reparacion} />} fileName="reparacion_boleta.pdf">
              {({ loading }) => (loading ? <Button>Cargando Documento...</Button> : <Button>Descargar Reporte</Button>)}
            </PDFDownloadLink>
            </>
        )}
          </>
        )}
        {user.rol === "Cliente" && !reparacion.calificacion && !reparacion.finalizado && (
          <>
            {/* {!aceptacionCambios && (
              <Button onClick={handleUpdate} className="text-yellow-500 hover:text-yellow-700">
                Aceptar cambios
              </Button>
            )} */}
            <ButtonLink to={`/reparaciones/${reparacion._id}`} className="text-green-500 hover:text-green-700">
              Aceptar cotizaciones
            </ButtonLink>
            <ButtonLink to={`/calificar/${reparacion._id}`} className="text-green-500 hover:text-green-700">
              Calificar
            </ButtonLink>
          </>
        )}
      </td>
    </tr>
  );
}
