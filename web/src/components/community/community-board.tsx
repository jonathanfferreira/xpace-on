'use client'

import { useState, useEffect } from 'react'
import { MessageSquare, Send, Heart } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

interface CommunityBoardProps {
    lessonId: string
}

export function CommunityBoard({ lessonId }: CommunityBoardProps) {
    const supabase = createClient()
    const [newComment, setNewComment] = useState('')
    const [comments, setComments] = useState<any[]>([])
    const [currentUserProfile, setCurrentUserProfile] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    // Formata a data num estilo "Há X horas"
    const timeAgo = (dateStr: string) => {
        const diff = Math.floor((new Date().getTime() - new Date(dateStr).getTime()) / 1000);
        if (diff < 60) return `Agora mesmo`;
        if (diff < 3600) return `${Math.floor(diff / 60)}m atrás`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h atrás`;
        return `${Math.floor(diff / 86400)}d atrás`;
    }

    const fetchComments = async () => {
        const { data, error } = await supabase
            .from('comments')
            .select(`
                id,
                content,
                likes,
                created_at,
                parent_id,
                users (
                    id,
                    full_name,
                    avatar_url
                )
            `)
            .eq('lesson_id', lessonId)
            .order('created_at', { ascending: false })

        if (data) {
            setComments(data)
        }
        if (error) {
            console.error("Erro ao buscar mural:", error)
        }
        setLoading(false)
    }

    useEffect(() => {
        // 1. Pega usuário atual para o Avatar do Input
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                const { data: profile } = await supabase.from('users').select('*').eq('id', user.id).single()
                setCurrentUserProfile(profile || { id: user.id })
            }
        }
        fetchUser()

        // 2. Busca inicial dos Comentários
        fetchComments()

        // 3. A MÁGICA: WebSocket Supabase Realtime (Subscription)
        const channel = supabase.channel(`public:comments:lesson_${lessonId}`)
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'comments', filter: `lesson_id=eq.${lessonId}` },
                (payload) => {
                    // Refetch the comments so we get the joined "users" data without complex local state merges
                    console.log('🔔 [Realtime] Novo comentário chegou ao vivo:', payload)
                    fetchComments()
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [lessonId, supabase])

    const handleSend = async () => {
        if (!newComment.trim()) return

        const userToSimulate = currentUserProfile || { id: (await supabase.auth.getUser()).data.user?.id }

        if (!userToSimulate.id) {
            alert("Sua sessão expirou, atualize a página.");
            return;
        }

        const contentToSend = newComment
        setNewComment('') // Optimistic clear

        const { error } = await supabase.from('comments').insert({
            lesson_id: lessonId,
            user_id: userToSimulate.id,
            content: contentToSend
        })

        if (error) {
            console.error("Erro ao postar erro:", error)
            setNewComment(contentToSend) // Revert
        }
    }

    // Organizando Parent vs Replies
    const parentComments = comments.filter(c => !c.parent_id)
    const getReplies = (parentId: string) => comments.filter(c => c.parent_id === parentId).reverse() // Older replies top

    return (
        <div className="w-full mt-8">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-sm bg-secondary/10 border border-secondary/30 flex items-center justify-center">
                    <MessageSquare size={20} className="text-secondary" />
                </div>
                <div>
                    <h2 className="font-heading text-xl uppercase tracking-widest text-white">Mural da Aula</h2>
                    <p className="text-[10px] font-sans text-[#666]">Discuta técnicas e tire dúvidas ao vivo</p>
                </div>
            </div>

            {/* Input Form */}
            <div className="bg-[#0A0A0A] border border-[#222] rounded-sm p-4 mb-8 flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-[#1A1A1A] flex items-center justify-center font-heading text-primary border border-primary/30 shrink-0 overflow-hidden">
                    {currentUserProfile?.avatar_url ? (
                        <img src={currentUserProfile.avatar_url} alt="Profile" className="w-full h-full object-cover grayscale" />
                    ) : (
                        currentUserProfile?.full_name?.substring(0, 2).toUpperCase() || "YOU"
                    )}
                </div>
                <div className="flex-1 relative">
                    <textarea
                        value={newComment}
                        onChange={e => setNewComment(e.target.value)}
                        placeholder="Compartilhe uma dúvida ou insight..."
                        className="w-full bg-[#111] border border-[#222] focus:border-secondary/50 rounded-sm p-3 min-h-[80px] text-sm text-white font-sans outline-none transition-colors resize-none placeholder:text-[#555]"
                    />
                    <div className="absolute right-2 bottom-2">
                        <button
                            onClick={handleSend}
                            disabled={!newComment.trim()}
                            className="bg-secondary text-black p-2 rounded-sm hover:bg-white transition-colors disabled:opacity-50 disabled:hover:bg-secondary"
                        >
                            <Send size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Comments List */}
            {loading ? (
                <div className="animate-pulse flex flex-col gap-4">
                    <div className="h-16 bg-[#111] rounded-sm w-full"></div>
                    <div className="h-16 bg-[#111] rounded-sm w-full"></div>
                </div>
            ) : parentComments.length === 0 ? (
                <p className="text-[#555] text-sm italic py-4">Nenhum comentário ainda. Seja o primeiro a puxar o assunto!</p>
            ) : (
                <div className="space-y-6">
                    {parentComments.map(comment => {
                        const replies = getReplies(comment.id)

                        return (
                            <div key={comment.id} className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-[#222] flex items-center justify-center font-heading text-[#888] border border-[#333] shrink-0 overflow-hidden">
                                    {comment.users?.avatar_url ? (
                                        <img src={comment.users.avatar_url} alt="User" className="w-full h-full object-cover grayscale" />
                                    ) : (
                                        comment.users?.full_name?.substring(0, 2).toUpperCase() || "?"
                                    )}
                                </div>
                                <div className="flex-1">
                                    {/* Comment Head */}
                                    <div className="flex items-baseline gap-2 mb-1">
                                        <span className="font-heading text-sm uppercase text-white hover:text-primary transition-colors cursor-pointer">
                                            {comment.users?.full_name || 'DANCER ANÔNIMO'}
                                        </span>
                                        <span className="text-[10px] text-[#555] font-sans ml-auto">{timeAgo(comment.created_at)}</span>
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
                                    {replies.length > 0 && (
                                        <div className="pl-4 border-l-2 border-[#222] space-y-4">
                                            {replies.map(reply => (
                                                <div key={reply.id} className="flex gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-[#111] flex items-center justify-center font-heading text-white border border-[#333] shrink-0 overflow-hidden">
                                                        {reply.users?.avatar_url ? (
                                                            <img src={reply.users.avatar_url} alt="User" className="w-full h-full object-cover grayscale" />
                                                        ) : (
                                                            reply.users?.full_name?.substring(0, 2).toUpperCase() || "?"
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-baseline gap-2 mb-0.5">
                                                            <span className="font-heading text-xs uppercase text-white cursor-pointer hover:text-primary transition-colors">
                                                                {reply.users?.full_name || 'DANCER ANÔNIMO'}
                                                            </span>
                                                            <span className="text-[10px] text-[#555] font-sans ml-auto">{timeAgo(reply.created_at)}</span>
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
                        )
                    })}
                </div>
            )}
        </div>
    )
}
