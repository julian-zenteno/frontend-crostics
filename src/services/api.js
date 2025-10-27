import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3001/api', // La URL base de tu backend
});

export default api;
