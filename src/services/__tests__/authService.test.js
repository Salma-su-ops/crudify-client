import axios from 'axios';
import { authService } from '../authService';

jest.mock('axios');
const mockedAxios = axios;

describe('AuthService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('login', () => {
        test('calls correct endpoint with credentials', async () => {
            const credentials = { username: 'testuser', password: 'password123' };
            const mockResponse = {
                data: {
                    token: 'fake-jwt-token',
                    username: 'testuser',
                    email: 'test@example.com'
                }
            };

            mockedAxios.post.mockResolvedValue(mockResponse);

            const result = await authService.login(credentials);

            expect(mockedAxios.post).toHaveBeenCalledWith(
                'http://localhost:8080/api/auth/login',
                credentials
            );
            expect(result).toEqual(mockResponse);
        });

        test('handles login failure', async () => {
            const credentials = { username: 'wronguser', password: 'wrongpass' };
            const mockError = {
                response: {
                    status: 400,
                    data: {
                        message: 'Invalid credentials'
                    }
                }
            };

            mockedAxios.post.mockRejectedValue(mockError);

            await expect(authService.login(credentials)).rejects.toEqual(mockError);

            expect(mockedAxios.post).toHaveBeenCalledWith(
                'http://localhost:8080/api/auth/login',
                credentials
            );
        });
    });

    describe('register', () => {
        test('calls correct endpoint with user data', async () => {
            const userData = {
                username: 'newuser',
                email: 'new@example.com',
                password: 'password123'
            };
            const mockResponse = {
                data: {
                    token: 'fake-jwt-token',
                    username: 'newuser',
                    email: 'new@example.com'
                }
            };

            mockedAxios.post.mockResolvedValue(mockResponse);

            const result = await authService.register(userData);

            expect(mockedAxios.post).toHaveBeenCalledWith(
                'http://localhost:8080/api/auth/register',
                userData
            );
            expect(result).toEqual(mockResponse);
        });

        test('handles registration failure with duplicate username', async () => {
            const userData = {
                username: 'existinguser',
                email: 'new@example.com',
                password: 'password123'
            };
            const mockError = {
                response: {
                    status: 400,
                    data: {
                        message: 'Username is already taken!'
                    }
                }
            };

            mockedAxios.post.mockRejectedValue(mockError);

            await expect(authService.register(userData)).rejects.toEqual(mockError);

            expect(mockedAxios.post).toHaveBeenCalledWith(
                'http://localhost:8080/api/auth/register',
                userData
            );
        });
    });
}); 