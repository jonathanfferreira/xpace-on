import { LeaderboardWeekly } from '@/components/community/leaderboard-weekly'
import { LeaderboardGlobal } from '@/components/community/leaderboard-global'
import Link from 'next/link'
import { Trophy, Globe } from 'lucide-react'

export const dynamic = 'force-dynamic';

export default async function RankingPage({
    searchParams
}: {
    searchParams: Promise<{ tab?: string }>
}) {
    const params = await searchParams;
    const isGlobal = params?.tab === 'global';

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <div className="mb-10 text-center">
                <h1 className="font-heading text-4xl mb-2 tracking-tight uppercase">
                    Ranking <span className="text-transparent bg-clip-text text-gradient-neon">
                        {isGlobal ? 'Global' : 'Semanal'}
                    </span>
                </h1>
                <p className="text-[#888] font-sans">
                    {isGlobal ? 'Os maiores nomes de todos os tempos.' : 'Assista aulas, ganhe XP e suba no rank da comunidade.'}
                </p>
            </div>

            {/* Tabs Navigation */}
            <div className="flex justify-center mb-8">
                <div className="inline-flex bg-[#0a0a0a] p-1 rounded-md border border-[#222]">
                    <Link
                        href="/dashboard/ranking?tab=semanal"
                        className={`
                            flex items-center gap-2 px-6 py-2.5 rounded text-sm font-heading tracking-widest uppercase transition-all
                            ${!isGlobal ? 'bg-primary text-white shadow-[0_0_15px_rgba(99,36,178,0.5)]' : 'text-[#888] hover:text-white hover:bg-[#1a1a1a]'}
                        `}
                    >
                        <Trophy size={16} />
                        Semanal
                    </Link>
                    <Link
                        href="/dashboard/ranking?tab=global"
                        className={`
                            flex items-center gap-2 px-6 py-2.5 rounded text-sm font-heading tracking-widest uppercase transition-all
                            ${isGlobal ? 'bg-secondary text-white shadow-[0_0_15px_rgba(235,0,188,0.5)]' : 'text-[#888] hover:text-white hover:bg-[#1a1a1a]'}
                        `}
                    >
                        <Globe size={16} />
                        All-Time
                    </Link>
                </div>
            </div>

            <div className="flex justify-center">
                {isGlobal ? <LeaderboardGlobal /> : <LeaderboardWeekly />}
            </div>
        </div>
    )
}
