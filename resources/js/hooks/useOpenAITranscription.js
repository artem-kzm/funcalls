import { useEffect, useRef } from 'react';

export function useOpenAITranscription({
    mediaStream,
    ephemeralToken,
    onTranscriptionChanged,
}) {
    const pcRef = useRef(null);
    const dataChannelRef = useRef(null);
    const audioStreamRef = useRef(null);
    const isStartingRef = useRef(false);

    useEffect(() => {
        return () => {
            stopTranscription();
        };
    }, []);

    useEffect(() => {
        if (!mediaStream) {
            return;
        }

        const audioTracks = mediaStream.getAudioTracks();
        audioStreamRef.current = new MediaStream(audioTracks);
    }, [mediaStream]);

    const startTranscription = async () => {
        if (
            pcRef.current ||
            !ephemeralToken ||
            !audioStreamRef.current ||
            isStartingRef.current
        ) {
            return;
        }

        isStartingRef.current = true;

        try {
            await setupPeerConnection();
        } catch (error) {
            console.error('[Transcription] Failed to start:', error);
            stopTranscription();
        } finally {
            isStartingRef.current = false;
        }
    };

    const stopTranscription = () => {
        if (dataChannelRef.current) {
            dataChannelRef.current.close();
            dataChannelRef.current = null;
        }

        if (pcRef.current) {
            pcRef.current.close();
            pcRef.current = null;
        }

        isStartingRef.current = false;
    };

    const setupPeerConnection = async () => {
        pcRef.current = new RTCPeerConnection();

        audioStreamRef.current.getTracks().forEach((track) => {
            pcRef.current.addTrack(track, audioStreamRef.current);
        });

        createDataChannel();

        const offer = await pcRef.current.createOffer();
        await pcRef.current.setLocalDescription(offer);

        // Send SDP to OpenAI Realtime API
        const realtimeEndpoint = 'https://api.openai.com/v1/realtime';

        const response = await fetch(`${realtimeEndpoint}`, {
            method: 'POST',
            body: offer.sdp,
            headers: {
                'Authorization': `Bearer ${ephemeralToken}`,
                'Content-Type': 'application/sdp',
            },
        });

        if (!response.ok) {
            throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
        }

        const answerSdp = await response.text();
        const answer = {
            type: 'answer',
            sdp: answerSdp,
        };

        await pcRef.current.setRemoteDescription(answer);
    };

    const createDataChannel = () => {
        if (!pcRef.current) {
            return;
        }

        dataChannelRef.current = pcRef.current.createDataChannel('oai-events');

        dataChannelRef.current.addEventListener('message', (event) => {
            try {
                const parsed = JSON.parse(event.data);
                handleTranscriptionEvent(parsed);
            } catch (error) {
                console.error('[Transcription] Error parsing message:', error);
            }
        });
    };

    const handleTranscriptionEvent = (event) => {
        switch (event.type) {
            case 'input_audio_buffer.speech_stopped':
                onTranscriptionChanged('');
                break;

            case 'conversation.item.input_audio_transcription.completed':
                onTranscriptionChanged(event.transcript);
                break;

            default:
                break;
        }
    };

    return {
        startTranscription,
        stopTranscription,
    };
}

