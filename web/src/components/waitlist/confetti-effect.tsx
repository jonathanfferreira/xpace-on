'use client';

import { useEffect } from 'react';
import confetti from 'canvas-confetti';

export function useWaitlistConfetti(trigger: boolean) {
    useEffect(() => {
        if (!trigger) return;

        const duration = 3000;
        const end = Date.now() + duration;

        const brandColors = ['#6324B2', '#EB00BC', '#FF5200', '#FFD700', '#FFFFFF'];

        const frame = () => {
            confetti({
                particleCount: 3,
                angle: 60,
                spread: 55,
                origin: { x: 0, y: 0.7 },
                colors: brandColors,
                zIndex: 9999,
            });
            confetti({
                particleCount: 3,
                angle: 120,
                spread: 55,
                origin: { x: 1, y: 0.7 },
                colors: brandColors,
                zIndex: 9999,
            });

            if (Date.now() < end) requestAnimationFrame(frame);
        };

        frame();

        // Star burst no centro
        setTimeout(() => {
            confetti({
                particleCount: 120,
                spread: 100,
                origin: { x: 0.5, y: 0.5 },
                colors: brandColors,
                zIndex: 9999,
                ticks: 200,
                gravity: 0.8,
                scalar: 1.2,
            });
        }, 300);
    }, [trigger]);
}
