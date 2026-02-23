import Image from "next/image";
import { Trophy, Medal, Crown } from "lucide-react";

const MOCK_LEADERBOARD = [
    { rank: 1, name: "Lucas Moura", xp: 12450, avatar: "LM", streak: 12 },
    { rank: 2, name: "Ana Beatriz", xp: 11200, avatar: "AB", streak: 8 },
    { rank: 3, name: "Pedro Silva", xp: 10850, avatar: "PS", streak: 5 },
    { rank: 4, name: "Jonathan Ferreira", xp: 9500, avatar: "JF", streak: 4, isCurrentUser: true },
    { rank: 5, name: "Carla Souza", xp: 8200, avatar: "CS", streak: 2 },
    { rank: 6, name: "Marcos Lima", xp: 7900, avatar: "ML", streak: 7 },
    { rank: 7, name: "Julia Santos", xp: 7100, avatar: "JS", streak: 3 },
    { rank: 8, name: "Thiago Oliveira", xp: 6800, avatar: "TO", streak: 1 },
    { rank: 9, name: "Beatriz Costa", xp: 6200, avatar: "BC", streak: 2 },
    { rank: 10, name: "Rafael Almeida", xp: 5900, avatar: "RA", streak: 1 },
];

export function LeaderboardWeekly() {
    return (
        <div className="bg-[#0A0A0A] border border-[#222] rounded-sm p-6 w-full">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-sm bg-primary/10 border border-primary/30 flex items-center justify-center">
                        <Trophy size={20} className="text-primary" />
                    </div>
                    <div>
                        <h2 className="font-heading text-xl uppercase tracking-widest text-white">Top 10 da Semana</h2>
                        <p className="text-[10px] font-sans text-[#666]">Ranking reinicia todo domingo meia-noite</p>
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                {MOCK_LEADERBOARD.map((user) => {
                    const isTop3 = user.rank <= 3;
                    const rankColor = user.rank === 1 ? 'text-yellow-400' : user.rank === 2 ? 'text-gray-300' : user.rank === 3 ? 'text-amber-600' : 'text-[#555]';

                    return (
                        <div
                            key={user.rank}
                            className={`flex items-center gap-4 p-3 rounded-sm transition-colors ${user.isCurrentUser ? 'bg-primary/10 border border-primary/30' : 'bg-[#111] border border-transparent hover:border-[#333]'}`}
                        >
                            <div className={`w-8 font-display text-2xl text-center ${rankColor}`}>
                                {user.rank}
                            </div>

                            <div className="w-10 h-10 rounded-full bg-[#222] flex items-center justify-center font-heading text-white border border-[#333] shrink-0 relative overflow-hidden">
                                {user.rank === 1 && <div className="absolute inset-0 bg-yellow-400/20"></div>}
                                <span className="relative z-10">{user.avatar}</span>
                            </div>

                            <div className="flex-1">
                                <h4 className={`font-heading text-sm uppercase ${user.isCurrentUser ? 'text-primary drop-shadow-[0_0_8px_#6324b2]' : 'text-white'}`}>
                                    {user.name} {user.isCurrentUser && '(Você)'}
                                </h4>
                                <p className="text-[10px] font-mono text-[#666] tracking-widest">
                                    Combo Fogo: {user.streak} DIAS
                                </p>
                            </div>

                            <div className="text-right">
                                <span className={`font-display text-xl ${user.isCurrentUser ? 'text-secondary drop-shadow-[0_0_10px_#eb00bc]' : 'text-white'}`}>
                                    {user.xp.toLocaleString()}
                                </span>
                                <span className="text-[10px] font-mono text-[#666] uppercase tracking-widest block -mt-1">XP</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
