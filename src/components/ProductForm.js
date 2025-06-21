import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { productService } from '../services/api';

const ProductForm = () => {
    const { createProduct, updateProduct, error, clearError } = useProducts();
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = Boolean(id);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        quantity: ''
    });

    const [loading, setLoading] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});

    const loadProduct = async () => {
        try {
            setLoading(true);
            const response = await productService.getProductById(id);
            const product = response.data;
            setFormData({
                name: product.name,
                description: product.description || '',
                price: product.price.toString(),
                quantity: product.quantity.toString()
            });
        } catch (error) {
            console.error('Failed to load product:', error);
            navigate('/');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isEdit) {
            loadProduct();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, isEdit]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (validationErrors[name]) {
            setValidationErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const errors = {};

        if (!formData.name.trim()) {
            errors.name = 'Name is required';
        }

        if (!formData.price || parseFloat(formData.price) <= 0) {
            errors.price = 'Price must be a positive number';
        }

        if (!formData.quantity || parseInt(formData.quantity) < 0) {
            errors.quantity = 'Quantity must be a non-negative number';
        }

        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        clearError();

        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }

        setLoading(true);
        setValidationErrors({});

        const productData = {
            name: formData.name.trim(),
            description: formData.description.trim(),
            price: parseFloat(formData.price),
            quantity: parseInt(formData.quantity)
        };

        try {
            if (isEdit) {
                await updateProduct(id, productData);
            } else {
                await createProduct(productData);
            }
            navigate('/');
        } catch (error) {
            console.error('Form submission failed:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading && isEdit) {
        return <div className="loading">Loading product...</div>;
    }

    return (
        <div className="card">
            <h2>{isEdit ? 'Edit Product' : 'Add New Product'}</h2>

            {error && (
                <div className="error">
                    {error}
                    <button onClick={clearError} style={{ marginLeft: '10px', background: 'none', border: 'none', color: '#721c24', cursor: 'pointer' }}>
                        ×
                    </button>
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Name *</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`form-control ${validationErrors.name ? 'error' : ''}`}
                        placeholder="Enter product name"
                    />
                    {validationErrors.name && <div className="error">{validationErrors.name}</div>}
                </div>

                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Enter product description"
                        rows="3"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="price">Price *</label>
                    <input
                        type="number"
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        className={`form-control ${validationErrors.price ? 'error' : ''}`}
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                    />
                    {validationErrors.price && <div className="error">{validationErrors.price}</div>}
                </div>

                <div className="form-group">
                    <label htmlFor="quantity">Quantity *</label>
                    <input
                        type="number"
                        id="quantity"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        className={`form-control ${validationErrors.quantity ? 'error' : ''}`}
                        placeholder="0"
                        min="0"
                    />
                    {validationErrors.quantity && <div className="error">{validationErrors.quantity}</div>}
                </div>

                <div className="form-group">
                    <button
                        type="submit"
                        className="btn btn-success"
                        disabled={loading}
                    >
                        {loading ? 'Saving...' : (isEdit ? 'Update Product' : 'Create Product')}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/')}
                        className="btn btn-secondary"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProductForm; 