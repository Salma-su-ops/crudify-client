import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <header className="navbar">
            <div className="navbar-content">
                <h1>Crudify</h1>
                <nav>
                    <Link to="/">Products</Link>
                    <Link to="/add">Add Product</Link>
                </nav>
            </div>
        </header>
    );
};

export default Navbar; 