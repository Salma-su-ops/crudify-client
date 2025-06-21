import axios from 'axios';
import { productService } from '../api';

jest.mock('axios');
const mockedAxios = axios;

describe('productService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getAllProducts', () => {
        test('should fetch all products', async () => {
            const mockProducts = [
                { id: 1, name: 'Product 1', price: 99.99 },
                { id: 2, name: 'Product 2', price: 199.99 }
            ];

            mockedAxios.get.mockResolvedValue({ data: mockProducts });

            const result = await productService.getAllProducts();

            expect(mockedAxios.get).toHaveBeenCalledWith('/api/products');
            expect(result.data).toEqual(mockProducts);
        });

        test('should handle error when fetching products', async () => {
            const error = new Error('Network Error');
            mockedAxios.get.mockRejectedValue(error);

            await expect(productService.getAllProducts()).rejects.toThrow('Network Error');
        });
    });

    describe('getProductById', () => {
        test('should fetch product by id', async () => {
            const mockProduct = { id: 1, name: 'Product 1', price: 99.99 };

            mockedAxios.get.mockResolvedValue({ data: mockProduct });

            const result = await productService.getProductById(1);

            expect(mockedAxios.get).toHaveBeenCalledWith('/api/products/1');
            expect(result.data).toEqual(mockProduct);
        });

        test('should handle error when fetching product by id', async () => {
            const error = new Error('Product not found');
            mockedAxios.get.mockRejectedValue(error);

            await expect(productService.getProductById(1)).rejects.toThrow('Product not found');
        });
    });

    describe('createProduct', () => {
        test('should create a new product', async () => {
            const newProduct = {
                name: 'New Product',
                description: 'New Description',
                price: 99.99,
                quantity: 10
            };

            const createdProduct = { id: 1, ...newProduct };

            mockedAxios.post.mockResolvedValue({ data: createdProduct });

            const result = await productService.createProduct(newProduct);

            expect(mockedAxios.post).toHaveBeenCalledWith('/api/products', newProduct);
            expect(result.data).toEqual(createdProduct);
        });

        test('should handle error when creating product', async () => {
            const newProduct = { name: 'Invalid Product' };
            const error = new Error('Validation failed');

            mockedAxios.post.mockRejectedValue(error);

            await expect(productService.createProduct(newProduct)).rejects.toThrow('Validation failed');
        });
    });

    describe('updateProduct', () => {
        test('should update an existing product', async () => {
            const productId = 1;
            const updatedData = {
                name: 'Updated Product',
                description: 'Updated Description',
                price: 199.99,
                quantity: 20
            };

            const updatedProduct = { id: productId, ...updatedData };

            mockedAxios.put.mockResolvedValue({ data: updatedProduct });

            const result = await productService.updateProduct(productId, updatedData);

            expect(mockedAxios.put).toHaveBeenCalledWith(`/api/products/${productId}`, updatedData);
            expect(result.data).toEqual(updatedProduct);
        });

        test('should handle error when updating product', async () => {
            const error = new Error('Product not found');
            mockedAxios.put.mockRejectedValue(error);

            await expect(productService.updateProduct(1, {})).rejects.toThrow('Product not found');
        });
    });

    describe('deleteProduct', () => {
        test('should delete a product', async () => {
            const productId = 1;

            mockedAxios.delete.mockResolvedValue({ status: 204 });

            const result = await productService.deleteProduct(productId);

            expect(mockedAxios.delete).toHaveBeenCalledWith(`/api/products/${productId}`);
            expect(result.status).toBe(204);
        });

        test('should handle error when deleting product', async () => {
            const error = new Error('Product not found');
            mockedAxios.delete.mockRejectedValue(error);

            await expect(productService.deleteProduct(1)).rejects.toThrow('Product not found');
        });
    });

    describe('searchProducts', () => {
        test('should search products by name', async () => {
            const searchTerm = 'test';
            const mockProducts = [
                { id: 1, name: 'Test Product', price: 99.99 }
            ];

            mockedAxios.get.mockResolvedValue({ data: mockProducts });

            const result = await productService.searchProducts(searchTerm);

            expect(mockedAxios.get).toHaveBeenCalledWith('/api/products/search', {
                params: { name: searchTerm }
            });
            expect(result.data).toEqual(mockProducts);
        });

        test('should handle error when searching products', async () => {
            const error = new Error('Search failed');
            mockedAxios.get.mockRejectedValue(error);

            await expect(productService.searchProducts('test')).rejects.toThrow('Search failed');
        });
    });
}); 