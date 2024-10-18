import { createContext, useContext, useState } from "react";  
import {
  createClienteRequest,
  deletClienteRequest,
  getClientesRequest,
  getClienteRequest,
  updateClienteRequest,
  searchClienteRequest,
} from "../api/cliente";
import Cookies from "js-cookie"

const ClienteContext = createContext();

export const useClientes = () => {
  const context = useContext(ClienteContext);
  if (!context) throw new Error("useClientes must be used within a ClienteProvider");
  return context;
};

export function ClienteProvider({ children }) {
  const [clientes, setclientes] = useState([]);

  const obtenerToken = () => { const token = Cookies.get('token'); return token;}; 
  const token = obtenerToken();
  const configInicial = { headers: { Authorization: `Bearer ${token}` }}; 

  const getClientes = async () => { 
    try {
      const res = await getClientesRequest(configInicial);
      setclientes(res.data);
      console.log(res.data);
    } catch (error) {
        console.error(error);
    }  
  };

  const deleteCliente = async (id) => {
    try {
      const res = await deletClienteRequest(id, configInicial);
      if (res.status === 204) setclientes(clientes.filter((cliente) => cliente._id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  const createCliente = async (cliente) => {
    try {
      const res = await createClienteRequest(cliente, configInicial);
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getCliente = async (id) => {
    try {
      const res = await getClienteRequest(id, configInicial);
      return res.data;
    } catch (error) {
      console.error(error);
    }
  };

  const updateCliente = async (id, cliente) => {
    try {
      await updateClienteRequest(id, cliente, configInicial);
    } catch (error) {
      console.error(error);
    }
  };

  const searchCliente = async (id) => {
    try {
      await searchClienteRequest(id, configInicial);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ClienteContext.Provider
      value={{
        clientes,
        getClientes,
        deleteCliente,
        createCliente,
        getCliente,
        updateCliente,
        searchCliente,
      }}
    >
      {children}
    </ClienteContext.Provider>
  );
}