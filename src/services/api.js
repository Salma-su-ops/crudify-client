import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

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