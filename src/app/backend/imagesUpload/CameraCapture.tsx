'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';
import Image from 'next/image';

export default function CameraCapture() {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
    const [cameraOpen, setCameraOpen] = useState(false);
    const [stream, setStream] = useState<MediaStream | null>(null);

    const startCamera = useCallback(async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
                videoRef.current.play();
            }
            setStream(mediaStream);
            setCameraOpen(true);
        } catch (error) {
            console.error('Error accessing camera:', error);
            alert('Unable to access the camera.');
        }
    }, []);

    const stopCamera = useCallback(() => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
        setCameraOpen(false);
    }, [stream]);

    const captureImage = useCallback(() => {
        const video = videoRef.current;
        const canvas = canvasRef.current;

        if (video && canvas) {
            const context = canvas.getContext('2d');
            if (!context) return;

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            const dataUrl = canvas.toDataURL('image/png');
            setImageDataUrl(dataUrl);
        }
    }, []);

    useEffect(() => {
        return () => {
            stopCamera(); // stop stream if component unmounts
        };
    }, [stopCamera]);

    return (
        <div className="flex flex-col items-center p-6 space-y-6">
            {!cameraOpen ? (
                <button
                    onClick={startCamera}
                    className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700"
                >
                    Open Camera 📷
                </button>
            ) : (
                <>
                    <div className="relative w-full max-w-md aspect-video">
                        <video
                            ref={videoRef}
                            className="w-full h-full rounded-md border border-gray-400 shadow-md"
                            autoPlay
                            muted
                            playsInline
                        />
                    </div>
                    <button
                        onClick={captureImage}
                        className="bg-green-600 text-white px-5 py-2 rounded-md hover:bg-green-700"
                    >
                        Capture Image
                    </button>
                    <button
                        onClick={stopCamera}
                        className="bg-red-600 text-white px-5 py-2 rounded-md hover:bg-red-700"
                    >
                        Close Camera
                    </button>
                </>
            )}

            <canvas ref={canvasRef} className="hidden" />

            {imageDataUrl && (
                <div className="mt-4">
                    <p className="mb-2 text-center font-semibold">Captured Image:</p>
                    <Image
                        width="3000"
                        height='2000'
                        src={imageDataUrl}
                        alt="Captured"
                        className="rounded-md border border-gray-300 max-w-full h-auto"
                    />
                </div>
            )}
        </div>
    );
}
