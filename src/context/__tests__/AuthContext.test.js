import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../AuthContext';

jest.mock('../../services/authService');

const TestComponent = () => {
    const { isAuthenticated, user, login, logout, error, loading } = useAuth();

    return (
        <div>
            <div data-testid="loading">{loading ? 'Loading' : 'Not Loading'}</div>
            <div data-testid="authenticated">{isAuthenticated ? 'Authenticated' : 'Not Authenticated'}</div>
            <div data-testid="user">{user?.username || 'No User'}</div>
            <div data-testid="error">{error || 'No Error'}</div>
            <button onClick={() => login({ username: 'test', password: 'test' })}>
                Login
            </button>
            <button onClick={logout}>Logout</button>
        </div>
    );
};

const MockedAuthProvider = () => (
    <AuthProvider>
        <TestComponent />
    </AuthProvider>
);

describe('AuthContext', () => {
    beforeEach(() => {
        localStorage.clear();
        jest.clearAllMocks();
    });

    test('provides initial authentication state', () => {
        render(<MockedAuthProvider />);

        expect(screen.getByTestId('authenticated')).toHaveTextContent('Not Authenticated');
        expect(screen.getByTestId('user')).toHaveTextContent('No User');
        expect(screen.getByTestId('error')).toHaveTextContent('No Error');
    });

    test('initializes from localStorage when token exists', () => {
        const userData = { username: 'testuser', email: 'test@example.com' };
        localStorage.setItem('token', 'fake-token');
        localStorage.setItem('user', JSON.stringify(userData));

        render(<MockedAuthProvider />);

        expect(screen.getByTestId('authenticated')).toHaveTextContent('Authenticated');
        expect(screen.getByTestId('user')).toHaveTextContent('testuser');
    });

    test('handles successful login', async () => {
        const { authService } = require('../../services/authService');
        authService.login.mockResolvedValue({
            data: {
                token: 'fake-token',
                username: 'testuser',
                email: 'test@example.com'
            }
        });

        render(<MockedAuthProvider />);

        const loginButton = screen.getByText('Login');

        await act(async () => {
            loginButton.click();
        });

        expect(screen.getByTestId('authenticated')).toHaveTextContent('Authenticated');
        expect(screen.getByTestId('user')).toHaveTextContent('testuser');
    });

    test('handles login failure', async () => {
        const { authService } = require('../../services/authService');
        authService.login.mockRejectedValue({
            response: {
                data: {
                    message: 'Invalid credentials'
                }
            }
        });

        render(<MockedAuthProvider />);

        const loginButton = screen.getByText('Login');

        await act(async () => {
            loginButton.click();
        });

        expect(screen.getByTestId('error')).toHaveTextContent('Invalid credentials');
        expect(screen.getByTestId('authenticated')).toHaveTextContent('Not Authenticated');
    });

    test('handles logout correctly', async () => {
        // Set initial authenticated state
        localStorage.setItem('token', 'fake-token');
        localStorage.setItem('user', JSON.stringify({ username: 'testuser' }));

        render(<MockedAuthProvider />);

        // Verify initial authenticated state
        expect(screen.getByTestId('authenticated')).toHaveTextContent('Authenticated');

        const logoutButton = screen.getByText('Logout');

        await act(async () => {
            logoutButton.click();
        });

        expect(screen.getByTestId('authenticated')).toHaveTextContent('Not Authenticated');
        expect(screen.getByTestId('user')).toHaveTextContent('No User');
        expect(localStorage.getItem('token')).toBeNull();
        expect(localStorage.getItem('user')).toBeNull();
    });

    test('clears localStorage on corrupted data', () => {
        localStorage.setItem('token', 'fake-token');
        localStorage.setItem('user', 'invalid-json');

        render(<MockedAuthProvider />);

        expect(screen.getByTestId('authenticated')).toHaveTextContent('Not Authenticated');
        expect(localStorage.getItem('token')).toBeNull();
        expect(localStorage.getItem('user')).toBeNull();
    });
}); 