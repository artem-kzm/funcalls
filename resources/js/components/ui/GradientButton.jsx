import React from 'react';
import { LoadingSvg } from '../icons';

const GradientButton = ({
    title,
    loading = false,
    disabled = false,
    type = 'button',
    icon = null,
    gradientType = 'orange',
    className = '',
    ...props
}) => {
    const gradientStyles = {
        orange: 'bg-gradient-to-r from-orange-400 to-red-400 hover:from-orange-500 hover:to-red-500 focus:ring-orange-500',
        green: 'bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 focus:ring-green-500',
        red: 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 focus:ring-red-500',
    };

    return (
        <button
            type={type}
            disabled={disabled || loading}
            className={`w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white ${gradientStyles[gradientType]} focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed transition-all ${className}`}
            {...props}
        >
            {loading ? (
                <>
                    <LoadingSvg className="-ml-1 mr-3 h-5 w-5 text-white" />
                    {title}...
                </>
            ) : (
                <>
                    {icon && <span className="w-5 h-5 mr-2">{icon}</span>}
                    {title}
                </>
            )}
        </button>
    );
};

export default GradientButton;
