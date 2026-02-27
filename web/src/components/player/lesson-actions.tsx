'use client'

import { useState } from 'react'
import { Heart, Share2, AlertTriangle } from 'lucide-react'

interface LessonActionsProps {
    initialLikes: number
}

export function LessonActions({ initialLikes }: LessonActionsProps) {
    const [likes, setLikes] = useState(initialLikes)
    const [isLiked, setIsLiked] = useState(false)

    const handleLike = () => {
        setIsLiked(!isLiked)
        setLikes(prev => isLiked ? prev - 1 : prev + 1)
        // TODO: Chamar API do Supabase no futuro para salvar o Like real no banco
    }

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: 'XTAGE',
                text: 'Olha essa aula surreal na XTAGE!',
                url: window.location.href,
            }).catch(console.error);
        } else {
            navigator.clipboard.writeText(window.location.href)
            alert('Link copiado para a área de transferência!')
        }
    }

    const handleReport = () => {
        alert('Reportagem enviada para moderação. Obrigado por manter a comunidade segura!')
    }

    return (
        <div className="flex items-center gap-3 md:gap-4 shrink-0 border-t md:border-t-0 border-[#222] pt-4 md:pt-0">
            <button
                onClick={handleLike}
                className={`flex flex-col items-center justify-center w-14 h-14 bg-[#111] border transition-colors group ${isLiked ? 'border-secondary/50 text-secondary' : 'border-[#222] hover:border-primary/50 text-[#888] hover:text-white'}`}
            >
                <Heart size={20} className={`mb-1 transition-colors ${isLiked ? 'fill-secondary text-secondary' : 'group-hover:fill-secondary group-hover:text-secondary'}`} />
                <span className="text-[10px] font-mono tracking-widest">{likes}</span>
            </button>
            <button
                onClick={handleShare}
                className="flex flex-col items-center justify-center w-14 h-14 bg-[#111] border border-[#222] hover:border-primary/50 text-[#888] hover:text-white transition-colors"
                title="Compartilhar Aula"
            >
                <Share2 size={20} className="mb-1" />
            </button>
            <button
                onClick={handleReport}
                className="flex flex-col items-center justify-center w-14 h-14 bg-[#111] border border-[#222] hover:border-[#ff3300]/50 text-[#888] hover:text-[#ff3300] transition-colors"
                title="Reportar Problema"
            >
                <AlertTriangle size={20} className="mb-1" />
            </button>
        </div>
    )
}
