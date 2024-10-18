import mongoose from "mongoose";

const reparacionSchema = new mongoose.Schema(
    {
      cliente: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
      },
      tecnico: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
      },
      fecha_recepcion: {
        type: Date,
        default: Date.now,
      },
      fecha_devolucion: {
        type: Date,
        required: true
      },
      accesorios_dejados: [{
        type: String,
        required: true,
      }],
      description_problema: {
        type: String,
        required: true,
      },
      costo: {
        type: Number,
        required: true,
      },
      fotos: [{
        type: String,
        required: false,
      }],
      aceptacion_cambios: {
        type: Boolean,
        required: false,
      },
      calificacion: {
        type: Number,
        required: false,
      },
      cotizacion: [{
        componente: {
          type: String,  // precio de la cotización
          required: false
        },
        precio: {
          type: Number,  // precio de la cotización
          required: false
        },
        aceptado: {
          type: Boolean,  // si se aceptó o no
          required: false
        }
      }],
      finalizado:{
        type: Boolean,
        required: false,
      },
      problemaDiagnosticado: {
        type: String,
        required: false, // Puede ser opcional al inicio
      },
      garantia: {
        type: Boolean,
        required: false, // Indica si tiene o no garantía
      },
    },
    {
      timestamps: true,  //fechas registro y update
    }
  );
  
  export default mongoose.model("Reparacion", reparacionSchema);