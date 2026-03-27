'use client';

import {
    Users,
    TrendingUp,
    DollarSign,
    ArrowUpRight,
    ShieldCheck,
    AlertOctagon,
    Building2,
    Activity,
    CheckCircle,
    XCircle,
    RefreshCw,
    Instagram,
    Clock
} from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { StudioChart, PeriodSelector } from '@/components/charts/studio-chart';
import { format, subDays, startOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface DashboardData {
    totalTenants: number;
    activeTenants: number;
    pendingTenants: number;
    totalUsers: number;
    totalTransactions: number;
    totalRevenue: number;
    pendingSchools: { id: string; name: string; owner_name: string; instagram: string }[];
    revenueChart: { date: string; value: number }[];
    usersChart: { date: string; value: number }[];
    auditEvents: { text: string; time: string; type: 'good' | 'alert' | 'info' }[];
}

export default function MasterDashboardPage() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState('30d');
    const supabase = createClient();

    const getDaysFromPeriod = (p: string) => {
        if (p === '7d') return 7;
        if (p === '90d') return 90;
        return 30;
    };

    const fetchDashboard = async () => {
        setLoading(true);
        const days = getDaysFromPeriod(period);
        const since = subDays(new Date(), days).toISOString();

        const [tenantsRes, usersRes, txRes, pendingRes, auditRes, txChartRes, usersChartRes] = await Promise.all([
            supabase.from('tenants').select('id, status'),
            supabase.from('users').select('id', { count: 'exact', head: true }),
            supabase.from('transactions').select('amount, status').eq('status', 'confirmed'),
            supabase.from('tenants').select(`id, name, instagram, owner:users!owner_id(full_name)`).eq('status', 'pending').order('created_at', { ascending: false }).limit(5),
            supabase.from('audit_log').select('action, details, created_at').order('created_at', { ascending: false }).limit(8),
            supabase.from('transactions').select('amount, created_at').eq('status', 'confirmed').gte('created_at', since).order('created_at'),
            supabase.from('users').select('created_at').gte('created_at', since).order('created_at'),
        ]);

        const tenants = tenantsRes.data || [];
        const totalRevenue = (txRes.data || []).reduce((acc: number, t: any) => acc + Number(t.amount || 0), 0);

        // Agrupar transações por dia para o gráfico
        const revenueByDay = new Map<string, number>();
        const usersByDay = new Map<string, number>();

        for (let i = 0; i < days; i++) {
            const key = format(subDays(new Date(), days - 1 - i), 'dd/MM');
            revenueByDay.set(key, 0);
            usersByDay.set(key, 0);
        }

        (txChartRes.data || []).forEach((t: any) => {
            const key = format(new Date(t.created_at), 'dd/MM');
            revenueByDay.set(key, (revenueByDay.get(key) || 0) + Number(t.amount));
        });

        (usersChartRes.data || []).forEach((u: any) => {
            const key = format(new Date(u.created_at), 'dd/MM');
            usersByDay.set(key, (usersByDay.get(key) || 0) + 1);
        });

        // Processar audit log real
        const auditEvents = (auditRes.data || []).map((e: any) => ({
            text: `${e.action}: ${typeof e.details === 'object' ? JSON.stringify(e.details).slice(0, 80) : (e.details || '').slice(0, 80)}`,
            time: format(new Date(e.created_at), "dd/MM 'às' HH:mm", { locale: ptBR }),
            type: e.action?.includes('approve') ? 'good' as const :
                  e.action?.includes('reject') || e.action?.includes('refund') ? 'alert' as const :
                  'info' as const,
        }));

        // Fallback se não tiver audit log ainda
        if (auditEvents.length === 0) {
            auditEvents.push(
                { text: `${tenants.filter(t => t.status === 'active').length} escola(s) ativa(s) gerando receita.`, time: 'Agora', type: 'good' as const },
                { text: `${tenants.filter(t => t.status === 'pending').length} escola(s) aguardando aprovação.`, time: 'Agora', type: tenants.filter(t => t.status === 'pending').length > 0 ? 'alert' as const : 'info' as const },
            );
        }

        setData({
            totalTenants: tenants.length,
            activeTenants: tenants.filter(t => t.status === 'active').length,
            pendingTenants: tenants.filter(t => t.status === 'pending').length,
            totalUsers: usersRes.count || 0,
            totalTransactions: (txRes.data || []).length,
            totalRevenue,
            pendingSchools: (pendingRes.data || []).map((s: any) => ({
                id: s.id,
                name: s.name,
                owner_name: s.owner?.full_name || 'N/A',
                instagram: s.instagram || '',
            })),
            revenueChart: Array.from(revenueByDay, ([date, value]) => ({ date, value })),
            usersChart: Array.from(usersByDay, ([date, value]) => ({ date, value })),
            auditEvents,
        });
        setLoading(false);
    };

    useEffect(() => { fetchDashboard(); }, [period]);

    const handleApprove = async (tenantId: string) => {
        if (!confirm("Aprovar esta escola e criar Sub-Conta Asaas?")) return;
        try {
            const res = await fetch('/api/master/schools/approve', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tenantId })
            });
            const result = await res.json();
            if (!res.ok) throw new Error(result.error);
            alert("✅ Escola aprovada! Wallet: " + result.walletId);
            fetchDashboard();
        } catch (e: any) {
            alert("Erro: " + e.message);
        }
    };

    const handleReject = async (tenantId: string) => {
        if (!confirm("Recusar e remover esta solicitação?")) return;
        const { error } = await supabase.from('tenants').delete().eq('id', tenantId);
        if (error) { alert("Erro: " + error.message); return; }
        fetchDashboard();
    };

    const xpaceRevenue = data ? data.totalRevenue * 0.15 : 0;

    return (
        <div className="max-w-7xl mx-auto pb-10">
            <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-white uppercase tracking-tight mb-2">Suprema Corte XPACE</h1>
                    <p className="text-[#888] font-sans text-sm">Visão global da Plataforma (Todas as Escolas Combinadas). Acesso restrito Nível 5.</p>
                </div>
                <div className="flex items-center gap-3">
                    <PeriodSelector value={period} onChange={setPeriod} />
                    <button onClick={fetchDashboard} className="flex items-center gap-2 bg-[#111] border border-[#222] px-4 py-2 rounded-sm text-[#aaa] text-xs font-mono uppercase hover:text-white transition-colors">
                        <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Sync
                    </button>
                    <div className="flex items-center gap-2 bg-[#111] border border-[#222] px-4 py-2 rounded-sm">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="font-mono text-xs text-[#aaa] uppercase tracking-widest">Sistemas Operacionais</span>
                    </div>
                </div>
            </div>

            {/* KPIs */}
            <h2 className="text-xl font-heading font-bold text-white uppercase tracking-wide mb-4 flex items-center gap-2">
                <DollarSign className="text-primary" /> Faturamento Global
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <MetricCard
                    title="Volume Bruto (GMV)"
                    value={loading ? '...' : `R$ ${data?.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0'}`}
                    trend={`${data?.totalTransactions || 0} transações`}
                    icon={<Activity />}
                    isMoney
                />
                <MetricCard
                    title="Net Revenue XPACE (15%)"
                    value={loading ? '...' : `R$ ${xpaceRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                    trend="Split automático"
                    icon={<DollarSign />}
                    isMoney
                    highlight
                />
                <MetricCard
                    title="Alunos Ativos (Global)"
                    value={loading ? '...' : String(data?.totalUsers || 0)}
                    trend="cadastrados"
                    icon={<Users />}
                />
                <MetricCard
                    title="Escolas Registradas"
                    value={loading ? '...' : String(data?.totalTenants || 0)}
                    trend={`${data?.pendingTenants || 0} na fila`}
                    icon={<Building2 />}
                />
            </div>

            {/* Gráficos Temporais */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
                <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-sm p-6">
                    <h3 className="font-heading font-bold uppercase text-white tracking-wide mb-4 text-sm flex items-center gap-2">
                        <TrendingUp size={14} className="text-secondary" /> Receita por Dia
                    </h3>
                    {data?.revenueChart ? (
                        <StudioChart
                            data={data.revenueChart}
                            label="Receita"
                            color="#EB00BC"
                            formatValue={(v) => `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                        />
                    ) : (
                        <div className="h-48 flex items-center justify-center text-[#555] text-sm">Carregando...</div>
                    )}
                </div>
                <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-sm p-6">
                    <h3 className="font-heading font-bold uppercase text-white tracking-wide mb-4 text-sm flex items-center gap-2">
                        <Users size={14} className="text-primary" /> Novos Usuários por Dia
                    </h3>
                    {data?.usersChart ? (
                        <StudioChart
                            data={data.usersChart}
                            label="Usuários"
                            color="#6324B2"
                        />
                    ) : (
                        <div className="h-48 flex items-center justify-center text-[#555] text-sm">Carregando...</div>
                    )}
                </div>
            </div>

            {/* Lower Grids */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Pending Schools */}
                <div className="lg:col-span-2 bg-[#0a0a0a] border border-[#1a1a1a] rounded-sm p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5"><ShieldCheck size={120} /></div>
                    <div className="flex justify-between items-center mb-6 relative z-10">
                        <h2 className="font-heading font-bold uppercase text-white tracking-wide flex items-center gap-2">
                            <AlertOctagon className="text-accent" size={18} /> Escolas Pendentes de Aprovação
                        </h2>
                        <Link href="/master/escolas" className="text-xs text-primary font-mono hover:text-white transition-colors">VER FILA COMPLETA</Link>
                    </div>

                    <div className="flex flex-col gap-4 relative z-10">
                        {loading ? (
                            <p className="text-[#555] text-sm text-center py-8">Carregando pendências...</p>
                        ) : (data?.pendingSchools.length === 0) ? (
                            <p className="text-[#555] text-sm text-center py-8">Nenhuma escola aguardando aprovação. 🎉</p>
                        ) : (
                            data?.pendingSchools.map((school) => (
                                <div key={school.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-[#111] border border-[#222] rounded">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-[#1a1a1a] rounded flex items-center justify-center shrink-0 border border-white/5">
                                            <Building2 size={20} className="text-[#666]" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-white">{school.name}</h4>
                                            <p className="text-xs text-[#888]">Prof: {school.owner_name} • Instagram: {school.instagram}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap sm:flex-nowrap gap-2 w-full sm:w-auto mt-4 sm:mt-0">
                                        <a
                                            href={`https://instagram.com/${school.instagram.replace('@', '')}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 sm:flex-none px-4 py-2 text-xs font-mono uppercase font-bold text-white bg-blue-600/10 border border-blue-600/30 hover:bg-blue-600 rounded transition-colors text-center cursor-pointer flex items-center justify-center gap-1.5"
                                        >
                                            <Instagram size={14} /> Redes
                                        </a>
                                        <button
                                            onClick={() => handleApprove(school.id)}
                                            className="flex-1 sm:flex-none px-4 py-2 text-xs font-mono uppercase font-bold text-white bg-green-600/20 border border-green-600/50 hover:bg-green-600 rounded transition-colors text-center cursor-pointer flex items-center justify-center gap-1.5"
                                        >
                                            <CheckCircle size={14} /> Aprovar
                                        </button>
                                        <button
                                            onClick={() => handleReject(school.id)}
                                            className="flex-1 sm:flex-none px-4 py-2 text-xs font-mono uppercase font-bold text-white bg-red-600/10 border border-red-600/30 hover:bg-red-600 rounded transition-colors text-center cursor-pointer flex items-center justify-center gap-1.5"
                                        >
                                            <XCircle size={14} /> Recusar
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Audit Log REAL */}
                <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-sm p-6">
                    <h2 className="font-heading font-bold uppercase text-white tracking-wide mb-6 flex items-center gap-2">
                        <Clock size={16} className="text-primary" /> Auditoria em Tempo Real
                    </h2>
                    <div className="flex flex-col gap-5 relative before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-[1px] before:bg-[#222]">
                        {(data?.auditEvents || []).map((event, i) => (
                            <ActivityItem key={i} text={event.text} time={event.time} isGood={event.type === 'good'} isAlert={event.type === 'alert'} />
                        ))}
                        {!data && (
                            <p className="text-[#555] text-sm pl-6">Carregando eventos...</p>
                        )}
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
