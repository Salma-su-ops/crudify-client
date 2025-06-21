import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProductList from '../ProductList';
import { ProductProvider } from '../../context/ProductContext';

const mockProducts = [
    {
        id: 1,
        name: 'Test Product 1',
        description: 'Test Description 1',
        price: 99.99,
        quantity: 10,
        createdAt: '2025-01-01T00:00:00'
    }
];

const MockedProductList = () => (
    <BrowserRouter>
        <ProductProvider>
            <ProductList />
        </ProductProvider>
    </BrowserRouter>
);

jest.mock('../../services/api', () => ({
    productService: {
        getAllProducts: jest.fn(() => Promise.resolve({ data: mockProducts })),
        searchProducts: jest.fn(() => Promise.resolve({ data: mockProducts })),
        deleteProduct: jest.fn(() => Promise.resolve())
    }
}));

describe('ProductList', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders search form', async () => {
        render(<MockedProductList />);

        await waitFor(() => {
            expect(screen.getByPlaceholderText('Search products by name...')).toBeInTheDocument();
        });
    });

    test('renders product information when products exist', async () => {
        render(<MockedProductList />);

        await waitFor(() => {
            expect(screen.getByText('Test Product 1')).toBeInTheDocument();
            expect(screen.getByText('$99.99')).toBeInTheDocument();
        });
    });

    test('displays loading state', () => {
        render(<MockedProductList />);
        expect(screen.getByText('Loading products...')).toBeInTheDocument();
    });

    test('handles search form interaction', async () => {
        render(<MockedProductList />);

        await waitFor(() => {
            const searchInput = screen.getByPlaceholderText('Search products by name...');
            fireEvent.change(searchInput, { target: { value: 'test' } });
            expect(searchInput.value).toBe('test');
        });
    });
}); 