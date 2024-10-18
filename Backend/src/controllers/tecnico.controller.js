import User from "../models/user.model.js";

export const getTecnicos = async (req, res) => {
    try {
      const tecnicos = await User.find({ rol: 'Tecnico' });
      res.json(tecnicos);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };

  export const getTecnico = async (req, res) => {
    try {
      const tecnico = await User.findById(req.params.id);
      if (!tecnico) return res.status(404).json({ message: "Tecnico no encontrado" });
      return res.json(tecnico);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
  
  export const deleteTecnico = async (req, res) => {
    try {
      const deletedTecnico = await User.findByIdAndDelete(req.params.id);
      if (!deletedTecnico)
        return res.status(404).json({ message: "Tecnico no encontrado" });
  
      return res.sendStatus(204);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
  
  export const updateTecnico = async (req, res) => {
    try {
      const { username,
        email,
        password,
      telefono } = req.body;
      const tecnicoUpdated = await User.findOneAndUpdate(
        { _id: req.params.id },
        { username,
            email,
            password,
            telefono },
        { new: true }
      );
      return res.json(tecnicoUpdated);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
  
