//ejecutar funciones que se ejcutaran antes de llgara a una ruta

import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";

export const authRequired = (req, res, next) => {  //next en ves de retornar respu continua 
  try {
    
    const { token } = req.cookies;

    if (!token)
      return res
        .status(401)
        .json({ message: "No token, Autorizacion Denegada" });

    jwt.verify(token, TOKEN_SECRET, (error, user) => {
      if (error) {
        return res.status(401).json({ message: "Token Invalido" });
      }
      req.user = user;
      next();
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};