import React from 'react';
import { PhoneIcon, GradientButton } from '../ui';

const CallEndedModal = ({ username, onGoHome }) => {
    return (
        <div className="fixed inset-0 bg-amber-600 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4 animate-fade-in">
                <div className="text-center">
                    <PhoneIcon className="mb-6" />

                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Call Ended
                    </h2>

                    <p className="text-gray-600 mb-6">
                        Your call with <strong className="text-gray-900">{username}</strong> has ended.
                    </p>

                    <GradientButton onClick={onGoHome} title="Go to Home" />
                </div>
            </div>

            <style jsx>{`
                @keyframes fade-in {
                    from {
                        opacity: 0;
                        transform: scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }

                .animate-fade-in {
                    animation: fade-in 0.3s ease-out;
                }
            `}</style>
        </div>
    );
};

export default CallEndedModal;
