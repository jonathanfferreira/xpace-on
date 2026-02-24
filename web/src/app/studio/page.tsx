import {
    Users,
    PlayCircle,
    TrendingUp,
    DollarSign,
    ArrowUpRight
} from "lucide-react";

export default function StudioDashboardPage() {
    return (
        <div className="max-w-6xl mx-auto pb-10">
            <div className="mb-10">
                <h1 className="text-3xl font-heading font-bold text-white uppercase tracking-tight mb-2">Visão Geral</h1>
                <p className="text-[#888] font-sans text-sm">Acompanhe as métricas de retenção e faturamento da sua escola de dança nas últimas 24 horas.</p>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
                <MetricCard title="Alunos Ativos" value="1.248" trend="+12%" icon={<Users />} />
                <MetricCard title="Aulas Assistidas" value="8.402" trend="+34%" icon={<PlayCircle />} />
                <MetricCard title="Engajamento" value="78%" trend="+5%" icon={<TrendingUp />} />
                <MetricCard title="Receita Prevista" value="R$ 4.250" trend="+18%" icon={<DollarSign />} isMoney />
            </div>

            {/* Grids Inferiores (Fake para V1) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Aulas Populares */}
                <div className="lg:col-span-2 bg-[#0a0a0a] border border-[#1a1a1a] rounded-sm p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="font-heading font-bold uppercase text-white tracking-wide">Cursos de Maior Retenção</h2>
                        <button className="text-xs text-primary font-mono hover:text-white transition-colors">VER TODOS</button>
                    </div>

                    <div className="flex flex-col gap-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-4 p-3 hover:bg-[#111] border border-transparent hover:border-[#222] transition-colors rounded">
                                <div className="w-16 h-10 bg-[#1a1a1a] rounded flex items-center justify-center shrink-0">
                                    <PlayCircle size={14} className="text-[#444]" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-sm font-bold text-white">Módulo Avançado de House Dance</h4>
                                    <p className="text-xs text-[#666]">14 Aulas • 302 Visualizações hoje</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-secondary text-gradient-neon">92%</p>
                                    <p className="text-[10px] text-[#555] font-mono uppercase">Taxa de Conclusão</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Atividade Recente */}
                <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-sm p-6">
                    <h2 className="font-heading font-bold uppercase text-white tracking-wide mb-6">Atividade Recente</h2>

                    <div className="flex flex-col gap-5 relative before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-[1px] before:bg-[#222]">
                        <ActivityItem text="Aluno novo: Maria Silva assinou o plano Anual." time="Apenas agora" />
                        <ActivityItem text="Comentário na Aula 'Footwork 101' precisa de resposta." time="Há 2h" isAlert />
                        <ActivityItem text="Aviso de Upload: O curso 'Afro Beats' terminou de processar." time="Há 5h" />
                    </div>
                </div>

            </div>
        </div>
    );
}

function MetricCard({ title, value, trend, icon, isMoney = false }: any) {
    return (
        <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-5 rounded-sm flex flex-col relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 text-[#111] group-hover:text-primary/10 transition-colors w-24 h-24">
                {icon}
            </div>
            <div className="text-[#888] mb-4 relative z-10 w-8 h-8 flex items-center justify-center bg-[#111] rounded border border-[#222]">
                {icon}
            </div>
            <div className="relative z-10">
                <p className="text-xs font-sans text-[#666] mb-1">{title}</p>
                <div className="flex items-end gap-3">
                    <h3 className={`text-2xl font-display font-medium ${isMoney ? 'text-white' : 'text-white'}`}>{value}</h3>
                    <span className="flex items-center text-xs font-mono text-secondary mb-1">
                        <ArrowUpRight size={12} className="mr-0.5" />
                        {trend}
                    </span>
                </div>
            </div>
        </div>
    );
}

function ActivityItem({ text, time, isAlert }: any) {
    return (
        <div className="pl-6 relative">
            <div className={`absolute left-0 top-1 w-3 h-3 rounded-full border-[3px] border-[#0a0a0a] ${isAlert ? 'bg-accent' : 'bg-[#444]'}`}></div>
            <p className="text-sm text-[#ddd] mb-1 leading-snug">{text}</p>
            <span className="text-xs text-[#555] font-mono">{time}</span>
        </div>
    );
}
