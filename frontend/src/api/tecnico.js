import axios from "./axios";

export const getTecnicosRequest = async () => axios.get("/tecnicos");

export const createTecnicoRequest = async (tecnico) => axios.post("/auth/register", tecnico);

export const updateTecnicoRequest = async (id, tecnico) => axios.put(`/tecnicos/${id}`, tecnico);

export const deleteTecnicoRequest = async (id) => axios.delete(`/tecnicos/${id}`);

export const getTecnicoRequest = async (id) => axios.get(`/tecnicos/${id}`);
