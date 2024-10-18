import { useEffect, useState } from "react";
import { useTasks } from "../context/TaskContext";
import { TaskCard } from "../components/tasks/TaskCard";
import { ImFileEmpty } from "react-icons/im";
import Swal from "sweetalert2";
import { FaSearch } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const TAREAS_POR_PAGINA = 6; // Número de tareas por página

export function TasksPage() {
  const { user } = useAuth();
  const { tasks, getTasks,getTask } = useTasks();
  const [searchTerm, setSearchTerm] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);

  useEffect(() => {
    if (user.rol === 'Administrador' || user.rol === 'Tecnico') {
      getTasks();
    } else {
      getTask(user.id);
    }
  }, []);

  useEffect(() => {
    const alertInterval = setInterval(() => {
      if (tasks.some(task => task.estado === "Pendiente")) {
        Swal.fire({
          title: 'Tienes reservas pendientes',
          text: 'Revisa las reservas pendientes en el sistema.',
          icon: 'info',
          confirmButtonText: 'Ok'
        });
      }
    }, 10000); // 10 segundos

    return () => clearInterval(alertInterval);
  }, [tasks]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
    setPaginaActual(1); // Resetear la página actual al buscar
  };

  const filteredTasks = tasks.filter(task =>
    task.description.toLowerCase().includes(searchTerm)
  );

  const indexOfLastTask = paginaActual * TAREAS_POR_PAGINA;
  const indexOfFirstTask = indexOfLastTask - TAREAS_POR_PAGINA;
  const tasksEnPaginaActual = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);

  const totalPaginas = Math.ceil(filteredTasks.length / TAREAS_POR_PAGINA);

  return (
    <div className="flex flex-col items-center py-10">
      {tasks.length === 0 && (
        <div className="flex justify-center items-center p-10">
          <div>
            <ImFileEmpty className="text-6xl text-gray-400 m-auto my-2" />
            <h1 className="font-bold text-xl">
              Aún no hay tareas, agregue una nueva tarea
            </h1>
          </div>
        </div>
      )}

      <h1 className="font-bold text-2xl text-center -mr-64">
        Reservas Registradas
      </h1>

      <div className="relative w-72 max-w-4xl -ml-56 mt-20">
        <div className="absolute mt-3 ml-2">
          <FaSearch className="text-gray-500" />
        </div>
        <input
          type="text"
          placeholder="Buscar por descripción..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full pl-10 px-6 py-2 border border-gray-300 text-sm rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />
      </div>

      <div className="w-full max-w-4xl mx-auto mt-10 mb-48 mr-3.5">
        {filteredTasks.length === 0 && searchTerm ? (
          <div className="text-center text-gray-500">
            No se encontraron tareas que coincidan con "{searchTerm}"
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-center text-xs text-gray-500 uppercase tracking-wider">Título</th>
                    <th className="px-4 py-3 text-center text-xs text-gray-500 uppercase tracking-wider">Tipo</th>
                    <th className="px-4 py-3 text-center text-xs text-gray-500 uppercase tracking-wider">Descripción</th>
                    <th className="px-4 py-3 text-center text-xs text-gray-500 uppercase tracking-wider">Fecha</th>
                    <th className="px-4 py-3 text-center text-xs text-gray-500 uppercase tracking-wider">Estado</th>
                    <th className="px-4 py-3 text-center text-xs text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tasksEnPaginaActual.map((task) => (
                    <TaskCard task={task} key={task._id} />
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