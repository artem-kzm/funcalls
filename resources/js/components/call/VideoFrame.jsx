import React from 'react';

const VideoFrame = ({
    videoRef,
    username,
    isLocal = false,
    isVideoEnabled = true,
    callStatus = 'connecting',
    emojiReactions = [],
    targetUsername = ''
}) => {
    const getStatusText = () => {
        switch (callStatus) {
            case 'connecting':
                return 'Connecting...';
            case 'ringing':
                return `Calling ${targetUsername}...`;
            case 'connected':
                return 'Connected';
            case 'disconnected':
                return 'Disconnected';
            default:
                return '';
        }
    };

    return (
        <div className="flex-1 relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted={isLocal}
                className={`w-full h-full object-cover ${!isVideoEnabled && isLocal ? 'invisible' : ''}`}
                style={isLocal ? { transform: 'scaleX(-1)' } : {}}
            />

            {/* Placeholder when not connected (only for remote) */}
            {!isLocal && callStatus !== 'connected' && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                    <div className="text-center text-white">
                        <div className="w-24 h-24 mx-auto mb-4 bg-gray-700 rounded-full flex items-center justify-center">
                            <svg className="w-12 h-12 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <p className="text-lg font-semibold">{username}</p>
                        <p className="text-sm text-gray-300 mt-2">{getStatusText()}</p>
                    </div>
                </div>
            )}

            {/* Placeholder when video disabled (only for local) */}
            {isLocal && !isVideoEnabled && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                </div>
            )}

            {/* Username label */}
            <div className="absolute top-2 left-2 bg-black bg-opacity-50 px-2 py-1 rounded text-white text-sm">
                {username}
            </div>

            {/* Emoji reactions overlay */}
            {emojiReactions.map(reaction => (
                <div
                    key={reaction.id}
                    className="absolute text-4xl pointer-events-none"
                    style={{
                        left: `${reaction.left}%`,
                        top: '-50px',
                        animation: `fall ${reaction.duration}s ease-in ${reaction.delay}s forwards`,
                        transform: `rotate(${reaction.rotation}deg)`,
                        transition: `transform ${reaction.duration}s linear ${reaction.delay}s`,
                    }}
                >
                    {reaction.emoji}
                </div>
            ))}
        </div>
    );
};

export default VideoFrame;
