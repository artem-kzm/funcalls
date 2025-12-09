import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Logo, DangerButton } from '../components/ui';
import { VideoCall, CallInitiate, IncomingCallModal } from '../components/call';

const Home = () => {
    const { user, logout } = useAuth();
    const [isInCall, setIsInCall] = useState(false);
    const [targetNickname, setTargetNickname] = useState('');
    const [targetUserId, setTargetUserId] = useState(null);
    const [incomingCall, setIncomingCall] = useState(null);
    const [isCaller, setIsCaller] = useState(false);

    useEffect(() => {
        if (!user?.id) {
            return;
        }

        const channel = window.Echo.private(`calls.${user.id}`);

        channel.listen('.incoming-call', (data) => {
            if (isInCall) {
                return;
            }

            setIncomingCall({
                callerNickname: data.callerNickname,
                callerId: data.callerId
            });
        });

        channel.error((error) => {
            console.error('[Home] Error subscribing to private channel:', error);
        });

        return () => {
            window.Echo.leave(`private-calls.${user.id}`);
        };
    }, [isInCall, user]);

    const handleLogout = () => {
        logout();
    };

    const handleStartCall = (nickname, userId) => {
        setTargetNickname(nickname);
        setTargetUserId(userId);
        setIsCaller(true);
        setIsInCall(true);
    };

    const handleEndCall = () => {
        setIsInCall(false);
        setTargetNickname('');
        setTargetUserId(null);
        setIsCaller(false);
    };

    const handleAcceptCall = async () => {
        if (incomingCall) {
            try {
                setTargetNickname(incomingCall.callerNickname);
                setTargetUserId(incomingCall.callerId);
                setIsCaller(false);
                setIncomingCall(null);
                setIsInCall(true);

                setTimeout(async () => {
                    await window.axios.post('/api/call/answer');
                }, 100);
            } catch (error) {
                console.error('[Home] Error accepting call:', error);
                setIsInCall(false);
                setIncomingCall({
                    callerNickname: incomingCall.callerNickname,
                    callerId: incomingCall.callerId
                });
            }
        }
    };

    const handleDeclineCall = async () => {
        if (incomingCall) {
            try {
                await window.axios.post('/api/call/end');
            } catch (error) {
                console.error('[Home] Error declining call:', error);
            }
        }
        setIncomingCall(null);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {incomingCall && (
                <IncomingCallModal
                    callerNickname={incomingCall.callerNickname}
                    onAccept={handleAcceptCall}
                    onDecline={handleDeclineCall}
                />
            )}

            <nav className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <Logo />
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-gray-700">
                                Hi, <strong>{user?.nickname}</strong>!
                            </span>
                            <DangerButton onClick={handleLogout} title="Logout" />
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="bg-white rounded-lg shadow p-6">
                        {!isInCall ? (
                            <>
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                                    Make a call and have fun! 🎉
                                </h2>
                                <CallInitiate onStartCall={handleStartCall} />
                            </>
                        ) : (
                            <VideoCall
                                targetUsername={targetNickname}
                                targetUserId={targetUserId}
                                isCaller={isCaller}
                                onEndCall={handleEndCall}
                            />
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Home;
