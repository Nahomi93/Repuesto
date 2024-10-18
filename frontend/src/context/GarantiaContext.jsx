import { createContext, useContext, useState } from "react";  
import {
  createGarantiaRequest,
  deleteGarantiaRequest,
  getGarantiasRequest,
  getGarantiaRequest,
  updateGarantiaRequest,
  importGarantiasCSVRequest,
} from "../api/garantia";

const GarantiaContext = createContext();

export const useGarantias = () => {
  const context = useContext(GarantiaContext);
  if (!context) throw new Error("useGarantias must be used within a GarantiaProvider");
  return context;
};

export function GarantiaProvider({ children }) {
  const [garantias, setGarantias] = useState([]);

  const getGarantias = async () => { 
    try {
        const res = await getGarantiasRequest();
        setGarantias(res.data);
    } catch (error) {
        console.error(error);
    }  
  };

  const deleteGarantia = async (id) => {
    try {
      const res = await deleteGarantiaRequest(id);
      if (res.status === 204) setGarantias(garantias.filter((garantia) => garantia._id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  const createGarantia = async (garantia) => {
    try {
      const res = await createGarantiaRequest(garantia);
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getGarantia = async (id) => {
    try {
      const res = await getGarantiaRequest(id);
      return res.data;
    } catch (error) {
      console.error(error);
    }
  };

  const updateGarantia = async (id, garantia) => {
    try {
      await updateGarantiaRequest(id, garantia);
    } catch (error) {
      console.error(error);
    }
  };

  const importGarantias = async (file) => {
    try {
      const res = await importGarantiasCSVRequest(file);
      return res.data;  // Retornamos los resultados de la importación
    } catch (error) {
      console.error("Error al importar CSV", error);
    }
  };
 
  return (
    <GarantiaContext.Provider
      value={{
        garantias,
        getGarantias,
        deleteGarantia,
        createGarantia,
        getGarantia,
        updateGarantia,
        importGarantias,
      }}
    >
      {children}
    </GarantiaContext.Provider>
  );
}