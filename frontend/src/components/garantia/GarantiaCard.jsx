import { useGarantias } from "../../context/GarantiaContext";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa"; // Íconos para editar y eliminar

export function GarantiaCard({ garantia }) {
  const { deleteGarantia } = useGarantias();

  return (
    <tr key={garantia._id}>
      <td className="px-2 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{garantia.Nro_factura}</td>
      <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500">{garantia.equipo_comprado}</td>
      <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500">{garantia.nombre_cliente}</td>
      <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500">{garantia.apellido_cliente}</td>
      <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500">{garantia.nit_cliente}</td>
      <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500">{garantia.garantia}</td>
      <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500">{garantia.tiempo_garantia}</td>
      <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500">{garantia.fecha_inicio_garantia}</td>
      <td className="px-2 py-4 whitespace-nowrap text-sm font-medium text-center flex justify-center gap-4">
        <button
          onClick={() => deleteGarantia(garantia._id)}
          className="text-red-500 hover:text-red-700 text-lg"
          aria-label="Eliminar"
        >
          <FaTrash />
        </button>
        <Link
          to={`/garantias/${garantia._id}`}
          className="text-green-500 hover:text-green-700 text-lg"
          aria-label="Editar"
        >
          <FaEdit />
        </Link>
      </td>
    </tr>
  );
}
