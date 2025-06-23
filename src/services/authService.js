import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth';

export const authService = {
    login: (credentials) => {
        return axios.post(`${API_URL}/login`, credentials);
    },

    register: (userData) => {
        return axios.post(`${API_URL}/register`, userData);
    }
}; 