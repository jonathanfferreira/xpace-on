'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Award, Lock, Star, Zap, Trophy, Target } from 'lucide-react';
import { motion } from 'framer-motion';

interface Badge {
    id: string;
    slug: string;
    name: string;
    description: string;
    category: 'progress' | 'streak' | 'exploration' | 'social' | 'special';
    xp_reward: number;
    unlocked_at?: string;
}

export function BadgeShowcase({ userId }: { userId: string }) {
    const [badges, setBadges] = useState<Badge[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        async function fetchBadges() {
            // Busca todas as badges e as que o usuário já desbloqueou
            const [{ data: allBadges }, { data: unlocked }] = await Promise.all([
                supabase.from('badges').select('*').order('xp_reward', { ascending: true }),
                supabase.from('user_badges').select('badge_id, unlocked_at').eq('user_id', userId)
            ]);

            if (allBadges) {
                const unlockedIds = new Set(unlocked?.map(u => u.badge_id) || []);
                const mapped = allBadges.map(b => ({
                    ...b,
                    unlocked_at: unlocked?.find(u => u.badge_id === b.id)?.unlocked_at
                }));
                setBadges(mapped);
            }
            setLoading(false);
        }

        if (userId) fetchBadges();
    }, [userId, supabase]);

    if (loading) return <div className="h-32 w-full animate-pulse bg-[#111] rounded-lg border border-[#222]" />;

    const getIcon = (category: string, unlocked: boolean) => {
        const props = { size: 24, className: unlocked ? 'text-white' : 'text-[#333]' };
        switch (category) {
            case 'progress': return <Trophy {...props} />;
            case 'streak': return <Zap {...props} />;
            case 'exploration': return <Star {...props} />;
            case 'social': return <Award {...props} />;
            default: return <Target {...props} />;
        }
    };

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'progress': return 'from-primary/40 to-primary/10 border-primary/30';
            case 'streak': return 'from-accent/40 to-accent/10 border-accent/30';
            case 'exploration': return 'from-yellow-500/40 to-yellow-500/10 border-yellow-500/30';
            default: return 'from-secondary/40 to-secondary/10 border-secondary/30';
        }
    };

    return (
        <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-2xl tracking-widest text-[#555] uppercase">Conquistas <span className="text-[10px] font-mono ml-2 opacity-50">XPACE Achievement System v2.0</span></h2>
                <div className="flex gap-2">
                   <div className="w-1 h-1 bg-primary"></div>
                   <div className="w-1 h-1 bg-secondary"></div>
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {badges.map((badge, idx) => {
                    const isUnlocked = !!badge.unlocked_at;
                    return (
                        <motion.div
                            key={badge.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className={`group relative p-4 rounded-xl border flex flex-col items-center justify-center text-center transition-all duration-500 ${isUnlocked ? `bg-gradient-to-br ${getCategoryColor(badge.category)} shadow-[0_0_20px_rgba(99,36,178,0.1)]` : 'bg-[#0a0a0a]/50 border-[#222] grayscale'}`}
                        >
                            <div className={`p-4 rounded-full mb-3 flex items-center justify-center transition-transform duration-500 group-hover:scale-110 ${isUnlocked ? 'bg-black/40 border border-white/10' : 'bg-[#111]'}`}>
                                {isUnlocked ? getIcon(badge.category, true) : <Lock size={20} className="text-[#333]" />}
                            </div>

                            <h4 className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${isUnlocked ? 'text-white' : 'text-[#444]'}`}>
                                {badge.name}
                            </h4>
                            
                            {isUnlocked ? (
                                <div className="bg-white/5 border border-white/10 px-2 py-0.5 rounded text-[8px] font-mono text-white/50">
                                    +{badge.xp_reward} XP
                                </div>
                            ) : (
                                <div className="text-[8px] font-mono text-[#222]">Bloqueado</div>
                            )}

                            {/* Tooltip Hover no Alinhamento XPACE */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-black/90 p-4 flex flex-col items-center justify-center text-center z-30 pointer-events-none rounded-xl border border-white/10">
                                <p className="text-[10px] text-[#aaa] leading-tight mb-2">{badge.description}</p>
                                <span className={`text-[9px] font-bold uppercase tracking-tighter ${isUnlocked ? 'text-green-500' : 'text-red-500/50'}`}>
                                    {isUnlocked ? 'Conquistado' : 'Missão Ativa'}
                                </span>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
