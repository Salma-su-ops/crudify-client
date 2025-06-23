import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Register from '../Register';
import { AuthProvider } from '../../context/AuthContext';

jest.mock('../../services/authService');

const MockedRegister = () => (
    <BrowserRouter>
        <AuthProvider>
            <Register />
        </AuthProvider>
    </BrowserRouter>
);

describe('Register Component', () => {
    test('renders registration form correctly', () => {
        render(<MockedRegister />);

        expect(screen.getByRole('heading', { name: /register/i })).toBeInTheDocument();
        expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText('Password *')).toBeInTheDocument();
        expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
    });

    test('displays validation errors for empty fields', async () => {
        render(<MockedRegister />);

        const registerButton = screen.getByRole('button', { name: /register/i });
        fireEvent.click(registerButton);

        await waitFor(() => {
            expect(screen.getByText(/username is required/i)).toBeInTheDocument();
            expect(screen.getByText(/email is required/i)).toBeInTheDocument();
        });
    });

    test('validates username length', async () => {
        render(<MockedRegister />);

        const usernameInput = screen.getByLabelText(/username/i);
        const registerButton = screen.getByRole('button', { name: /register/i });

        fireEvent.change(usernameInput, { target: { value: 'ab' } });
        fireEvent.click(registerButton);

        await waitFor(() => {
            expect(screen.getByText(/username must be at least 3 characters/i)).toBeInTheDocument();
        });
    });

    test('validates email format', async () => {
        render(<MockedRegister />);

        const emailInput = screen.getByLabelText(/email/i);
        const registerButton = screen.getByRole('button', { name: /register/i });

        fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
        fireEvent.click(registerButton);

        await waitFor(() => {
            expect(screen.getByText(/email is invalid/i)).toBeInTheDocument();
        });
    });

    test('validates password length', async () => {
        render(<MockedRegister />);

        const passwordInput = screen.getByLabelText('Password *');
        const registerButton = screen.getByRole('button', { name: /register/i });

        fireEvent.change(passwordInput, { target: { value: '12345' } });
        fireEvent.click(registerButton);

        await waitFor(() => {
            expect(screen.getByText(/password must be at least 6 characters/i)).toBeInTheDocument();
        });
    });

    test('validates password confirmation match', async () => {
        render(<MockedRegister />);

        const passwordInput = screen.getByLabelText('Password *');
        const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
        const registerButton = screen.getByRole('button', { name: /register/i });

        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.change(confirmPasswordInput, { target: { value: 'different123' } });
        fireEvent.click(registerButton);

        await waitFor(() => {
            expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
        });
    });

    test('updates input values when typing', () => {
        render(<MockedRegister />);

        const usernameInput = screen.getByLabelText(/username/i);
        const emailInput = screen.getByLabelText(/email/i);
        const passwordInput = screen.getByLabelText('Password *');
        const confirmPasswordInput = screen.getByLabelText(/confirm password/i);

        fireEvent.change(usernameInput, { target: { value: 'testuser' } });
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });

        expect(usernameInput.value).toBe('testuser');
        expect(emailInput.value).toBe('test@example.com');
        expect(passwordInput.value).toBe('password123');
        expect(confirmPasswordInput.value).toBe('password123');
    });

    test('clears validation errors when user starts typing', async () => {
        render(<MockedRegister />);

        const registerButton = screen.getByRole('button', { name: /register/i });
        fireEvent.click(registerButton);

        await waitFor(() => {
            expect(screen.getByText(/username is required/i)).toBeInTheDocument();
        });

        const usernameInput = screen.getByLabelText(/username/i);
        fireEvent.change(usernameInput, { target: { value: 'test' } });

        await waitFor(() => {
            expect(screen.queryByText(/username is required/i)).not.toBeInTheDocument();
        });
    });

    test('submits form with valid data', async () => {
        render(<MockedRegister />);

        const usernameInput = screen.getByLabelText(/username/i);
        const emailInput = screen.getByLabelText(/email/i);
        const passwordInput = screen.getByLabelText('Password *');
        const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
        const registerButton = screen.getByRole('button', { name: /register/i });

        fireEvent.change(usernameInput, { target: { value: 'testuser' } });
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });

        fireEvent.click(registerButton);

        // Should not have validation errors
        await waitFor(() => {
            expect(screen.queryByText(/username is required/i)).not.toBeInTheDocument();
            expect(screen.queryByText(/email is required/i)).not.toBeInTheDocument();
            expect(screen.queryByText(/password is required/i)).not.toBeInTheDocument();
        });
    });
}); 