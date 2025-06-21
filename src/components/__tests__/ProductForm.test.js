import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProductForm from '../ProductForm';
import { ProductProvider } from '../../context/ProductContext';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
    useParams: () => ({ id: undefined })
}));

// Mock the API service properly
const mockCreateProduct = jest.fn();
const mockUpdateProduct = jest.fn();
const mockGetProductById = jest.fn();

jest.mock('../../services/api', () => ({
    productService: {
        createProduct: mockCreateProduct,
        updateProduct: mockUpdateProduct,
        getProductById: mockGetProductById
    }
}));

const MockedProductForm = () => (
    <BrowserRouter>
        <ProductProvider>
            <ProductForm />
        </ProductProvider>
    </BrowserRouter>
);

describe('ProductForm', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockCreateProduct.mockResolvedValue({ data: { id: 1, name: 'Test Product' } });
        mockUpdateProduct.mockResolvedValue({ data: { id: 1, name: 'Updated Product' } });
        mockGetProductById.mockResolvedValue({
            data: {
                id: 1,
                name: 'Existing Product',
                description: 'Existing Description',
                price: 99.99,
                quantity: 10
            }
        });
    });

    test('renders form fields correctly', () => {
        render(<MockedProductForm />);

        expect(screen.getByLabelText('Name *')).toBeInTheDocument();
        expect(screen.getByLabelText('Description')).toBeInTheDocument();
        expect(screen.getByLabelText('Price *')).toBeInTheDocument();
        expect(screen.getByLabelText('Quantity *')).toBeInTheDocument();
    });

    test('renders create form title for new product', () => {
        render(<MockedProductForm />);
        expect(screen.getByText('Add New Product')).toBeInTheDocument();
    });

    test('renders create button for new product', () => {
        render(<MockedProductForm />);
        expect(screen.getByText('Create Product')).toBeInTheDocument();
    });

    test('renders cancel button', () => {
        render(<MockedProductForm />);
        expect(screen.getByText('Cancel')).toBeInTheDocument();
    });

    test('validates required fields', async () => {
        render(<MockedProductForm />);

        const submitButton = screen.getByText('Create Product');

        await act(async () => {
            fireEvent.click(submitButton);
        });

        await waitFor(() => {
            expect(screen.getByText('Name is required')).toBeInTheDocument();
        });
    });

    test('validates price field', async () => {
        render(<MockedProductForm />);

        const priceInput = screen.getByLabelText('Price *');
        const submitButton = screen.getByText('Create Product');

        await act(async () => {
            fireEvent.change(priceInput, { target: { value: '-10' } });
            fireEvent.click(submitButton);
        });

        await waitFor(() => {
            expect(screen.getByText('Price must be a positive number')).toBeInTheDocument();
        });
    });

    test('validates quantity field', async () => {
        render(<MockedProductForm />);

        const quantityInput = screen.getByLabelText('Quantity *');
        const submitButton = screen.getByText('Create Product');

        fireEvent.change(quantityInput, { target: { value: '-5' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText('Quantity must be a non-negative number')).toBeInTheDocument();
        });
    });

    test('submits form with valid data', async () => {
        render(<MockedProductForm />);

        fireEvent.change(screen.getByLabelText('Name *'), { target: { value: 'Test Product' } });
        fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Test Description' } });
        fireEvent.change(screen.getByLabelText('Price *'), { target: { value: '99.99' } });
        fireEvent.change(screen.getByLabelText('Quantity *'), { target: { value: '10' } });

        fireEvent.click(screen.getByText('Create Product'));

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/');
        });
    });

    test('handles form input changes', () => {
        render(<MockedProductForm />);

        const nameInput = screen.getByLabelText('Name *');
        fireEvent.change(nameInput, { target: { value: 'New Product Name' } });

        expect(nameInput.value).toBe('New Product Name');
    });

    test('clears validation errors when user types', async () => {
        render(<MockedProductForm />);

        const nameInput = screen.getByLabelText('Name *');
        const submitButton = screen.getByText('Create Product');

        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText('Name is required')).toBeInTheDocument();
        });

        fireEvent.change(nameInput, { target: { value: 'Test Name' } });

        expect(screen.queryByText('Name is required')).not.toBeInTheDocument();
    });

    test('navigates back when cancel is clicked', () => {
        render(<MockedProductForm />);

        fireEvent.click(screen.getByText('Cancel'));

        expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    test('disables submit button when loading', async () => {
        render(<MockedProductForm />);

        fireEvent.change(screen.getByLabelText('Name *'), { target: { value: 'Test Product' } });
        fireEvent.change(screen.getByLabelText('Price *'), { target: { value: '99.99' } });
        fireEvent.change(screen.getByLabelText('Quantity *'), { target: { value: '10' } });

        const submitButton = screen.getByText('Create Product');
        fireEvent.click(submitButton);

        expect(submitButton).toBeDisabled();
    });
}); 