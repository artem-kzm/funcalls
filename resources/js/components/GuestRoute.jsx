import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const GuestRoute = ({ children }) => {
    const { user } = useAuth();

    if (user) {
        return <Navigate to="/home" replace />;
    }

    return children;
};

export default GuestRoute;
