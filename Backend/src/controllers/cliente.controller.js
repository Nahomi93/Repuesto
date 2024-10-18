import User from "../models/user.model.js";

export const getClientes = async (req, res) => {
    try {
      const clientes = await User.find({ rol: 'Cliente' });
      res.json(clientes);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };

  export const getCliente = async (req, res) => {
    try {
      const cliente = await User.findById(req.params.id);
      if (!cliente) return res.status(404).json({ message: "cliente no encontrado" });
      return res.json(cliente);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
  
  export const deleteCliente = async (req, res) => {
    try {
      const deletedCliente = await User.findByIdAndDelete(req.params.id);
      if (!deletedCliente)
        return res.status(404).json({ message: "Cliente no encontrado" });
  
      return res.sendStatus(204);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
  
  export const updateCliente = async (req, res) => {
    try {
      const { username,
        email,
        password,telefono } = req.body;
      const clienteUpdated = await User.findOneAndUpdate(
        { _id: req.params.id },
        { username,
            email,
            password,
          telefono },
        { new: true }
      );
      return res.json(clienteUpdated);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
  
  export const searchCliente = async (req, res) => {
    try {
      const { id } = req.body;
      const cliente = await User.findById(id);
      return res.json(cliente);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
