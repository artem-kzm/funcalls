import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                await axios.get('/sanctum/csrf-cookie');

                const response = await axios.get('/api/user');
                setUser(response.data.data);
            } catch (error) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        initializeAuth();
    }, []);

    const login = async (nickname, password) => {
        try {
            setError('');

            const response = await axios.post('/api/login', {
                nickname,
                password
            });

            setUser(response.data.user);

            return { success: true };
        } catch (error) {
            const errorMessage = error.response?.data?.errors?.nickname?.[0]
                || error.response?.data?.message
                || 'Login error';
            setError(errorMessage);
            return {
                success: false,
                error: error.response?.data?.errors || errorMessage
            };
        }
    };

    const register = async (nickname, password) => {
        try {
            setError('');

            const response = await axios.post('/api/register', {
                nickname,
                password
            });

            setUser(response.data.user);

            return { success: true };
        } catch (error) {
            const errorMessage = error.response?.data?.errors?.nickname?.[0]
                || error.response?.data?.message
                || 'Registration error';
            setError(errorMessage);
            return {
                success: false,
                error: error.response?.data?.errors || errorMessage
            };
        }
    };

    const logout = async () => {
        try {
            await axios.post('/api/logout');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setUser(null);
        }
    };

    const value = {
        user,
        loading,
        error,
        login,
        register,
        logout,
        isAuthenticated: !!user,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

