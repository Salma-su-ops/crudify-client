import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';

const ProductList = () => {
    const { products, loading, error, fetchProducts, deleteProduct, searchProducts, clearError } = useProducts();
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            searchProducts(searchTerm);
        } else {
            fetchProducts();
        }
    };

    const handleDelete = async (id, name) => {
        if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
            try {
                await deleteProduct(id);
            } catch (error) {
                console.error('Delete failed:', error);
            }
        }
    };

    const handleEdit = (product) => {
        navigate(`/edit/${product.id}`);
    };

    if (loading) {
        return <div className="loading">Loading products...</div>;
    }

    return (
        <div>
            <div className="card">
                <h2>Product Management</h2>

                {error && (
                    <div className="error">
                        {error}
                        <button onClick={clearError} style={{ marginLeft: '10px', background: 'none', border: 'none', color: '#721c24', cursor: 'pointer' }}>
                            ×
                        </button>
                    </div>
                )}

                <form onSubmit={handleSearch} className="search-bar">
                    <input
                        type="text"
                        placeholder="Search products by name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="form-control"
                    />
                    <button type="submit" className="btn btn-primary">Search</button>
                    <button
                        type="button"
                        onClick={() => {
                            setSearchTerm('');
                            fetchProducts();
                        }}
                        className="btn btn-secondary"
                    >
                        Clear
                    </button>
                </form>
            </div>

            {products.length === 0 ? (
                <div className="card no-products">
                    <p>No products found. <Link to="/add">Add the first product</Link></p>
                </div>
            ) : (
                <div className="product-grid">
                    {products.map(product => (
                        <div key={product.id} className="product-card">
                            <h3>{product.name}</h3>
                            <p>{product.description}</p>
                            <div className="product-price">${product.price}</div>
                            <p><strong>Quantity:</strong> {product.quantity}</p>
                            <p><strong>Created:</strong> {new Date(product.createdAt).toLocaleDateString()}</p>

                            <div className="product-actions">
                                <button
                                    onClick={() => handleEdit(product)}
                                    className="btn btn-primary"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(product.id, product.name)}
                                    className="btn btn-danger"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProductList; 