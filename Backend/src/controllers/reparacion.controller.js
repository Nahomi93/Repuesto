import Reparacion from "../models/reparacion.model.js";
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import PDFDocument from 'pdfkit'; // Importar 
const storage = multer.diskStorage({
  filename: (req, file, cb) => {
      cb(null, file.originalname);
  },
  destination: (req, file, cb) => {
      cb(null, './public');
  },
  
  });
  export const upload = multer({ storage: storage }).array('fotos', 10);  // Acepta hasta 10 archivos
  export const getReparaciones = async (req, res) => {
    try {
      const reparaciones = await Reparacion.find()
      .populate('cliente', 'username')  // 'nombre' es un campo en el documento 'Cliente'
      .populate('tecnico', 'username'); // 'nombre' es un campo en el documento 'Tecnico';
      console.log(reparaciones);
      res.json(reparaciones);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error.message });
    }
  };
  
  export const getReparacionesCliente = async (req, res) => {
    try {
      console.log(req.params.id);
      const reparaciones = await Reparacion.find({cliente: req.params.id })
      .populate('cliente', 'username')  // 'nombre' es un campo en el documento 'Cliente'
      .populate('tecnico', 'username'); // 'nombre' es un campo en el documento 'Tecnico';
      console.log(reparaciones);
      res.json(reparaciones);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error.message });
    }
  };
  export const createReparacion = async (req, res) => {
    try {
      
      let fileNames; 
      if (req.files) {
        fileNames = req.files.map(file => file.originalname);  // Extrae los nombres de los archivos
        console.log(fileNames);  // Muestra los nombres de archivos en la consola
      }
      else{
        fileNames = [];
      }
      const {cliente,tecnico, fecha_devolucion,fecha_recepcion,accesorios_dejados,
        description_problema,costo,aceptacion_cambios,cotizacion, finalizado, problemaDiagnosticado,garantia} = req.body;
      //console.log(JSON.parse(fileNames));  // Muestra los nombres de archivos en la consola
      const newReparacion = new Reparacion({
        cliente,
        tecnico,
        fecha_recepcion,
        fecha_devolucion,
        accesorios_dejados: JSON.parse(accesorios_dejados), // Asegurándose de parsear el array
        description_problema,
        problemaDiagnosticado,
        garantia,
        costo,
        fotos: fileNames,
        aceptacion_cambios,
        calificacion: null,
        cotizacion: JSON.parse(cotizacion),
        finalizado:null
      });
      await newReparacion.save();
      res.json(newReparacion);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error.message });
    }
  };
  export const getReparacion = async (req, res) => {
    try {
      const reparacion = await Reparacion.findById(req.params.id);
      if (!reparacion) return res.status(404).json({ message: "Reparacion no encontrada" });
      return res.json(reparacion);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
  
  export const deleteReparacion = async (req, res) => {
    try {
      const deletedReparacion = await Reparacion.findByIdAndDelete(req.params.id);
      if (!deletedReparacion)
        return res.status(404).json({ message: "Reparacion no encontrada" });
  
      return res.sendStatus(204);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
  
  export const updateReparacion = async (req, res) => {
    try {
      let fileNames = [];
      if (req.files) {
        fileNames = req.files.map(file => file.originalname);
        console.log(fileNames);
      }

      const { cliente, tecnico, fecha_devolucion, fecha_recepcion, accesorios_dejados, 
        description_problema, garantia, problemaDiagnosticado,costo, aceptacion_cambios,cotizacion, rol, finalizado } = req.body;
      let reparacionUpdated;
      if(rol === 'Cliente'){
        reparacionUpdated = await Reparacion.findByIdAndUpdate(
          req.params.id,
          {
            cotizacion: JSON.parse(cotizacion)
          },
          { new: true }
        );
      }
      reparacionUpdated = await Reparacion.findByIdAndUpdate(
        req.params.id,
        {
          cliente,
          tecnico,
          fecha_devolucion,
          fecha_recepcion,
          accesorios_dejados: JSON.parse(accesorios_dejados),
          description_problema,
          garantia,
          problemaDiagnosticado,
          costo,
          aceptacion_cambios,
          finalizado,
          $push: { fotos: { $each: fileNames } }, // Añade las nuevas fotos al array
          cotizacion: JSON.parse(cotizacion)

        },
        { new: true }
      );
  
      res.json(reparacionUpdated);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error.message });
    }
  };
  
  export const updateReparacionFotos = async (req, res) => {
    try {
      const { fotos } = req.body; // Expecting an array of file names
      const reparacionUpdated = await Reparacion.findOneAndUpdate(
        { _id: req.params.id },
        { $push: { fotos: { $each: fotos } } }, // Push all new photos
        { new: true }
      );
      return res.json(reparacionUpdated);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
  export const deleteReparacionFoto = async (req, res) => {
    try {
      const { foto } = req.body; // Nombre del archivo a eliminar
      const filePath = path.join(__dirname, '..', 'public', foto);
  
      // Eliminar foto del sistema de archivos
      fs.unlink(filePath, (err) => {
        if (err) {
        
          return res.status(500).json({ message: 'Error al eliminar la foto.' });
        }
      });
  
      const reparacionUpdated = await Reparacion.findOneAndUpdate(
        { _id: req.params.id },
        { $pull: { fotos: foto } }, // Elimina el nombre de la foto específica del array
        { new: true }
      );
      res.json(reparacionUpdated);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
  export const calificacionReparacion = async (req, res) => {
    try {
        const reparacionUpdated = await Reparacion.findOneAndUpdate(
        { _id: req.params.id },
        { $set: req.body},
        { new: true }
      );
      console.log(reparacionUpdated);
      return res.json(reparacionUpdated);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };

  export const actualizarEstadoReparacion = async (req, res) => {
    try {
      const { estado } = req.body; // Recibimos el nuevo estado desde el frontend
  
      if (!["Recibido", "En Reparación", "Entregado"].includes(estado)) {
        return res.status(400).json({ message: "Estado no válido" });
      }
  
      const reparacionUpdated = await Reparacion.findByIdAndUpdate(
        req.params.id,
        {
          estado,
          ...(estado === "Entregado" && { fecha_devolucion: new Date() }) // Si es entregado, registrar la fecha
        },
        { new: true }
      );
  
      if (!reparacionUpdated) {
        return res.status(404).json({ message: "Reparación no encontrada" });
      }
  
      res.json(reparacionUpdated);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error.message });
    }
  };

  export const generarReportePDF = async (req, res) => {
    try {
      const reparaciones = await Reparacion.find()
        .populate('cliente', 'username')
        .populate('tecnico', 'nombre');
  
      const doc = new PDFDocument({ size: 'A4', layout: 'portrait', margin: 50 });
  
      // Configurar los encabezados para la descarga del PDF
      res.setHeader('Content-Disposition', 'attachment; filename=reporte_reparaciones.pdf');
      res.setHeader('Content-Type', 'application/pdf');
  
      doc.pipe(res);
  
      // Encabezado del reporte
      doc.fontSize(18).text('Reporte de Reparaciones', { align: 'center' });
      doc.moveDown();
  
      // Iterar sobre las reparaciones y agregar los datos al PDF
      reparaciones.forEach((reparacion, index) => {
        doc.fontSize(12).text(`Reparación #${index + 1}`, { underline: true });
        doc.text(`Cliente: ${reparacion.cliente.username}`);
        doc.text(`Técnico: ${reparacion.tecnico.nombre}`);
        doc.text(`Fecha de Recepción: ${reparacion.fecha_recepcion}`);
        doc.text(`Fecha de Devolución: ${reparacion.fecha_devolucion || 'No entregado'}`);
        doc.text(`Costo: ${reparacion.costo} Bs`);
        doc.text(`Descripción del Problema: ${reparacion.description_problema}`);
        doc.text(`Estado: ${reparacion.finalizado ? 'Finalizado' : 'Pendiente'}`);
        doc.moveDown(2);
      });
  
      doc.end();
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  };