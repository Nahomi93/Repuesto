// src/api/axios.js
import axios from 'axios';

const camundaApi = axios.create({
  baseURL: 'http://localhost:8080/engine-rest', // Cambia la URL según tu entorno
  headers: {
    'Content-Type': 'application/json',
  },
});

export default camundaApi;
