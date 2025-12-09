import React from 'react';

const RoundButton = ({
    onClick,
    icon,
    title = '',
    variant = 'gray', // gray, red
    active = true,
    className = '',
    ...props
}) => {
    const variants = {
        gray: active
            ? 'bg-gray-700 hover:bg-gray-600 text-white'
            : 'bg-red-600 hover:bg-red-500 text-white',
        red: 'bg-red-600 hover:bg-red-500 text-white'
    };

    return (
        <button
            onClick={onClick}
            className={`p-4 rounded-full transition-all cursor-pointer ${variants[variant]} ${className}`}
            title={title}
            {...props}
        >
            {icon}
        </button>
    );
};

export default RoundButton;
