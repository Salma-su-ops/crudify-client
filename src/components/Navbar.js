import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { isAuthenticated, user, logout } = useAuth();

    const handleLogout = () => {
        logout();
    };

    return (
        <header className="navbar">
            <div className="navbar-content">
                <h1>Crudify</h1>
                <nav>
                    {isAuthenticated ? (
                        <>
                            <Link to="/">Products</Link>
                            <Link to="/add">Add Product</Link>
                            <span className="nav-user">
                                Welcome, {user?.username}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="logout-btn"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login">Login</Link>
                            <Link to="/register">Register</Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Navbar; 