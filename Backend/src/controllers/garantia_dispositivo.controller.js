import Garantia_dispositivo from "../models/garantia_dispositivos.model.js";
import csv from 'csv-parser';
import fs from 'fs';

export const getGarantias= async (req, res) => {
    try {
      const garantias = await Garantia_dispositivo.find();
      res.json(garantias);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
  
  export const createGarantia= async (req, res) => {
    try {
      const { Nro_factura,
      equipo_comprado,
      nombre_cliente,
      apellido_cliente,
      nit_cliente,
      garantia,
      tiempo_garantia,
      fecha_inicio_garantia } = req.body;
      const newGarantia= new Garantia_dispositivo({
        Nro_factura,
        equipo_comprado,
        nombre_cliente,
        apellido_cliente,
        nit_cliente,
        garantia,
        tiempo_garantia,
        fecha_inicio_garantia
      });
      await newGarantia.save();
      res.json(newGarantia);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };

  export const getGarantia = async (req, res) => {
    try {
      const garantia = await Garantia_dispositivo.findById(req.params.id);
      if (!garantia) return res.status(404).json({ message: "Garantia no encontrado" });
      return res.json(garantia);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
  
  export const deleteGarantia = async (req, res) => {
    try {
      const deletedGarantia= await Garantia_dispositivo.findByIdAndDelete(req.params.id);
      if (!deletedGarantia)
        return res.status(404).json({ message: "Garantia no encontrado" });
  
      return res.sendStatus(204);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
  
  export const updateGarantia = async (req, res) => {
    try {
      const {  Nro_factura,
        equipo_comprado,
        nombre_cliente,
        apellido_cliene,
        nit_cliente,
        garantia,
        tiempo_garantia,
        fecha_inicio_garantia } = req.body;
      const garantiaUpdated = await Garantia_dispositivo.findOneAndUpdate(
        { _id: req.params.id },
        {  Nro_factura,
            equipo_comprado,
            nombre_cliente,
            apellido_cliene,
            nit_cliente,
            garantia,
            tiempo_garantia,
            fecha_inicio_garantia },
        { new: true }
      );
      return res.json(garantiaUpdated);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };

  export const importGarantiasFromCSV = async (req, res) => {
    try {
      // Verifica si el archivo ha sido subido correctamente
      if (!req.file) {
        return res.status(400).json({ message: 'Por favor, suba un archivo CSV.' });
      }
  
      const results = [];
  
      // Lee y procesa el archivo CSV
      fs.createReadStream(req.file.path)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', async () => {
          // Guarda los datos importados en la base de datos
          try {
            await Garantia_dispositivo.insertMany(results);
            res.status(200).json({ message: 'Datos de garantías importados con éxito.' });
          } catch (error) {
            res.status(500).json({ message: 'Error al guardar los datos en la base de datos.', error });
          }
        });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };