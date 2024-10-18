import axios from "./axios";

export const getClientesRequest = async () => axios.get("/clientes");

export const createClienteRequest = async (user) => axios.post(`/auth/register`, user);

export const updateClienteRequest = async (id, cliente) => axios.put(`/clientes/${id}`, cliente);

export const deletClienteRequest = async (id) => axios.delete(`/clientes/${id}`);

export const getClienteRequest = async (id) => axios.get(`/clientes/${id}`);

export const searchClienteRequest = async (id) => axios.get(`/buscar/cliente/`, id);

 