import { createContext, useContext, useState } from "react";  
import {
  createTecnicoRequest,
  deleteTecnicoRequest,
  getTecnicosRequest,
  getTecnicoRequest,
  updateTecnicoRequest,
} from "../api/tecnico";

const TecnicoContext = createContext();

export const useTecnicos = () => {
  const context = useContext(TecnicoContext);
  if (!context) throw new Error("useTecnicos must be used within a TecnicoProvider");
  return context;
};

export function TecnicoProvider({ children }) {
  const [tecnicos, setTecnicos] = useState([]);

  const getTecnicos = async () => { 
    try {
        const res = await getTecnicosRequest();
        setTecnicos(res.data);
    } catch (error) {
        console.error(error);
    }  
  };

  const deleteTecnico = async (id) => {
    try {
      const res = await deleteTecnicoRequest(id);
      if (res.status === 204) setTecnicos(tecnicos.filter((tecnico) => tecnico._id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  const createTecnico = async (tecnico) => {
    try {
      const res = await createTecnicoRequest(tecnico);
    } catch (error) {
      console.log(error);
    }
  };

  const getTecnico = async (id) => {
    try {
      const res = await getTecnicoRequest(id);
      return res.data;
    } catch (error) {
      console.error(error);
    }
  };

  const updateTecnico = async (id, tecnico) => {
    try {
      await updateTecnicoRequest(id, tecnico);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <TecnicoContext.Provider
      value={{
        tecnicos,
        getTecnicos,
        deleteTecnico,
        createTecnico,
        getTecnico,
        updateTecnico,
      }}
    >
      {children}
    </TecnicoContext.Provider>
  );
}