import { createContext, useContext, useState } from "react";  
import {
  createReparacionRequest,
  deleteReparacionRequest,
  getReparacionesRequest,
  getReparacionRequest,
  updateReparacionRequest,
  calificacionReparacionRequest,
  getReparacionesclientesRequest,
  updateEstadoReparacionRequest,
  downloadReporteReparacionesRequest,
} from "../api/reparacion";
import axios from 'axios'; // Asegúrate de importar axios

const ReparacionContext = createContext();

export const useReparaciones = () => {
  const context = useContext(ReparacionContext);
  if (!context) throw new Error("useReparaciones must be used within a ReparacionProvider");
  return context;
};

const descargarReporte = async () => {
  try {
    const response = await downloadReporteReparacionesRequest();
    const blob = new Blob([response.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "reporte_reparaciones.pdf";
    a.click();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error al descargar el reporte:", error);
  }
};

export function ReparacionProvider({ children }) {
  const [reparaciones, setReparaciones] = useState([]);

  const getReparaciones = async () => { 
    try {
        const res = await getReparacionesRequest();
        setReparaciones(res.data);
        console.log(res.data)
    } catch (error) {
        console.error(error);
    }  
  };
  const getReparacionesclientes = async (id) => { 
    try {
        const res = await getReparacionesclientesRequest(id);
        setReparaciones(res.data);
    } catch (error) {
        console.error(error);
    }  
  };

  const deleteReparacion = async (id) => {
    try {
      const res = await deleteReparacionRequest(id);
      if (res.status === 204) setReparaciones(reparaciones.filter((reparacion) => reparacion._id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  const createReparacion = async (reparacion) => {
    try {
      console.log(reparacion);
      const res = await createReparacionRequest(reparacion);
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getReparacion = async (id) => {
    try {
      const res = await getReparacionRequest(id);
      return res.data;
    } catch (error) {
      console.error(error);
    }
  };

  const updateReparacion = async (id, reparacion) => {
    try {
      await updateReparacionRequest(id, reparacion);
    } catch (error) {
      console.error(error);
    }
  };

  const updateEstadoReparacion = async (id, estado) => {
    try {
      await updateEstadoReparacionRequest(id, estado);
      setReparaciones((prev) =>
        prev.map((rep) => (rep._id === id ? { ...rep, estado } : rep))
      );
    } catch (error) {
      console.error("Error al actualizar el estado:", error);
    }
  };

  const calificarReparacion = async (id, reparacion) => {
    try {
      await calificacionReparacionRequest(id, reparacion);
    } catch (error) {
      console.error(error);
    }
  };
 
  const deleteReparacionFoto = async (id, foto) => {
    try {
      const res = await axios.delete(`/reparaciones/${id}/foto`, { 
        params: { foto } // Usa params para enviar los datos en la URL
      });
      return res.data;
    } catch (error) {
      console.error('Error al eliminar la foto', error);
      throw error;
    }
  };

  return (
    <ReparacionContext.Provider
      value={{
        reparaciones,
        getReparaciones,
        deleteReparacion,
        createReparacion,
        getReparacion,
        updateReparacion,
        updateEstadoReparacion,
        calificarReparacion,
        getReparacionesclientes,
        deleteReparacionFoto,
        descargarReporte,
      }}
    >
      {children}
    </ReparacionContext.Provider>
  );
}