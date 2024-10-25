import Task from "../models/task.model.js";

export const getTasks = async (req, res) => {
  try {
    const query = req.user.rol === 'Cliente'
      ? { cliente: req.user.id }
      : {}; // Dejar vacío para técnicos y administradores
      console.log(query);
    const tasks = await Task.find(query).populate("cliente");
    console.log(tasks);
    res.json(tasks);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
  
  export const createTask = async (req, res) => {
    try {
      const { title, tipo, description, date, garantia } = req.body;
      const newTask = new Task({
        title,
        tipo,
        description,
        date: new Date(date),
        cliente: req.user.id,
        garantia
      });
      await newTask.save();
      res.json(newTask);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };

  export const getTask = async (req, res) => {
    try {
      //const task = await Task.findById(req.params.id);
      const task = await Task.find({ cliente: req.params.id }); // Busca todas las tareas asociadas a clienteId

      if (!task) return res.status(404).json({ message: "Reserva no encontrada" });
      return res.json(task);
    } catch (error) {
      console.log(error.message)
      return res.status(500).json({ message: error.message });
    }
  };
  
  export const deleteTask = async (req, res) => {
    try {
      const deletedTask = await Task.findByIdAndDelete(req.params.id);
      if (!deletedTask)
        return res.status(404).json({ message: "Reserva no encontrada" });
  
      return res.sendStatus(204);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
  
  export const updateTask = async (req, res) => {
    try {
      const { title, tipo, description, date,garantia } = req.body;
      const taskUpdated = await Task.findOneAndUpdate(
        { _id: req.params.id },
        { title, tipo, description, date,garantia },
        { new: true }
      );
      return res.json(taskUpdated);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
  
  export const updateTaskStatus = async (req, res) => {
    try {
      const { status } = req.body;
      const validStatuses = ['Aceptada', 'Rechazada'];
      
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: "Estado no válido" });
      }
  
      const updatedTask = await Task.findByIdAndUpdate(
        req.params.id,
        { estado: status, [status === 'Aceptada' ? 'acceptedDate' : 'rejectedDate']: Date.now() },
        { new: true }
      );
  
      if (!updatedTask) return res.status(404).json({ message: "Reserva no encontrada" });
  
      res.json(updatedTask);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };

  export const getTaskPorCliente = async (req, res) => {
    try {
      const tareas = await Task.find({ cliente: req.user.id });
      res.json(tareas);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };