import { Router } from "express"; // importar para crear enrutador con esto creamos funciones post put delete
import axios from 'axios'; // Para interactuar con Camunda REST API
import {
  login,
  logout,
  register,
  verifyToken,
} from "../controllers/auth.controller.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { loginSchema, registerSchema } from "../schemas/auth.shema.js";
//import { authRequired } from "../middlewares/validateToken.js";

const router = Router();

router.post("/register", validateSchema(registerSchema), register);
router.post("/login", validateSchema(loginSchema), login);
router.get("/verify", verifyToken);
router.post("/logout", verifyToken, logout);
//router.get("/profile", authRequired, profile);

router.post('/login/camunda', validateSchema(loginSchema), async (req, res) => {
  const { email, password } = req.body;

  try {
    // Llamada a la API de Camunda para iniciar el proceso de login
    const response = await axios.post(`http://localhost:8080/engine-rest/process-definition/key/IniciarSesión/start`, {
      variables: {
        email: { value: email, type: "String" },
        password: { value: password, type: "String" }
      }
    });

    // Procesar la respuesta de Camunda
    const processInstanceId = response.data.id;

    // Opcional: Aquí puedes esperar o hacer otra llamada a la API de Camunda para verificar el estado del proceso

    res.status(200).json({ message: "Proceso de login iniciado en Camunda", processInstanceId });
  } catch (error) {
    res.status(500).json({ message: "Error al iniciar el proceso en Camunda", error: error.message });
  }
});

export default router;