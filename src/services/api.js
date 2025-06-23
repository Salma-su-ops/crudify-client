import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor to include JWT token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor to handle token expiration
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const productService = {
    getAllProducts: () => api.get('/products'),
    getProductById: (id) => api.get(`/products/${id}`),
    createProduct: (product) => api.post('/products', product),
    updateProduct: (id, product) => api.put(`/products/${id}`, product),
    deleteProduct: (id) => api.delete(`/products/${id}`),
    searchProducts: (name) => api.get(`/products/search?name=${name}`),
    getProductsWithMinQuantity: (min) => api.get(`/products/quantity?min=${min}`)
};

export default api; 