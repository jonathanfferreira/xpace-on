'use client'

import { useState } from 'react'
import { MessageSquare, Send, Heart, MoreVertical } from 'lucide-react'

// Mock Data
const MOCK_COMMENTS = [
    {
        id: 1,
        user: { name: 'Lucas Moura', avatar: 'LM', isPro: true },
        content: 'Galera, uma dica: no minuto 04:12 o Ton fala sobre o isolamento do ombro. Tentem fazer olhando pro espelho focando só na clavícula, me ajudou muito!',
        likes: 12,
        timeAgo: '2 horas atrás',
        replies: [
            { id: 11, user: { name: 'Ton Novaes', avatar: 'TN', isTeacher: true }, content: 'Exatamente isso Lucas! A visão periférica no espelho é o segredo.', likes: 5, timeAgo: '1 hora atrás' }
        ]
    },
    {
        id: 2,
        user: { name: 'Ana Beatriz', avatar: 'AB' },
        content: 'Alguém mais tá com dificuldade de dissociar o peito do quadril nesse groove específico?',
        likes: 3,
        timeAgo: '5 horas atrás',
        replies: []
    }
]

export function CommunityBoard() {
    const [newComment, setNewComment] = useState('')

    return (
        <div className="w-full mt-8">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-sm bg-secondary/10 border border-secondary/30 flex items-center justify-center">
                    <MessageSquare size={20} className="text-secondary" />
                </div>
                <div>
                    <h2 className="font-heading text-xl uppercase tracking-widest text-white">Mural da Aula</h2>
                    <p className="text-[10px] font-sans text-[#666]">Discuta técnicas e tire dúvidas</p>
                </div>
            </div>

            {/* Input Form */}
            <div className="bg-[#0A0A0A] border border-[#222] rounded-sm p-4 mb-8 flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-heading text-primary border border-primary/30 shrink-0">
                    JF
                </div>
                <div className="flex-1 relative">
                    <textarea
                        value={newComment}
                        onChange={e => setNewComment(e.target.value)}
                        placeholder="Compartilhe uma dúvida, insight ou evolução..."
                        className="w-full bg-[#111] border border-[#222] focus:border-secondary/50 rounded-sm p-3 min-h-[80px] text-sm text-white font-sans outline-none transition-colors resize-none placeholder:text-[#555]"
                    />
                    <div className="absolute right-2 bottom-2">
                        <button className="bg-secondary text-black p-2 rounded-sm hover:bg-white transition-colors">
                            <Send size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Comments List */}
            <div className="space-y-6">
                {MOCK_COMMENTS.map(comment => (
                    <div key={comment.id} className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-[#222] flex items-center justify-center font-heading text-[#888] border border-[#333] shrink-0">
                            {comment.user.avatar}
                        </div>
                        <div className="flex-1">
                            {/* Comment Head */}
                            <div className="flex items-baseline gap-2 mb-1">
                                <span className={`font-heading text-sm uppercase ${comment.user.isPro ? 'text-primary' : 'text-white'}`}>
                                    {comment.user.name}
                                </span>
                                {comment.user.isPro && (
                                    <span className="text-[8px] bg-primary/20 text-primary px-1.5 py-0.5 rounded font-mono uppercase">PRO</span>
                                )}
                                <span className="text-[10px] text-[#555] font-sans ml-auto">{comment.timeAgo}</span>
                            </div>

                            {/* Comment Body */}
                            <p className="text-sm font-sans text-[#ccc] leading-relaxed mb-2">
                                {comment.content}
                            </p>

                            {/* Comment Actions */}
                            <div className="flex items-center gap-4 mb-4">
                                <button className="flex items-center gap-1.5 text-xs text-[#666] hover:text-secondary transition-colors group">
                                    <Heart size={14} className="group-hover:fill-secondary/20" /> {comment.likes}
                                </button>
                                <button className="text-xs text-[#666] hover:text-white transition-colors font-sans uppercase tracking-widest text-[10px]">
                                    Responder
                                </button>
                            </div>

                            {/* Replies */}
                            {comment.replies.length > 0 && (
                                <div className="pl-4 border-l-2 border-[#222] space-y-4">
                                    {comment.replies.map(reply => (
                                        <div key={reply.id} className="flex gap-3">
                                            <div className="w-8 h-8 rounded-full bg-[#111] flex items-center justify-center font-heading text-white border border-accent shrink-0 shadow-[0_0_10px_rgba(255,82,0,0.2)]">
                                                {reply.user.avatar}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-baseline gap-2 mb-0.5">
                                                    <span className="font-heading text-xs uppercase text-accent">
                                                        {reply.user.name}
                                                    </span>
                                                    <span className="text-[8px] bg-accent/20 text-accent px-1.5 py-0.5 rounded font-mono uppercase">MESTRE</span>
                                                    <span className="text-[10px] text-[#555] font-sans ml-auto">{reply.timeAgo}</span>
                                                </div>
                                                <p className="text-xs font-sans text-[#aaa] leading-relaxed mb-1">
                                                    {reply.content}
                                                </p>
                                                <button className="flex items-center gap-1.5 text-xs text-[#666] hover:text-secondary transition-colors group">
                                                    <Heart size={12} className="group-hover:fill-secondary/20" /> {reply.likes}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
