import { useClientes } from "../../context/ClienteContext";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa"; // Importar íconos de edición y eliminación

export function ClienteCard({ cliente }) {
  const { deleteCliente } = useClientes();

  return (
    <tr key={cliente._id}>
      <td className="px-2 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{cliente.username}</td>
      <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500">{cliente.email}</td>
      <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500">{cliente.telefono}</td>
      <td className="px-2 py-4 whitespace-nowrap text-sm font-medium text-center flex justify-center gap-4">
        <button
          onClick={() => deleteCliente(cliente._id)}
          className="text-red-500 hover:text-red-700 text-lg"
          aria-label="Eliminar"
        >
          <FaTrash />
        </button>
        <Link
          to={`/clientes/${cliente._id}`}
          className="text-green-500 hover:text-green-700 text-lg"
          aria-label="Editar"
        >
          <FaEdit />
        </Link>
      </td>
    </tr>
  );
}
