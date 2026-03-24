import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import Image from 'next/image';
import { Medal, MapPin, Instagram } from 'lucide-react';

interface LeaderboardGlobalRow {
    user_id: string;
    full_name: string | null;
    avatar_url: string | null;
    total_xp: number;
    rank: number;
    instagram: string | null;
    location: string | null;
}

async function getGlobalLeaderboard(): Promise<LeaderboardGlobalRow[]> {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Fetch all XP history to aggregate globally
    // Note: For MVP we aggregate in Node. For scaled production, an SQL View or RPC is recommended.
    const { data: xpLogs } = await supabase
        .from('user_xp_history')
        .select('user_id, amount');

    const xpMap: Record<string, number> = {};
    if (xpLogs) {
        xpLogs.forEach((log) => {
            xpMap[log.user_id] = (xpMap[log.user_id] || 0) + log.amount;
        });
    }

    const sortedUsers = Object.entries(xpMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 50); // Top 50 Global

    if (sortedUsers.length === 0) return [];

    const userIds = sortedUsers.map(u => u[0]);

    // Fetch user details string Auth / Users
    const { data: usersData } = await supabase
        .from('users')
        .select('id, full_name, avatar_url, instagram, city, state')
        .in('id', userIds);

    const userMap = new Map(usersData?.map(u => [u.id, u]) || []);

    return sortedUsers.map(([userId, totalXp], index) => {
        const u = userMap.get(userId);
        let location = null;
        if (u?.city && u?.state) location = `${u.city}, ${u.state}`;
        else if (u?.city) location = u.city;
        else if (u?.state) location = u.state;

        return {
            user_id: userId,
            full_name: u?.full_name || null,
            avatar_url: u?.avatar_url || null,
            total_xp: totalXp,
            rank: index + 1,
            instagram: u?.instagram || null,
            location: location
        };
    });
}

async function getCurrentUserId(): Promise<string | null> {
    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { cookies: { getAll: () => cookieStore.getAll() } }
    );
    const { data: { user } } = await supabase.auth.getUser();
    return user?.id ?? null;
}

export async function LeaderboardGlobal() {
    const [leaderboard, currentUserId] = await Promise.all([getGlobalLeaderboard(), getCurrentUserId()]);

    if (leaderboard.length === 0) {
        return (
            <div className="bg-[#050505] border border-[#151515] rounded-sm p-6 w-full">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-sm bg-secondary/10 border border-secondary/30 flex items-center justify-center">
                        <Medal size={20} className="text-secondary" />
                    </div>
                    <div>
                        <h2 className="font-heading text-xl uppercase tracking-widest text-white">Ranking Global (All-Time)</h2>
                        <p className="text-[10px] font-sans text-[#666]">Acúmulo total de XP desde a criação da conta</p>
                    </div>
                </div>
                <p className="text-[#555] text-sm text-center py-8">Nenhum dado de XP ainda. Complete aulas para aparecer aqui!</p>
            </div>
        );
    }

    return (
        <div className="bg-[#050505] border border-[#151515] rounded-sm p-6 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-[#1a1a1a] pb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-sm bg-secondary/10 border border-secondary/30 flex items-center justify-center">
                        <Medal size={20} className="text-secondary" />
                    </div>
                    <div>
                        <h2 className="font-heading text-xl uppercase tracking-widest text-white">Ranking Global</h2>
                        <p className="text-[10px] font-sans text-[#666]">All-Time (Maiores Pontuações da História)</p>
                    </div>
                </div>
            </div>

            <div className="space-y-3">
                {leaderboard.map((user) => {
                    const isCurrentUser = user.user_id === currentUserId;
                    const rankColor = user.rank === 1 ? 'text-yellow-400' : user.rank === 2 ? 'text-gray-300' : user.rank === 3 ? 'text-amber-600' : 'text-[#888]';
                    const initials = (user.full_name || 'AN').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

                    return (
                        <div
                            key={user.user_id}
                            className={`flex items-center gap-4 p-4 rounded-sm transition-colors ${isCurrentUser ? 'bg-secondary/10 border border-secondary/30' : 'bg-[#0A0A0A] border border-[#1A1A1A] hover:border-[#333]'}`}
                        >
                            <div className={`w-8 font-display text-2xl text-center flex-shrink-0 ${rankColor}`}>
                                {user.rank}
                            </div>
                            <div className="w-12 h-12 rounded-full bg-[#222] flex items-center justify-center font-heading text-white border border-[#333] shrink-0 relative overflow-hidden">
                                {user.rank === 1 && <div className="absolute inset-0 bg-yellow-400/20" />}
                                {user.avatar_url ? (
                                    <Image src={user.avatar_url} alt={initials} fill className="object-cover" unoptimized />
                                ) : (
                                    <span className="relative z-10 text-sm">{initials}</span>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className={`font-display text-sm sm:text-base uppercase tracking-wider truncate ${isCurrentUser ? 'text-secondary drop-shadow-[0_0_8px_#eb00bc]' : 'text-white'}`}>
                                    {user.full_name || 'Anônimo'} {isCurrentUser && '(Você)'}
                                </h4>

                                <div className="flex items-center gap-3 mt-1 opacity-70">
                                    {user.location && (
                                        <div className="flex items-center gap-1 text-[10px] sm:text-xs text-[#888]">
                                            <MapPin size={10} />
                                            <span className="truncate">{user.location}</span>
                                        </div>
                                    )}
                                    {user.instagram && (
                                        <a href={`https://instagram.com/${user.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[10px] sm:text-xs text-[#888] hover:text-secondary transition-colors cursor-pointer">
                                            <Instagram size={10} />
                                            <span>{user.instagram}</span>
                                        </a>
                                    )}
                                </div>
                            </div>
                            <div className="text-right flex-shrink-0">
                                <span className={`font-display text-xl sm:text-2xl ${isCurrentUser ? 'text-secondary drop-shadow-[0_0_10px_#eb00bc]' : 'text-white'}`}>
                                    {user.total_xp.toLocaleString()}
                                </span>
                                <span className="text-[10px] font-mono text-[#666] uppercase tracking-widest block -mt-1 sm:-mt-2">XP</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
