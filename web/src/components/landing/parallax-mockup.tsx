'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import { motion } from 'framer-motion';

export function ParallaxMockup() {
    const ref = useRef<HTMLDivElement>(null);
    const [rotate, setRotate] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        setRotate({ x: -y * 10, y: x * 10 });
    };

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => {
        setIsHovering(false);
        setRotate({ x: 0, y: 0 });
    };

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="relative w-full max-w-5xl mx-auto mb-20 group"
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{ perspective: '1000px' }}
        >
            {/* Gradient fade inferior */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-transparent to-transparent z-10 pointer-events-none" />
            
            {/* Glow no hover */}
            <div className={`absolute -inset-1 bg-gradient-to-r from-primary/20 to-secondary/20 blur-2xl transition-opacity duration-1000 ${isHovering ? 'opacity-100' : 'opacity-0'}`} />
            
            {/* Card 3D */}
            <motion.div
                animate={{
                    rotateX: rotate.x,
                    rotateY: rotate.y,
                }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                className="relative border border-white/5 rounded-2xl overflow-hidden shadow-2xl bg-[#0a0a0a]"
                style={{ transformStyle: 'preserve-3d' }}
            >
                <Image
                    src="/images/dashboard-preview.png"
                    alt="Interface do App XPACE"
                    width={1400}
                    height={800}
                    className="w-full h-auto object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-700"
                    priority
                />

                {/* XP Particles flutuando */}
                {isHovering && (
                    <div className="absolute inset-0 pointer-events-none z-20">
                        {[...Array(6)].map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20, x: `${15 + i * 14}%` }}
                                animate={{
                                    opacity: [0, 1, 0],
                                    y: [-20, -60, -100],
                                }}
                                transition={{
                                    duration: 2,
                                    delay: i * 0.3,
                                    repeat: Infinity,
                                    ease: 'easeOut',
                                }}
                                className="absolute bottom-20"
                                style={{ left: `${15 + i * 14}%` }}
                            >
                                <span className="text-xs font-mono font-bold text-secondary/80 drop-shadow-[0_0_8px_rgba(235,0,188,0.6)]">
                                    +{[10, 25, 50, 15, 30, 20][i]} XP
                                </span>
                            </motion.div>
                        ))}
                    </div>
                )}
            </motion.div>

            {/* Floating Badges */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-4">
                <div className="px-4 py-2 bg-[#111] border border-white/10 rounded-full backdrop-blur-md shadow-xl flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#888]">Live Feed</span>
                </div>
                <div className="px-4 py-2 bg-[#111] border border-white/10 rounded-full backdrop-blur-md shadow-xl flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#888]">XP System Ready</span>
                </div>
            </div>
        </motion.div>
    );
}
