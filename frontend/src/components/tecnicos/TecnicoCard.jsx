import { useTecnicos } from "../../context/TecnicoContext";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa"; // Íconos para editar y eliminar

export function TecnicoCard({ tecnico }) {
  const { deleteTecnico } = useTecnicos();

  return (
    <tr key={tecnico._id}>
      <td className="px-2 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{tecnico.username}</td>
      <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500">{tecnico.email}</td>
      <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500">{tecnico.telefono}</td>
      <td className="px-2 py-4 whitespace-nowrap text-sm font-medium text-center flex justify-center gap-4">
        <button
          onClick={() => deleteTecnico(tecnico._id)}
          className="text-red-500 hover:text-red-700 text-lg"
          aria-label="Eliminar"
        >
          <FaTrash />
        </button>
        <Link
          to={`/tecnicos/${tecnico._id}`}
          className="text-green-500 hover:text-green-700 text-lg"
          aria-label="Editar"
        >
          <FaEdit />
        </Link>
      </td>
    </tr>
  );
}
