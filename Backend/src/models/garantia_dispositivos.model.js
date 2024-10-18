import mongoose from "mongoose";

const garantia_dispositivoSchema = new mongoose.Schema(
    {
      Nro_factura: {
        type: Number,
        required: true,
        unique:true,
      },
      equipo_comprado: {
        type: String,
        require: true,
      },
      nombre_cliente: {
        type: String,
        require: true,
      },
      apellido_cliente: {
        type: String,
        require: true,
      },
      nit_cliente: {
        type: Number,
        require: true,
    },
    garantia: {
        type: String,
        require: true,
    },
    tiempo_garantia: {
        type: String,    //sugerencia de la hormiga   fecha_final.. date
        require: false,
        default: null  // Asegura que el valor por defecto sea null si no se proporciona
    },
    fecha_inicio_garantia: {
        type: Date,
        default: null,  // Asegura que el valor por defecto sea null si no se proporciona
        require: false,
    },
},{
      timestamps: true,
    }
  );
  
  export default mongoose.model("Garantia_dispositivo", garantia_dispositivoSchema);