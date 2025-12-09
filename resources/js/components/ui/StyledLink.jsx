import React from 'react';
import { Link } from 'react-router-dom';

const StyledLink = ({ to, children, className = '', ...props }) => {
    return (
        <Link
            to={to}
            className={`text-blue-600 hover:text-blue-500 font-medium ${className}`}
            {...props}
        >
            {children}
        </Link>
    );
};

export default StyledLink;
