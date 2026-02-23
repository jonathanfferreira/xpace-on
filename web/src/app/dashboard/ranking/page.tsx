import { LeaderboardWeekly } from '@/components/community/leaderboard-weekly'

export default function RankingPage() {
    return (
        <div className="max-w-4xl mx-auto pb-20">
            <div className="mb-10 text-center">
                <h1 className="font-heading text-4xl mb-2 tracking-tight uppercase">
                    Ranking <span className="text-transparent bg-clip-text text-gradient-neon">Semanal</span>
                </h1>
                <p className="text-[#888] font-sans">Assista aulas, ganhe XP e suba no rank da comunidade.</p>
            </div>

            <div className="flex justify-center">
                <LeaderboardWeekly />
            </div>
        </div>
    )
}
