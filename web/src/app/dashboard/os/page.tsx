'use client'

import { DollarSign, Users, BookOpen, TrendingUp, BarChart3, ArrowUpRight } from 'lucide-react'
import { useState } from 'react'

const MOCK_SALES = [
    { month: 'Set', total: 1200 },
    { month: 'Out', total: 2800 },
    { month: 'Nov', total: 3500 },
    { month: 'Dez', total: 4100 },
    { month: 'Jan', total: 5200 },
    { month: 'Fev', total: 6890 },
]

const MOCK_RECENT_SALES = [
    { name: 'Ana Oliveira', course: 'Fundamentos Hip-Hop', amount: 349.90, date: '23/02/2026' },
    { name: 'Carlos Silva', course: 'Breaking Avançado', amount: 499.90, date: '22/02/2026' },
    { name: 'Julia Santos', course: 'Fundamentos Hip-Hop', amount: 349.90, date: '21/02/2026' },
    { name: 'Rafael Mendes', course: 'House Dance Iniciante', amount: 299.90, date: '20/02/2026' },
    { name: 'Mariana Costa', course: 'Fundamentos Hip-Hop', amount: 349.90, date: '19/02/2026' },
]

export default function XpaceOSPage() {
    const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('30d')
    const maxSale = Math.max(...MOCK_SALES.map(s => s.total))

    return (
        <div className="max-w-6xl mx-auto pb-20">
            {/* Header */}
            <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="font-heading text-4xl mb-2 tracking-tight uppercase">
                        XPACE <span className="text-transparent bg-clip-text text-gradient-neon">OS</span>
                    </h1>
                    <p className="text-[#888] font-sans">Painel administrativo do criador de conteúdo.</p>
                </div>
                <div className="flex gap-2">
                    {(['7d', '30d', '90d'] as const).map(p => (
                        <button
                            key={p}
                            onClick={() => setPeriod(p)}
                            className={`px-3 py-1.5 text-xs font-sans font-medium rounded transition-colors ${period === p
                                ? 'bg-primary text-white'
                                : 'bg-[#111] border border-[#222] text-[#888] hover:text-white'
                                }`}
                        >
                            {p === '7d' ? '7 Dias' : p === '30d' ? '30 Dias' : '90 Dias'}
                        </button>
                    ))}
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                <KPICard
                    icon={<DollarSign size={20} />}
                    label="Receita Total"
                    value="R$ 6.890,00"
                    change="+32.5%"
                    positive
                    color="text-emerald-400"
                    borderColor="border-emerald-500/20"
                />
                <KPICard
                    icon={<Users size={20} />}
                    label="Alunos Ativos"
                    value="147"
                    change="+12"
                    positive
                    color="text-primary"
                    borderColor="border-primary/20"
                />
                <KPICard
                    icon={<BookOpen size={20} />}
                    label="Cursos Publicados"
                    value="3"
                    change=""
                    positive
                    color="text-secondary"
                    borderColor="border-secondary/20"
                />
                <KPICard
                    icon={<TrendingUp size={20} />}
                    label="Saldo Asaas"
                    value="R$ 4.230,50"
                    change="Disponível"
                    positive
                    color="text-accent"
                    borderColor="border-accent/20"
                />
            </div>

            {/* Two-Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

                {/* Revenue Chart */}
                <div className="lg:col-span-3 bg-[#0A0A0A] border border-[#222] rounded-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <BarChart3 size={18} className="text-primary" />
                            <h2 className="font-heading text-lg uppercase tracking-widest text-white">Vendas</h2>
                        </div>
                        <span className="text-xs font-sans text-[#666]">Últimos 6 meses</span>
                    </div>

                    {/* Simple Bar Chart */}
                    <div className="flex items-end gap-3 h-48">
                        {MOCK_SALES.map((sale) => (
                            <div key={sale.month} className="flex-1 flex flex-col items-center gap-2">
                                <span className="text-[10px] font-sans text-[#666]">
                                    R${(sale.total / 1000).toFixed(1)}k
                                </span>
                                <div
                                    className="w-full bg-gradient-to-t from-primary/80 to-secondary/60 rounded-t-sm transition-all duration-500 hover:from-primary hover:to-secondary"
                                    style={{ height: `${(sale.total / maxSale) * 100}%` }}
                                />
                                <span className="text-[10px] font-sans text-[#555] uppercase tracking-widest">
                                    {sale.month}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Sales */}
                <div className="lg:col-span-2 bg-[#0A0A0A] border border-[#222] rounded-sm p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <ArrowUpRight size={18} className="text-emerald-400" />
                        <h2 className="font-heading text-lg uppercase tracking-widest text-white">Recentes</h2>
                    </div>

                    <div className="space-y-4">
                        {MOCK_RECENT_SALES.map((sale, i) => (
                            <div key={i} className="flex items-center justify-between py-2 border-b border-[#151515] last:border-0">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                                        <span className="text-xs font-sans font-bold text-primary">
                                            {sale.name.charAt(0)}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-sans text-white">{sale.name}</p>
                                        <p className="text-[10px] font-sans text-[#555]">{sale.course}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-sans font-bold text-emerald-400">
                                        +R$ {sale.amount.toFixed(2).replace('.', ',')}
                                    </p>
                                    <p className="text-[10px] font-sans text-[#555]">{sale.date}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

function KPICard({ icon, label, value, change, positive, color, borderColor }: {
    icon: React.ReactNode; label: string; value: string; change: string; positive: boolean; color: string; borderColor: string
}) {
    return (
        <div className={`bg-[#0A0A0A] border ${borderColor} rounded-sm p-5 relative overflow-hidden group hover:border-[#333] transition-colors`}>
            <div className="flex items-center justify-between mb-3">
                <span className={`${color}`}>{icon}</span>
                {change && (
                    <span className={`text-[10px] font-sans font-medium px-2 py-0.5 rounded ${positive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                        {change}
                    </span>
                )}
            </div>
            <p className="font-display text-3xl text-white mb-1">{value}</p>
            <p className="text-[10px] font-sans text-[#555] uppercase tracking-widest">{label}</p>

            {/* Subtle glow */}
            <div className={`absolute -bottom-4 -right-4 w-20 h-20 ${color.replace('text-', 'bg-')}/5 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity`} />
        </div>
    )
}
