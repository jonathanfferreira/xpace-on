'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Play, X } from 'lucide-react';
import { VideoPlayer } from '@/components/player/video-player';

export function CourseTrailer({ 
    thumbnailUrl, 
    videoId, 
    tokenizedUrl,
    title
}: { 
    thumbnailUrl?: string; 
    videoId?: string; 
    tokenizedUrl?: string;
    title: string;
}) {
    const [isPlaying, setIsPlaying] = useState(false);

    if (isPlaying && videoId && tokenizedUrl) {
        return (
            <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl bg-black border border-white/10 lg:mt-0 mt-8 group animate-in fade-in zoom-in duration-500">
                <button 
                    onClick={() => setIsPlaying(false)}
                    className="absolute top-4 right-4 z-50 p-2 bg-black/60 hover:bg-black border border-white/20 rounded-full text-white backdrop-blur-md transition-all opacity-0 group-hover:opacity-100"
                    title="Fechar trailer"
                >
                    <X size={16} />
                </button>
                <VideoPlayer
                    videoId={videoId}
                    tokenizedUrl={tokenizedUrl}
                    userEmail="guest@xtage.app"
                    lessonId="trailer"
                    initialPosition={0}
                    thumbnailUrl={thumbnailUrl}
                />
            </div>
        );
    }

    return (
        <div 
            onClick={() => { if (videoId && tokenizedUrl) setIsPlaying(true); }}
            className={`relative aspect-video rounded-xl overflow-hidden border border-white/10 shadow-2xl group lg:mt-0 mt-8 ${videoId && tokenizedUrl ? 'cursor-pointer' : 'opacity-80'}`}
        >
            {thumbnailUrl ? (
                <Image src={thumbnailUrl} alt={title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
            ) : (
                <div className="w-full h-full bg-[#1a1a1a]" />
            )}
            
            {videoId && tokenizedUrl && (
                <>
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <div className="w-20 h-20 rounded-full bg-black/60 border border-white/20 backdrop-blur-md flex items-center justify-center group-hover:bg-primary/90 group-hover:border-primary transition-all duration-300 transform group-hover:scale-110">
                            <Play size={32} className="text-white ml-2" />
                        </div>
                    </div>
                    <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md px-3 py-1 rounded border border-white/10 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-white text-xs font-bold uppercase tracking-wider">Trailer</span>
                    </div>
                </>
            )}
        </div>
    );
}
