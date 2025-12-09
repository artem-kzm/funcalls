import React from 'react';
import { PhoneSvg } from '../icons';

const PhoneIcon = ({ className = '' }) => {
    return (
        <div className={`w-20 h-20 mx-auto bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center ${className}`}>
            <PhoneSvg className="w-10 h-10 text-white" />
        </div>
    );
};

export default PhoneIcon;
