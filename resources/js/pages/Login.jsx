import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Logo, StyledLink, PrimaryButton } from '../components/ui';

const Login = () => {
    const [formData, setFormData] = useState({
        nickname: '',
        password: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const { login, error } = useAuth();
    const navigate = useNavigate();

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors({});

        const result = await login(formData.nickname, formData.password);

        if (result.success) {
            navigate('/home');
        } else {
            if (result.error && typeof result.error === 'object') {
                setErrors(result.error);
            }
        }

        setIsLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <div className="flex justify-center mb-16">
                        <Logo className="scale-[3]" />
                    </div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Login to your account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Or {' '}
                        <StyledLink to="/register">
                            register a new account
                        </StyledLink>
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-md p-4">
                            <div className="text-sm text-red-600">{error}</div>
                        </div>
                    )}

                    <div className="rounded-md space-y-4">
                        <div>
                            <label htmlFor="nickname" className="block text-sm font-medium text-gray-700">
                                Your Nickname
                            </label>
                            <input
                                id="nickname"
                                name="nickname"
                                type="text"
                                required
                                value={formData.nickname}
                                onChange={handleFormChange}
                                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="Nickname"
                            />
                            {errors.nickname && (
                                <div className="mt-1 text-sm text-red-600">{errors.nickname}</div>
                            )}
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                value={formData.password}
                                onChange={handleFormChange}
                                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="Password"
                            />
                            {errors.password && (
                                <div className="mt-1 text-sm text-red-600">{errors.password}</div>
                            )}
                        </div>
                    </div>

                    <div>
                        <PrimaryButton
                            type="submit"
                            loading={isLoading}
                            title={isLoading ? 'Logging in' : 'Login'}
                        />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
