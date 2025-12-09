import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import CallEndedModal from './CallEndedModal';
import VideoFrame from './VideoFrame';
import { RoundButton } from '../ui';
import {
    MicrophoneOnSvg,
    MicrophoneOffSvg,
    VideoOnSvg,
    VideoOffSvg,
    PhoneEndSvg
} from '../icons';

const VideoCall = ({ targetUsername, targetUserId, isCaller, onEndCall }) => {
    const { user } = useAuth();
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const peerConnectionRef = useRef(null);
    const pendingSignalsRef = useRef([]);

    const [localStream, setLocalStream] = useState(null);
    const [isVideoEnabled, setIsVideoEnabled] = useState(true);
    const [isAudioEnabled, setIsAudioEnabled] = useState(false);
    const [error, setError] = useState(null);
    const [callStatus, setCallStatus] = useState('connecting');
    const [emojiReactions, setEmojiReactions] = useState([]);
    const [showEndedModal, setShowEndedModal] = useState(false);
    const [iceServers, setIceServers] = useState(null);

    useEffect(() => {
        fetchIceServers();

        const channel = window.Echo.private(`calls.${user.id}`);

        channel.listen('.webrtc-signal', handleWebRTCSignal);

        channel.listen('.emoji-reaction', (data) => {
            handleEmojiReaction(data);
        });

        channel.listen('.call-ended', () => {
            setShowEndedModal(true);
            cleanup();
        });

        if (isCaller) {
            channel.listen('.call-answered', async () => {
                setCallStatus('connecting');
                try {
                    await createAndSendOffer();
                } catch (error) {
                    console.error('[VideoCall] Error creating offer:', error);
                }
            });
        }

        return () => {
            channel.stopListening('.webrtc-signal');
            channel.stopListening('.emoji-reaction');
            channel.stopListening('.call-ended');
            if (isCaller) {
                channel.stopListening('.call-answered');
            }
            cleanup();
        };
    }, []);

    useEffect(() => {
        if (!iceServers) {
            return;
        }

        initializeCall();
    }, [iceServers]);

    const fetchIceServers = async () => {
        try {
            const response = await window.axios.get('/api/ice-servers');
            setIceServers(response.data);
        } catch (err) {
            console.error('Error fetching ICE servers:', err);
            setError('Failed to fetch ICE servers configuration.');
        }
    };

    const initializeCall = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                },
                audio: true
            });

            setLocalStream(stream);

            if (localVideoRef.current) {
                localVideoRef.current.srcObject = stream;
            }

            const audioTrack = stream.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = false;
            }

            createPeerConnection(stream);

            if (isCaller) {
                setCallStatus('ringing');
            } else {
                setCallStatus('connecting');
            }
        } catch (err) {
            setError('Failed to access camera and microphone. Please check permissions.');
        }
    };

    const processPendingIceCandidates = async (pc) => {
        if (pendingSignalsRef.current.length === 0) {
            return;
        }

        const pendingIceCandidates = [...pendingSignalsRef.current];
        pendingSignalsRef.current = [];

        for (const signal of pendingIceCandidates) {
            if (signal.type === 'ice-candidate') {
                let candidateData = signal.data;
                if (typeof candidateData === 'string') {
                    candidateData = JSON.parse(candidateData);
                }
                await pc.addIceCandidate(new RTCIceCandidate(candidateData));
            }
        }
    };

    const createPeerConnection = (stream) => {
        const pc = new RTCPeerConnection(iceServers);
        peerConnectionRef.current = pc;

        stream.getTracks().forEach(track => {
            pc.addTrack(track, stream);
        });

        pc.ontrack = (event) => {
            if (remoteVideoRef.current && event.streams[0]) {
                remoteVideoRef.current.srcObject = event.streams[0];
                setCallStatus('connected');
            }
        };

        pc.onicecandidate = (event) => {
            if (event.candidate) {
                sendSignal('ice-candidate', event.candidate);
            }
        };

        pc.onconnectionstatechange = () => {
            if (pc.connectionState === 'connected') {
                setCallStatus('connected');
                return;
            }

            if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
                setCallStatus('disconnected');
            }
        };

        if (pendingSignalsRef.current.length > 0) {
            const signals = [...pendingSignalsRef.current];
            pendingSignalsRef.current = [];
            signals.forEach(signal => handleWebRTCSignal(signal));
        }

        return pc;
    };

    const createAndSendOffer = async () => {
        try {
            const pc = peerConnectionRef.current;
            if (!pc) return;

            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);

            await sendSignal('offer', offer);
        } catch (err) {
            console.error('Error creating offer:', err);
        }
    };

    const handleWebRTCSignal = async (data) => {
        const pc = peerConnectionRef.current;

        if (!pc) {
            pendingSignalsRef.current.push(data);
            return;
        }

        let signalData = data.data;
        if (typeof signalData === 'string') {
            signalData = JSON.parse(signalData);
        }

        if (data.type === 'offer') {
            await pc.setRemoteDescription(new RTCSessionDescription(signalData));
            await processPendingIceCandidates(pc);

            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            await sendSignal('answer', answer);
        } else if (data.type === 'answer') {
            await pc.setRemoteDescription(new RTCSessionDescription(signalData));
            await processPendingIceCandidates(pc);
        } else if (data.type === 'ice-candidate') {
            if (!pc.remoteDescription) {
                pendingSignalsRef.current.push(data);
                return;
            }

            await pc.addIceCandidate(new RTCIceCandidate(signalData));
        }
    };

    const sendSignal = async (type, data) => {
        try {
            const serializedData = JSON.stringify(data);

            await window.axios.post('/api/call/webrtc/signal', {
                type,
                data: serializedData,
            });
        } catch (err) {
            console.error('Error sending signal:', err);
        }
    };

    const cleanup = () => {
        if (localStream) {
            localStream.getTracks().forEach(track => track.stop());
        }

        if (peerConnectionRef.current) {
            peerConnectionRef.current.close();
        }
    };

    const toggleVideo = () => {
        if (!localStream) {
            return;
        }

        const videoTrack = localStream.getVideoTracks()[0];
        if (videoTrack) {
            videoTrack.enabled = !videoTrack.enabled;
            setIsVideoEnabled(videoTrack.enabled);
        }
    };

    const toggleAudio = () => {
        if (!localStream) {
            return;
        }

        const audioTrack = localStream.getAudioTracks()[0];
        if (audioTrack) {
            audioTrack.enabled = !audioTrack.enabled;
            setIsAudioEnabled(audioTrack.enabled);
        }
    };

    const handleEndCall = async () => {
        try {
            await window.axios.post('/api/call/end');
        } catch (error) {
            console.error('Error sending call end notification:', error);
        }

        setShowEndedModal(true);
        cleanup();
    };

    const handleGoHome = () => {
        cleanup();
        onEndCall();
    };

    const handleEmojiReaction = (data) => {
        const { emoji, affectedUserId } = data;

        const newEmojis = Array.from({ length: 10 }, (_, index) => ({
            id: Date.now() + index,
            emoji: emoji,
            left: Math.random() * 80 + 10, // Random position from 10% to 90%
            duration: 2 + Math.random() * 1, // Duration between 2-3 seconds
            delay: Math.random() * 0.5, // Random delay up to 0.5s
            rotation: Math.random() * 720 - 360, // Random rotation between -360 and 360 degrees
            affectedUserId: affectedUserId,
        }));

        setEmojiReactions(prev => [...prev, ...newEmojis]);

        // Remove after max duration + buffer
        setTimeout(() => {
            setEmojiReactions(prev =>
                prev.filter(e => !newEmojis.find(ne => ne.id === e.id))
            );
        }, 3500);
    };

    return (
        <div className="w-full">
            {showEndedModal && (
                <CallEndedModal
                    username={targetUsername}
                    onGoHome={handleGoHome}
                />
            )}

            {error && (
                <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
                    <div className="text-sm text-red-600">{error}</div>
                </div>
            )}

            {/* Video areas */}
            <div className="flex gap-4 mb-6">
                {/* Remote participant video */}
                <VideoFrame
                    videoRef={remoteVideoRef}
                    username={targetUsername}
                    isLocal={false}
                    isVideoEnabled={true}
                    callStatus={callStatus}
                    emojiReactions={emojiReactions.filter(e => e.affectedUserId == targetUserId)}
                    targetUsername={targetUsername}
                />

                {/* Local user video */}
                <VideoFrame
                    videoRef={localVideoRef}
                    username="You"
                    isLocal={true}
                    isVideoEnabled={isVideoEnabled}
                    callStatus={callStatus}
                    emojiReactions={emojiReactions.filter(e => e.affectedUserId == user.id)}
                />
            </div>

            {/* Controls */}
            <div className="flex justify-center items-center gap-4">
                <RoundButton
                    onClick={toggleAudio}
                    variant="gray"
                    active={isAudioEnabled}
                    title={isAudioEnabled ? 'Mute' : 'Unmute'}
                    icon={isAudioEnabled ? <MicrophoneOnSvg /> : <MicrophoneOffSvg />}
                />

                <RoundButton
                    onClick={toggleVideo}
                    variant="gray"
                    active={isVideoEnabled}
                    title={isVideoEnabled ? 'Turn off camera' : 'Turn on camera'}
                    icon={isVideoEnabled ? <VideoOnSvg /> : <VideoOffSvg />}
                />

                <RoundButton
                    onClick={handleEndCall}
                    variant="red"
                    title="End call"
                    icon={<PhoneEndSvg />}
                />
            </div>

            {/* CSS for emoji animations */}
            <style jsx>{`
                @keyframes fall {
                    0% {
                        top: -50px;
                        opacity: 1;
                    }
                    100% {
                        top: 100%;
                        opacity: 0;
                    }
                }
            `}</style>
        </div>
    );
};

export default VideoCall;
