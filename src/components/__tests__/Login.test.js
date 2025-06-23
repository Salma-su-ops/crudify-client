import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../Login';
import { AuthProvider } from '../../context/AuthContext';

// Mock the auth service
jest.mock('../../services/authService', () => ({
    authService: {
        login: jest.fn()
    }
}));

// Mock react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate
}));

const MockedLogin = () => (
    <BrowserRouter>
        <AuthProvider>
            <Login />
        </AuthProvider>
    </BrowserRouter>
);

describe('Login Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders login form correctly', () => {
        render(<MockedLogin />);

        expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
        expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    });

    test('displays validation errors for empty fields', async () => {
        render(<MockedLogin />);

        const loginButton = screen.getByRole('button', { name: /login/i });
        fireEvent.click(loginButton);

        await waitFor(() => {
            expect(screen.getByText(/username is required/i)).toBeInTheDocument();
            expect(screen.getByText(/password is required/i)).toBeInTheDocument();
        });
    });

    test('updates input values when typing', () => {
        render(<MockedLogin />);

        const usernameInput = screen.getByLabelText(/username/i);
        const passwordInput = screen.getByLabelText(/password/i);

        fireEvent.change(usernameInput, { target: { value: 'testuser' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });

        expect(usernameInput.value).toBe('testuser');
        expect(passwordInput.value).toBe('password123');
    });

    test('clears validation errors when user starts typing', async () => {
        render(<MockedLogin />);

        const loginButton = screen.getByRole('button', { name: /login/i });
        fireEvent.click(loginButton);

        await waitFor(() => {
            expect(screen.getByText(/username is required/i)).toBeInTheDocument();
        });

        const usernameInput = screen.getByLabelText(/username/i);
        fireEvent.change(usernameInput, { target: { value: 't' } });

        await waitFor(() => {
            expect(screen.queryByText(/username is required/i)).not.toBeInTheDocument();
        });
    });

    test('shows loading state during login submission', async () => {
        const { authService } = require('../../services/authService');
        authService.login.mockReturnValue(new Promise(() => { })); // Never resolves

        render(<MockedLogin />);

        const usernameInput = screen.getByLabelText(/username/i);
        const passwordInput = screen.getByLabelText(/password/i);
        const loginButton = screen.getByRole('button', { name: /login/i });

        fireEvent.change(usernameInput, { target: { value: 'testuser' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.click(loginButton);

        await waitFor(() => {
            expect(screen.getByText(/logging in.../i)).toBeInTheDocument();
            expect(loginButton).toBeDisabled();
        });
    });

    test('validates required fields before submission', async () => {
        render(<MockedLogin />);

        const usernameInput = screen.getByLabelText(/username/i);
        const loginButton = screen.getByRole('button', { name: /login/i });

        // Fill only username, leave password empty
        fireEvent.change(usernameInput, { target: { value: 'testuser' } });
        fireEvent.click(loginButton);

        await waitFor(() => {
            expect(screen.getByText(/password is required/i)).toBeInTheDocument();
        });

        // Login should not be called with invalid form
        const { authService } = require('../../services/authService');
        expect(authService.login).not.toHaveBeenCalled();
    });

    test('handles successful login', async () => {
        const { authService } = require('../../services/authService');
        authService.login.mockResolvedValue({
            data: {
                token: 'fake-jwt-token',
                username: 'testuser',
                email: 'test@example.com'
            }
        });

        render(<MockedLogin />);

        const usernameInput = screen.getByLabelText(/username/i);
        const passwordInput = screen.getByLabelText(/password/i);
        const loginButton = screen.getByRole('button', { name: /login/i });

        fireEvent.change(usernameInput, { target: { value: 'testuser' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.click(loginButton);

        await waitFor(() => {
            expect(authService.login).toHaveBeenCalledWith({
                username: 'testuser',
                password: 'password123'
            });
        });
    });

    test('handles login failure with error message', async () => {
        const { authService } = require('../../services/authService');
        authService.login.mockRejectedValue({
            response: {
                data: {
                    message: 'Invalid credentials'
                }
            }
        });

        render(<MockedLogin />);

        const usernameInput = screen.getByLabelText(/username/i);
        const passwordInput = screen.getByLabelText(/password/i);
        const loginButton = screen.getByRole('button', { name: /login/i });

        fireEvent.change(usernameInput, { target: { value: 'wronguser' } });
        fireEvent.change(passwordInput, { target: { value: 'wrongpass' } });
        fireEvent.click(loginButton);

        await waitFor(() => {
            expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
        });
    });

    test('allows clearing error messages', async () => {
        const { authService } = require('../../services/authService');
        authService.login.mockRejectedValue({
            response: {
                data: {
                    message: 'Invalid credentials'
                }
            }
        });

        render(<MockedLogin />);

        const usernameInput = screen.getByLabelText(/username/i);
        const passwordInput = screen.getByLabelText(/password/i);
        const loginButton = screen.getByRole('button', { name: /login/i });

        // Trigger error
        fireEvent.change(usernameInput, { target: { value: 'wronguser' } });
        fireEvent.change(passwordInput, { target: { value: 'wrongpass' } });
        fireEvent.click(loginButton);

        await waitFor(() => {
            expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
        });

        // Clear error
        const clearButton = screen.getByText('×');
        fireEvent.click(clearButton);

        await waitFor(() => {
            expect(screen.queryByText(/invalid credentials/i)).not.toBeInTheDocument();
        });
    });
}); 