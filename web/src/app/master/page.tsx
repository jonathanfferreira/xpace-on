import {
    Users,
    PlayCircle,
    TrendingUp,
    DollarSign,
    ArrowUpRight,
    ShieldCheck,
    AlertOctagon,
    Building2,
    Activity
} from "lucide-react";

export default function MasterDashboardPage() {
    return (
        <div className="max-w-7xl mx-auto pb-10">
            <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-white uppercase tracking-tight mb-2">Suprema Corte XPACE</h1>
                    <p className="text-[#888] font-sans text-sm">Visão global da Plataforma (Todas as Escolas Combinadas). Acesso restrito Nível 5.</p>
                </div>
                <div className="flex items-center gap-2 bg-[#111] border border-[#222] px-4 py-2 rounded-sm">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="font-mono text-xs text-[#aaa] uppercase tracking-widest">Sistemas Operacionais</span>
                </div>
            </div>

            {/* Asaas Revenue KPIs */}
            <h2 className="text-xl font-heading font-bold text-white uppercase tracking-wide mb-4 flex items-center gap-2">
                <DollarSign className="text-primary" /> Faturamento Global (Hoje)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
                <MetricCard
                    title="Volume Bruto (GMV)"
                    value="R$ 145.240"
                    trend="+12%"
                    icon={<Activity />}
                    isMoney
                    tooltip="Total faturado por todas as escolas juntas."
                />
                <MetricCard
                    title="Net Revenue XPACE (15%)"
                    value="R$ 21.786"
                    trend="+15%"
                    icon={<DollarSign />}
                    isMoney
                    highlight // Card em Destaque
                    tooltip="Seu lucro limpo já descontado o repasse para os Professores."
                />
                <MetricCard
                    title="Alunos Ativos (Global)"
                    value="42.890"
                    trend="+1.2k novos"
                    icon={<Users />}
                />
                <MetricCard
                    title="Escolas Registradas"
                    value="156"
                    trend="3 na fila"
                    icon={<Building2 />}
                />
            </div>

            {/* Grids Inferiores (Fake para V1) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Pending Schools Approval */}
                <div className="lg:col-span-2 bg-[#0a0a0a] border border-[#1a1a1a] rounded-sm p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5"><ShieldCheck size={120} /></div>

                    <div className="flex justify-between items-center mb-6 relative z-10">
                        <h2 className="font-heading font-bold uppercase text-white tracking-wide flex items-center gap-2">
                            <AlertOctagon className="text-accent" size={18} /> Escolas Pendentes de Aprovação
                        </h2>
                        <button className="text-xs text-primary font-mono hover:text-white transition-colors">VER FILA COMPLETA</button>
                    </div>

                    <div className="flex flex-col gap-4 relative z-10">
                        {[
                            { name: "Urban Stars Studio", owner: "Rafael C.", tier: "Pro", followers: "24k" },
                            { name: "HipHop Masterclass", owner: "Gaby D.", tier: "Iniciante", followers: "1.2k" },
                            { name: "BreakLife Academy", owner: "B-boy Sun", tier: "Pro", followers: "89k" }
                        ].map((school, i) => (
                            <div key={i} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-[#111] border border-[#222] rounded">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-[#1a1a1a] rounded flex items-center justify-center shrink-0 border border-white/5">
                                        <Building2 size={20} className="text-[#666]" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-white">{school.name}</h4>
                                        <p className="text-xs text-[#888]">Prof: {school.owner} • Instagram: {school.followers}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2 w-full sm:w-auto">
                                    <button className="flex-1 sm:flex-none px-4 py-2 text-xs font-mono uppercase font-bold text-white bg-green-600/20 border border-green-600/50 hover:bg-green-600 rounded transition-colors text-center cursor-pointer">
                                        Aprovar
                                    </button>
                                    <button className="flex-1 sm:flex-none px-4 py-2 text-xs font-mono uppercase font-bold text-white bg-red-600/10 border border-red-600/30 hover:bg-red-600 rounded transition-colors text-center cursor-pointer">
                                        Recusar
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* System Alerts */}
                <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-sm p-6">
                    <h2 className="font-heading font-bold uppercase text-white tracking-wide mb-6">Auditoria Recente</h2>

                    <div className="flex flex-col gap-5 relative before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-[1px] before:bg-[#222]">
                        <ActivityItem text="Escola 'Afro Vibes' sacou R$ 4.200 via Asaas." time="Há 10 min" />
                        <ActivityItem text="Alerta: Disputa de Cartão na transação #4992 (Escola Urban Stars)." time="Há 2h" isAlert />
                        <ActivityItem text="Servidor Bunny.net operando com 99.9% HLS Delivery." time="Há 5h" isGood />
                    </div>
                </div>

            </div>
        </div>
    );
}

function MetricCard({ title, value, trend, icon, isMoney = false, highlight = false, tooltip }: any) {
    return (
        <div className={`
            p-5 rounded-sm flex flex-col relative overflow-hidden group border
            ${highlight ? 'bg-primary/5 border-primary shadow-[0_0_30px_rgba(99,36,178,0.15)]' : 'bg-[#0a0a0a] border-[#1a1a1a]'}
        `}>
            <div className="absolute -right-4 -top-4 text-[#111] group-hover:text-primary/10 transition-colors w-24 h-24 pointer-events-none">
                {icon}
            </div>
            <div className={`mb-4 relative z-10 w-8 h-8 flex items-center justify-center rounded border ${highlight ? 'bg-primary/20 border-primary text-primary' : 'bg-[#111] border-[#222] text-[#888]'}`}>
                {icon}
            </div>
            <div className="relative z-10 flex-1 flex flex-col justify-end">
                <p className={`text-xs font-sans mb-1 flex items-center gap-1 ${highlight ? 'text-white' : 'text-[#666]'}`} title={tooltip}>
                    {title}
                </p>
                <div className="flex flex-wrap items-end gap-3">
                    <h3 className={`text-2xl font-display font-medium ${isMoney ? 'text-white' : 'text-[#ddd]'}`}>{value}</h3>
                    <span className={`flex items-center text-xs font-mono mb-1 ${highlight ? 'text-[#fff]' : 'text-secondary'}`}>
                        <ArrowUpRight size={12} className="mr-0.5" />
                        {trend}
                    </span>
                </div>
            </div>
        </div>
    );
}

function ActivityItem({ text, time, isAlert, isGood }: any) {
    return (
        <div className="pl-6 relative">
            <div className={`absolute left-0 top-1 w-3 h-3 rounded-full border-[3px] border-[#0a0a0a] 
                ${isAlert ? 'bg-accent' : isGood ? 'bg-green-500' : 'bg-primary'}
            `}></div>
            <p className="text-sm text-[#ddd] mb-1 leading-snug">{text}</p>
            <span className="text-xs text-[#555] font-mono">{time}</span>
        </div>
    );
}
