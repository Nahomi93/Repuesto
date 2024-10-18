import axios from "./axios";

export const getReparacionesRequest = async () => axios.get("/reparaciones");

export const getReparacionesclientesRequest = async (id) => axios.get(`/reparaciones/cliente/${id}`);

export const createReparacionRequest = async (reparacion) => axios.post("/reparaciones", reparacion);

export const updateReparacionRequest = async (id, reparacion) => axios.put(`/reparaciones/${id}`, reparacion);

export const calificacionReparacionRequest = async (id, reparacion) => axios.patch(`/reparaciones/${id}`, reparacion);

export const deleteReparacionRequest = async (id) => axios.delete(`/reparaciones/${id}`);

export const getReparacionRequest = async (id) => axios.get(`/reparaciones/${id}`);

