import { Award, Trophy, Flame, Star, Zap, Target, Medal } from 'lucide-react'

const MOCK_ACHIEVEMENTS = [
    { icon: <Flame size={24} />, name: 'Sequência de Fogo', description: '7 dias seguidos treinando', unlocked: true, xp: 150 },
    { icon: <Star size={24} />, name: 'Primeira Aula', description: 'Completou sua primeira aula', unlocked: true, xp: 50 },
    { icon: <Zap size={24} />, name: 'Velocidade Máxima', description: 'Assistiu uma aula em 2x', unlocked: true, xp: 30 },
    { icon: <Target size={24} />, name: 'Módulo Completo', description: 'Finalizou um módulo inteiro', unlocked: true, xp: 200 },
    { icon: <Trophy size={24} />, name: 'Top 10 Semanal', description: 'Entrou no ranking Top 10', unlocked: false, xp: 500 },
    { icon: <Medal size={24} />, name: 'Curso Finalizado', description: 'Concluiu 100% de um curso', unlocked: false, xp: 1000 },
]

export default function ConquistasPage() {
    const totalXP = MOCK_ACHIEVEMENTS.filter(a => a.unlocked).reduce((sum, a) => sum + a.xp, 0)
    const unlockedCount = MOCK_ACHIEVEMENTS.filter(a => a.unlocked).length

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="font-heading text-4xl mb-2 tracking-tight uppercase">
                        <span className="text-transparent bg-clip-text text-gradient-neon">Conquistas</span>
                    </h1>
                    <p className="text-[#888] font-sans">Desbloqueie medalhas e acumule XP treinando.</p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-[#111] border border-[#222] px-4 py-2 rounded flex flex-col items-center min-w-[100px]">
                        <span className="text-secondary font-display text-2xl">{totalXP}</span>
                        <span className="text-[10px] text-[#555] font-mono uppercase tracking-widest">XP Total</span>
                    </div>
                    <div className="bg-[#111] border border-[#222] px-4 py-2 rounded flex flex-col items-center min-w-[100px]">
                        <span className="text-accent font-display text-2xl">{unlockedCount}/{MOCK_ACHIEVEMENTS.length}</span>
                        <span className="text-[10px] text-[#555] font-mono uppercase tracking-widest">Medalhas</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {MOCK_ACHIEVEMENTS.map((achievement, i) => (
                    <div
                        key={i}
                        className={`flex items-center gap-4 p-5 rounded-sm border transition-colors ${achievement.unlocked
                            ? 'bg-[#0A0A0A] border-[#222] hover:border-primary/30'
                            : 'bg-[#050505] border-[#151515] opacity-50'
                            }`}
                    >
                        <div className={`w-12 h-12 rounded-sm flex items-center justify-center shrink-0 ${achievement.unlocked
                            ? 'bg-primary/10 border border-primary/20 text-primary'
                            : 'bg-[#111] border border-[#1a1a1a] text-[#333]'
                            }`}>
                            {achievement.icon}
                        </div>
                        <div className="flex-1">
                            <h3 className={`font-heading text-sm uppercase tracking-widest ${achievement.unlocked ? 'text-white' : 'text-[#444]'}`}>
                                {achievement.name}
                            </h3>
                            <p className="text-[10px] font-sans text-[#555]">{achievement.description}</p>
                        </div>
                        <div className="text-right">
                            <span className={`text-xs font-mono ${achievement.unlocked ? 'text-secondary' : 'text-[#333]'}`}>
                                +{achievement.xp} XP
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
