import React, { createContext, useContext, useReducer } from 'react';
import { productService } from '../services/api';

const ProductContext = createContext();

const initialState = {
    products: [],
    loading: false,
    error: null,
    selectedProduct: null
};

const productReducer = (state, action) => {
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, loading: action.payload };
        case 'SET_ERROR':
            return { ...state, error: action.payload, loading: false };
        case 'SET_PRODUCTS':
            return { ...state, products: action.payload, loading: false, error: null };
        case 'ADD_PRODUCT':
            return { ...state, products: [...state.products, action.payload] };
        case 'UPDATE_PRODUCT':
            return {
                ...state,
                products: state.products.map(p =>
                    p.id === action.payload.id ? action.payload : p
                )
            };
        case 'DELETE_PRODUCT':
            return {
                ...state,
                products: state.products.filter(p => p.id !== action.payload)
            };
        case 'SET_SELECTED_PRODUCT':
            return { ...state, selectedProduct: action.payload };
        default:
            return state;
    }
};

export const ProductProvider = ({ children }) => {
    const [state, dispatch] = useReducer(productReducer, initialState);

    const actions = {
        fetchProducts: async () => {
            dispatch({ type: 'SET_LOADING', payload: true });
            try {
                const response = await productService.getAllProducts();
                dispatch({ type: 'SET_PRODUCTS', payload: response.data });
            } catch (error) {
                dispatch({ type: 'SET_ERROR', payload: error.message });
            }
        },

        createProduct: async (product) => {
            try {
                const response = await productService.createProduct(product);
                dispatch({ type: 'ADD_PRODUCT', payload: response.data });
                return response.data;
            } catch (error) {
                dispatch({ type: 'SET_ERROR', payload: error.message });
                throw error;
            }
        },

        updateProduct: async (id, product) => {
            try {
                const response = await productService.updateProduct(id, product);
                dispatch({ type: 'UPDATE_PRODUCT', payload: response.data });
                return response.data;
            } catch (error) {
                dispatch({ type: 'SET_ERROR', payload: error.message });
                throw error;
            }
        },

        deleteProduct: async (id) => {
            try {
                await productService.deleteProduct(id);
                dispatch({ type: 'DELETE_PRODUCT', payload: id });
            } catch (error) {
                dispatch({ type: 'SET_ERROR', payload: error.message });
                throw error;
            }
        },

        searchProducts: async (name) => {
            dispatch({ type: 'SET_LOADING', payload: true });
            try {
                const response = await productService.searchProducts(name);
                dispatch({ type: 'SET_PRODUCTS', payload: response.data });
            } catch (error) {
                dispatch({ type: 'SET_ERROR', payload: error.message });
            }
        },

        setSelectedProduct: (product) => {
            dispatch({ type: 'SET_SELECTED_PRODUCT', payload: product });
        },

        clearError: () => {
            dispatch({ type: 'SET_ERROR', payload: null });
        }
    };

    return (
        <ProductContext.Provider value={{ ...state, ...actions }}>
            {children}
        </ProductContext.Provider>
    );
};

export const useProducts = () => {
    const context = useContext(ProductContext);
    if (!context) {
        throw new Error('useProducts must be used within ProductProvider');
    }
    return context;
}; 