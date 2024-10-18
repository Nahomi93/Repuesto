import { createContext, useContext, useState } from "react";  
import {
  createTaskRequest,
  deleteTaskRequest,
  getTasksRequest,
  getTaskRequest,
  updateTaskRequest,
  updateTaskStatusRequest,
  getTasksPorClienteRequest
} from "../api/tasks";

import axios from 'axios';

const TaskContext = createContext();

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) throw new Error("useTasks must be used within a TaskProvider");
  return context;
};

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([]);

  const getTasks = async () => { 
    try {
        const res = await getTasksRequest();
        setTasks(res.data);
        console.log (res.data);
    } catch (error) {
        console.error(error.message);
    }  
  };

  const deleteTask = async (id) => {
    try {
      const res = await deleteTaskRequest(id);
      if (res.status === 204) setTasks(tasks.filter((task) => task._id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  const createTask = async (task) => {
    try {
      const res = await createTaskRequest(task);
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getTask = async (id) => {
    try {
      const res = await getTaskRequest(id);
      console.log (res.data);
      setTasks(res.data);

      //return res.data;
    } catch (error) {
      console.error(error);
    }
  };

  const updateTask = async (id, task) => {
    try {
      await updateTaskRequest(id, task);
      // Opcionalmente, puedes actualizar el estado `tasks` aquí
      await getTasks(); // Para volver a cargar la lista de tareas actualizada
    } catch (error) {
      console.error(error);
    }
  };

  const updateTaskStatus = async (id, status) => {
    try {
      const res = await updateTaskStatusRequest(id, status);
      console.log(res.data);
      return res.data;
    } catch (error) {
      console.error(error);
    }
  };

  const getTasksPorCliente = async () => {
    try {
      const res = await getTasksPorClienteRequest();
      setTasks(res.data);
      console.log(res.data);
    } catch (error) {
      console.error("Error al obtener tareas por cliente:", error.message);
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        getTasks,
        deleteTask,
        createTask,
        getTask,
        updateTask,
        updateTaskStatus,
        getTasksPorCliente,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}