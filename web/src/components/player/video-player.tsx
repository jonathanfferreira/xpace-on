"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize, Settings, FlipHorizontal, FastForward, SkipBack, SkipForward, FlipHorizontal2, Camera } from "lucide-react";

export function VideoPlayer() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isMirrored, setIsMirrored] = useState(false);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [progress, setProgress] = useState(0);
    const videoRef = useRef<HTMLVideoElement>(null);

    // Exemplo de vídeo royalty free do BunnyNet ou S3 de placeholder
    const videoUrl = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"; // Placeholder

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    const toggleMirror = () => {
        setIsMirrored((prev) => !prev);
    };

    const changeSpeed = () => {
        const rates = [0.5, 0.75, 1, 1.25, 1.5];
        const currentIndex = rates.indexOf(playbackRate);
        const nextRate = rates[(currentIndex + 1) % rates.length];

        if (videoRef.current) {
            videoRef.current.playbackRate = nextRate;
            setPlaybackRate(nextRate);
        }
    };

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            const current = videoRef.current.currentTime;
            const duration = videoRef.current.duration;
            setProgress((current / duration) * 100);
        }
    };

    const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (videoRef.current) {
            const rect = e.currentTarget.getBoundingClientRect();
            const pos = (e.clientX - rect.left) / rect.width;
            videoRef.current.currentTime = pos * videoRef.current.duration;
        }
    };

    return (
        <div className="relative w-full aspect-video bg-black flex flex-col group overflow-hidden border border-[#222]">

            {/* Container de Vídeo com suporte a Mirror (Espelhamento para Dança) */}
            <div className="relative flex-1 bg-[#050505] flex items-center justify-center overflow-hidden">
                <video
                    ref={videoRef}
                    src={videoUrl}
                    className="w-full h-full object-cover transition-transform duration-300"
                    style={{ transform: isMirrored ? 'scaleX(-1)' : 'scaleX(1)' }}
                    onTimeUpdate={handleTimeUpdate}
                    onEnded={() => setIsPlaying(false)}
                    onClick={togglePlay}
                />

                {/* Play Overlay central grande (Fade out no Play) */}
                {!isPlaying && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center pointer-events-none">
                        <div className="w-20 h-20 rounded-full bg-primary/80 backdrop-blur-md flex items-center justify-center border border-white/20 pl-1.5 shadow-[0_0_30px_#6324b2]">
                            <Play size={40} className="text-white" fill="currentColor" />
                        </div>
                    </div>
                )}
            </div>

            {/* Control Bar (HUD Estilo Cyberpunk) */}
            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/90 via-black/60 to-transparent pt-12 pb-4 px-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out">

                {/* Progress Bar Tática */}
                <div
                    className="w-full h-1.5 bg-[#333] mb-4 cursor-pointer relative group/bar"
                    onClick={handleProgressBarClick}
                >
                    <div
                        className="absolute top-0 left-0 h-full bg-primary glow-primary"
                        style={{ width: `${progress}%` }}
                    ></div>
                    {/* Knob */}
                    <div
                        className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white border border-primary opacity-0 group-hover/bar:opacity-100 shadow-[0_0_10px_#6324b2] transition-opacity"
                        style={{ left: `calc(${progress}% - 6px)` }}
                    ></div>
                </div>

                {/* Controles */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={togglePlay} className="text-white hover:text-primary transition-colors">
                            {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
                        </button>
                        <button onClick={toggleMute} className="text-white hover:text-primary transition-colors">
                            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                        </button>

                        <div className="text-xs font-mono text-[#888] tracking-widest pl-2 border-l border-[#333]">
                            02:14 / 15:20
                        </div>
                    </div>

                    <div className="flex items-center gap-4">

                        {/* Features Especiais de Dança (XPACE Core) */}
                        <div className="flex items-center gap-2 bg-[#1a1a1a] p-1 border border-[#333] rounded-sm">
                            <button
                                onClick={toggleMirror}
                                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-sans font-semibold uppercase tracking-wider transition-colors border border-transparent ${isMirrored ? 'bg-primary/20 text-primary border-primary/50' : 'text-[#888] hover:text-white'}`}
                                title="Espelhar Professor"
                            >
                                <FlipHorizontal2 size={16} /> Espelhar
                            </button>

                            <div className="w-[1px] h-4 bg-[#333]"></div>

                            <button
                                onClick={changeSpeed}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-semibold transition-colors text-[#888] hover:text-white w-[64px] justify-center"
                                title="Velocidade"
                            >
                                {playbackRate}x
                            </button>

                            <div className="w-[1px] h-4 bg-[#333]"></div>

                            <button
                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-sans font-semibold uppercase tracking-wider transition-colors text-[#888] hover:text-white line-through opacity-50 cursor-not-allowed"
                                title="Trocar Câmera (Front/Back) - Em Breve"
                            >
                                <Camera size={16} /> Cam
                            </button>
                        </div>

                        <button className="text-white hover:text-primary transition-colors ml-2">
                            <Settings size={20} />
                        </button>
                        <button className="text-white hover:text-primary transition-colors">
                            <Maximize size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
