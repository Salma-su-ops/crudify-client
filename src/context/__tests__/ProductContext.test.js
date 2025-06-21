import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { ProductProvider, useProduct } from '../ProductContext';

const mockProducts = [
    {
        id: 1,
        name: 'Test Product 1',
        description: 'Test Description 1',
        price: 99.99,
        quantity: 10
    },
    {
        id: 2,
        name: 'Test Product 2',
        description: 'Test Description 2',
        price: 199.99,
        quantity: 20
    }
];

const TestComponent = () => {
    const { state, dispatch } = useProduct();

    return (
        <div>
            <div data-testid="loading">{state.loading ? 'Loading' : 'Not Loading'}</div>
            <div data-testid="error">{state.error || 'No Error'}</div>
            <div data-testid="products-count">{state.products.length}</div>
            <div data-testid="filtered-products-count">{state.filteredProducts.length}</div>
            <div data-testid="search-term">{state.searchTerm}</div>
            <button onClick={() => dispatch({ type: 'SET_LOADING', payload: true })}>
                Set Loading
            </button>
            <button onClick={() => dispatch({ type: 'SET_PRODUCTS', payload: mockProducts })}>
                Set Products
            </button>
            <button onClick={() => dispatch({ type: 'SET_ERROR', payload: 'Test Error' })}>
                Set Error
            </button>
            <button onClick={() => dispatch({ type: 'SET_SEARCH_TERM', payload: 'test' })}>
                Set Search Term
            </button>
            <button onClick={() => dispatch({ type: 'SET_FILTERED_PRODUCTS', payload: [mockProducts[0]] })}>
                Set Filtered Products
            </button>
        </div>
    );
};

const ComponentWithProvider = () => (
    <ProductProvider>
        <TestComponent />
    </ProductProvider>
);

describe('ProductContext', () => {
    test('provides initial state', () => {
        render(<ComponentWithProvider />);

        expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
        expect(screen.getByTestId('error')).toHaveTextContent('No Error');
        expect(screen.getByTestId('products-count')).toHaveTextContent('0');
        expect(screen.getByTestId('filtered-products-count')).toHaveTextContent('0');
        expect(screen.getByTestId('search-term')).toHaveTextContent('');
    });

    test('handles SET_LOADING action', () => {
        render(<ComponentWithProvider />);

        act(() => {
            screen.getByText('Set Loading').click();
        });

        expect(screen.getByTestId('loading')).toHaveTextContent('Loading');
    });

    test('handles SET_PRODUCTS action', () => {
        render(<ComponentWithProvider />);

        act(() => {
            screen.getByText('Set Products').click();
        });

        expect(screen.getByTestId('products-count')).toHaveTextContent('2');
        expect(screen.getByTestId('filtered-products-count')).toHaveTextContent('2');
    });

    test('handles SET_ERROR action', () => {
        render(<ComponentWithProvider />);

        act(() => {
            screen.getByText('Set Error').click();
        });

        expect(screen.getByTestId('error')).toHaveTextContent('Test Error');
    });

    test('handles SET_SEARCH_TERM action', () => {
        render(<ComponentWithProvider />);

        act(() => {
            screen.getByText('Set Search Term').click();
        });

        expect(screen.getByTestId('search-term')).toHaveTextContent('test');
    });

    test('handles SET_FILTERED_PRODUCTS action', () => {
        render(<ComponentWithProvider />);

        act(() => {
            screen.getByText('Set Filtered Products').click();
        });

        expect(screen.getByTestId('filtered-products-count')).toHaveTextContent('1');
    });

    test('sets filtered products same as products when setting products', () => {
        render(<ComponentWithProvider />);

        act(() => {
            screen.getByText('Set Products').click();
        });

        expect(screen.getByTestId('products-count')).toHaveTextContent('2');
        expect(screen.getByTestId('filtered-products-count')).toHaveTextContent('2');
    });

    test('throws error when useProduct is used outside provider', () => {
        const spy = jest.spyOn(console, 'error').mockImplementation(() => { });

        expect(() => {
            render(<TestComponent />);
        }).toThrow('useProduct must be used within a ProductProvider');

        spy.mockRestore();
    });
}); 