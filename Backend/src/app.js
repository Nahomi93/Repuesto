import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import axios from "axios";  // Importa axios para interactuar con Camunda

import authRoutes from "./routes/auth.routes.js";
import taksRoutes from "./routes/tasks.routes.js";
import tecnicosRoutes from "./routes/tecnico.routes.js";
import clientesRoutes from "./routes/cliente.routes.js";
import reparacionRoutes from "./routes/reparacion.routes.js";
import garantiaRoutes from "./routes/garantia_dispositivo.routes.js";

import { FRONTEND_URL } from "./config.js";

const app = express();

// Configuración de CORS y middlewares
app.use(
  cors({
    credentials: true,
    origin: FRONTEND_URL,
  })
);

app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api", taksRoutes);
app.use("/api", tecnicosRoutes);
app.use("/api", clientesRoutes);
app.use("/api", reparacionRoutes);
app.use("/api", garantiaRoutes);

app.use(express.static("public"));

// Inicializar un proceso en Camunda (nueva ruta para Camunda)
app.post("/api/camunda/start-process", async (req, res) => {
  try {
    // Aquí es donde inicias el proceso de Camunda
    const { processKey, variables } = req.body; 
    const response = await axios.post(
      `http://localhost:8080/engine-rest/process-definition/key/${processKey}/start`,
      {
        variables: variables, // Variables que envías al proceso
      }
    );
    res.status(200).json(response.data); // Responde con los datos del proceso iniciado
  } catch (error) {
    console.error("Error al iniciar el proceso:", error);
    res.status(500).json({ error: "Error al iniciar el proceso" });
  }
});

// Ruta para obtener tareas de Camunda (nueva ruta para Camunda)
app.get("/api/camunda/tasks", async (req, res) => {
  try {
    const response = await axios.get("http://localhost:8080/engine-rest/task");
    res.status(200).json(response.data); // Responde con las tareas obtenidas
  } catch (error) {
    console.error("Error al obtener tareas:", error);
    res.status(500).json({ error: "Error al obtener tareas" });
  }
});

// Manejo de archivos estáticos en producción
if (process.env.NODE_ENV === "production") {
  const path = await import("path");
  app.use(express.static("client/dist"));

  app.get("*", (req, res) => {
    console.log(path.resolve("client", "dist", "index.html"));
    res.sendFile(path.resolve("client", "dist", "index.html"));
  });
}

export default app;
