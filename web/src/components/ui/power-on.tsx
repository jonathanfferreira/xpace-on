'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export function PowerOnPreloader({ children }: { children: React.ReactNode }) {
    const [hasStarted, setHasStarted] = useState(false);
    const [isPoweringUp, setIsPoweringUp] = useState(false);

    useEffect(() => {
        // Pula a animação se for a mesma sessão pra não irritar quem dá refresh
        if (sessionStorage.getItem('xpace-powered')) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setHasStarted(true);
        }
    }, []);

    const handlePowerOn = () => {
        setIsPoweringUp(true);
        sessionStorage.setItem('xpace-powered', 'true');
        // Simula a inicialização brutalista que escala e esvanece (1.2s)
        setTimeout(() => {
            setHasStarted(true);
        }, 1200);
    };

    if (hasStarted) return <>{children}</>;

    return (
        <>
            <div className="fixed inset-0 z-[99999] bg-black flex flex-col items-center justify-center overflow-hidden">
                {/* Glow/Luz atrás do sticker */}
                <div className={`absolute w-64 h-64 bg-primary/30 rounded-full blur-[80px] transition-all duration-1000 ${isPoweringUp ? 'opacity-0 scale-150' : 'opacity-100 animate-pulse-slow'}`}></div>

                {/* Sticker Button / Simbolo de ON */}
                <button
                    onClick={handlePowerOn}
                    className={`relative z-10 w-48 h-48 sm:w-64 sm:h-64 rounded-full flex items-center justify-center transition-all duration-[1200ms] outline-none ${isPoweringUp ? 'scale-[4] opacity-0 blur-xl' : 'scale-100 cursor-pointer hover:scale-105 active:scale-95'}`}
                >
                    {/* Sticker do XPACE */}
                    <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 animate-[stickerIn_0.6s_cubic-bezier(0.175,0.885,0.32,1.275)_2.4s_forwards]">
                        <Image
                            src="/images/xpace-on-sticker.png"
                            alt="Power On XPACE"
                            width={240}
                            height={240}
                            className="object-contain drop-shadow-[0_0_30px_rgba(99,36,178,0.5)] rotate-[-5deg]"
                            priority
                        />
                    </div>
                </button>

                {/* Hint Fading */}
                <div className={`mt-16 text-center transition-opacity duration-300 ${isPoweringUp ? 'opacity-0' : 'opacity-100'}`}>
                    <p className="text-white font-bold tracking-[0.3em] uppercase text-xs opacity-60 animate-pulse">Press to Start</p>
                </div>
            </div>
            {/* Renderiza as children escondidas apenas por segurança do SEO e Hydration */}
            <div style={{ display: 'none' }}>{children}</div>
        </>
    );
}
