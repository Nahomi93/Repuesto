import React, { useEffect, useState } from 'react';
import { getTaskscamunda, completeTaskcamunda } from '../api/taskcamunda';

const TasksPage = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await getTaskscamunda('your-assignee'); // Cambia 'your-assignee' por el usuario actual
        setTasks(response);
      } catch (error) {
        console.error('Error al obtener tareas:', error);
      }
    };

    fetchTasks();
  }, []);

  const handleCompleteTask = async (taskId) => {
    try {
      const variables = {
        // Variables necesarias para completar la tarea
        exampleVariable: { value: 'exampleValue', type: 'String' },
      };

      await completeTaskcamunda(taskId, variables);
      // Actualiza la lista de tareas después de completar una
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (error) {
      console.error('Error al completar la tarea:', error);
    }
  };

  return (
    <div>
      <h1>Tareas Pendientes</h1>
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            {task.name} <button onClick={() => handleCompleteTask(task.id)}>Completar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TasksPage;
