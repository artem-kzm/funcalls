import React from 'react';
import { LoadingSvg } from '../icons';

const DangerButton = ({
    title,
    loading = false,
    disabled = false,
    type = 'button',
    className = '',
    ...props
}) => {
    return (
        <button
            type={type}
            disabled={disabled || loading}
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed ${className}`}
            {...props}
        >
            {loading ? (
                <>
                    <LoadingSvg className="-ml-1 mr-3 h-5 w-5 text-white" />
                    {title}...
                </>
            ) : (
                title
            )}
        </button>
    );
};

export default DangerButton;
