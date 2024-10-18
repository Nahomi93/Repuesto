import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTasks } from "../../context/TaskContext";
import { Button, ButtonLink } from "../ui";
import { useAuth } from "../../context/AuthContext";
import { useGarantias } from "../../context/GarantiaContext";
import { FaEdit, FaTrash } from "react-icons/fa"; // Íconos para editar y eliminar
import Modal from "react-modal";
import { FaSearch } from "react-icons/fa";

dayjs.extend(utc);
// Estilos para centrar el modal
const modalStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    padding: "20px",
    borderRadius: "8px",
    width: "400px",        // Ancho fijo del modal
    maxHeight: "80vh",     // Altura máxima del modal (80% del viewport)
    overflowY: "auto",     // Permitir scroll vertical si el contenido excede la altura
  },
};

export function TaskCard({ task }) {
  const { deleteTask, updateTaskStatus } = useTasks();
  const { garantias, getGarantias } = useGarantias();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [taskState, setTaskState] = useState(task.estado);

  const handleStatusChange = async (status) => {
    try {
      await updateTaskStatus(task._id, status);
      setTaskState(status);
      navigate("/tasks");
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const formattedDate = task.date
    ? dayjs.utc(task.date).local().format('dddd, MMMM D, YYYY')
    : '';

  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  // Filtrar las garantías en base al término de búsqueda
  const filteredGarantias = garantias.filter(garantia =>
    garantia.nombre_cliente.toLowerCase().includes(searchTerm) ||
    garantia.equipo_comprado.toLowerCase().includes(searchTerm) ||
    garantia.apellido_cliente.toLowerCase().includes(searchTerm)
  );
  // Función para abrir el modal
  const handlegarantias = () => {
    getGarantias();

    setIsOpen(true);
  };
  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };
  // Función para cerrar el modal
  const closeModal = () => {
    setIsOpen(false);
  };
  return (
    <tr key={task._id}>
      <td className="px-2 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{task.title}</td>
      <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500">{task.tipo}</td>
      <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500">{task.description}</td>
      <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500">{formattedDate}</td>
      <td className={`px-2 py-2 whitespace-nowrap text-sm font-medium text-center ${taskState === 'Aceptada' ? 'text-green-600' : taskState === 'Rechazada' ? 'text-red-600' : 'text-yellow-600'}`}>
        {taskState}
      </td>
      <td className="px-4 py-2 text-sm font-medium text-center flex justify-center gap-4">
        {user.rol === 'Cliente' && (
          <>
            <button
              onClick={() => deleteTask(task._id)}
              className="text-red-500 hover:text-red-700 text-lg"
              aria-label="Eliminar"
            >
              <FaTrash />
            </button>
            <Link
              to={`/tasks/${task._id}`}
              className="text-green-500 hover:text-green-700 text-lg">
              <FaEdit />
            </Link>
          </>
        )}
        {['Administrador', 'Tecnico'].includes(user.rol) && (
          <>
            {taskState !== 'Aceptada' && taskState !== 'Rechazada' && (
              <>
                <Button onClick={() => handleStatusChange('Aceptada')}>Aceptar</Button>
                <Button onClick={() => handleStatusChange('Rechazada')}>Rechazar</Button>
              </>
            )}
            {task.garantia == true && (


              <Button onClick={() => handlegarantias()}>Ver garantias</Button>
            )}
            {/* Modal */}
            <Modal
              isOpen={isOpen}
              onRequestClose={closeModal}
              style={modalStyles}
              contentLabel="Garantías"
            >
              <div>
                <div className="absolute mt-3 ml-2">
                  <FaSearch className="text-gray-500" />
                </div>
                <input
                  type="text"
                  placeholder="Buscar por nombre..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="w-full pl-10 px-6 py-2 border border-gray-300 text-sm rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>
              {filteredGarantias.map((garantia) => (
                <li key={garantia._id}>
                  <h3>equipo: {garantia.nombre_cliente}</h3>
                  <p>equipo: {garantia.equipo_comprado}</p>
                  <p>Tiempo: {garantia.tiempo_garantia}</p>
                  <p>Apellido: {garantia.apellido_cliente}</p>
                  <p>fecha de inicio de garantia: {garantia.fecha_inicio_garantia}</p>
                </li>
              ))}
              {/* Botón para cerrar el modal */}
              <Button onClick={closeModal}>Cerrar</Button>
            </Modal>

          </>
        )}
      </td>
    </tr>
  );
}