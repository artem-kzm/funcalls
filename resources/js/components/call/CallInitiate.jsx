import React, { useState } from 'react';
import { PhoneIcon, GradientButton } from '../ui';
import { PhoneSvg } from '../icons';

const CallInitiate = ({ onStartCall }) => {
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!username.trim()) {
            setError('Please enter a nickname');
            return;
        }

        if (username.length < 3) {
            setError('Nickname must be at least 3 characters');
            return;
        }

        setIsLoading(true);

        try {
            const response = await window.axios.post('/api/call/initiate', {
                target_nickname: username.trim()
            });

            if (response.data.success) {
                onStartCall(username.trim(), response.data.target_user.id);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to initiate call');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[500px]">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
                <div className="text-center mb-8">
                    <PhoneIcon className="mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Start a Call
                    </h2>
                    <p className="text-gray-600">
                        Enter the Nickname of the user you want to call.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <input
                            id="nickname"
                            name="nickname"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                            placeholder="Nickname"
                            autoFocus
                            disabled={isLoading}
                        />
                        {error && (
                            <div className="mt-2 text-sm text-red-600">{error}</div>
                        )}
                    </div>

                    <GradientButton
                        type="submit"
                        loading={isLoading}
                        icon={<PhoneSvg />}
                        title={isLoading ? 'Connecting' : 'Call'}
                    />
                </form>
            </div>
        </div>
    );
};

export default CallInitiate;
