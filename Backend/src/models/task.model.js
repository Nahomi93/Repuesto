import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
    {
      cliente: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
      },
      title: {
        type: String,
        required: true,
      },
      tipo: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      date: {
        type: Date,
        default: Date.now,
      },

      estado: {
        type: String,
        enum: ['Pendiente', 'Aceptada', 'Rechazada'],
        default: 'Pendiente'
      },
      garantia: {
        type: Boolean,
        required: true,
      },
      hora: {
        type: String, 
        required: true,
      },
    },
    {
      timestamps: true,
    }
  );
  
  export default mongoose.model("Task", taskSchema);