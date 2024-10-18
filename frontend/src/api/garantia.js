import axios from "./axios";

export const getGarantiasRequest = async () => axios.get("/garantia");

export const createGarantiaRequest = async (garantia) => axios.post("/garantia", garantia);

export const updateGarantiaRequest = async (id, garantia) => axios.put(`/garantia/${id}`, garantia);

export const deleteGarantiaRequest = async (id) => axios.delete(`/garantia/${id}`);

export const getGarantiaRequest = async (id) => axios.get(`/garantia/${id}`);

export const importGarantiasCSVRequest = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    
    return axios.post("/garantia/import/csv", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  };