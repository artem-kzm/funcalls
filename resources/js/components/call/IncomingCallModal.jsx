import React from 'react';
import { GradientButton, PhoneIcon } from '../ui';
import { CheckSvg, CloseSvg } from '../icons';

const IncomingCallModal = ({ callerNickname, onAccept, onDecline }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-amber-600">
            <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
                <div className="text-center">
                    <PhoneIcon className="mb-6" />

                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Incoming Call
                    </h2>

                    <p className="text-lg text-gray-600 mb-8">
                        <strong className="text-gray-900">{callerNickname}</strong> is calling you...
                    </p>

                    <div className="flex gap-4 justify-center">
                        <GradientButton
                            onClick={onDecline}
                            gradientType="red"
                            icon={<CloseSvg />}
                            title="Decline"
                            className="transform hover:scale-105"
                        />

                        <GradientButton
                            onClick={onAccept}
                            gradientType="green"
                            icon={<CheckSvg />}
                            title="Accept"
                            className="transform hover:scale-105"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IncomingCallModal;
