import React from 'react';

const Logo = ({ className = '' }) => {
    const letters = [
        { char: 'f', color: 'text-red-500' },
        { char: 'U', color: 'text-orange-500' },
        { char: 'n', color: 'text-yellow-500' },
        { char: 'C', color: 'text-green-500' },
        { char: 'a', color: 'text-blue-500' },
        { char: 'L', color: 'text-indigo-500' },
        { char: 'L', color: 'text-purple-500' },
        { char: 's', color: 'text-pink-500' }
    ];

    return (
        <div className={`inline-flex items-center ${className}`}>
            {letters.map((letter, index) => (
                <span
                    key={index}
                    className={`font-bold text-2xl ${letter.color} transition-all hover:scale-110 hover:rotate-6 cursor-pointer`}
                    style={{ display: 'inline-block' }}
                >
                    {letter.char}
                </span>
            ))}
        </div>
    );
};

export default Logo;
