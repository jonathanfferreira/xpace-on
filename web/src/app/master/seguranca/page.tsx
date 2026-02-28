import { createClient } from '@supabase/supabase-js';
import { ShieldCheck, Server, Key, UserPlus, CreditCard, AlertTriangle } from 'lucide-react';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function getRecentEvents() {
    const [{ data: recentUsers }, { data: recentTx }] = await Promise.all([
        supabaseAdmin
            .from('users')
            .select('id, email, full_name, role, created_at')
            .order('created_at', { ascending: false })
            .limit(4),
        supabaseAdmin
            .from('transactions')
            .select('id, amount, status, created_at, users:user_id(email), courses:course_id(title, tenants:tenant_id(name))')
            .order('created_at', { ascending: false })
            .limit(4),
    ]);

    const events: { id: string; desc: string; time: string; severity: string; type: string }[] = [];

    (recentUsers || []).forEach((u: any) => {
        events.push({
            id: `user-${u.id}`,
            type: 'access',
            desc: `Novo cadastro: ${u.full_name || u.email} (role: ${u.role})`,
            time: new Date(u.created_at).toLocaleString('pt-BR'),
            severity: 'low',
        });
    });

    (recentTx || []).forEach((t: any) => {
        const severity = t.status === 'confirmed' ? 'low' : t.status === 'failed' ? 'high' : 'medium';
        events.push({
            id: `tx-${t.id}`,
            type: 'financial',
            desc: `Transação ${t.status}: R$ ${Number(t.amount).toFixed(2)} — ${t.courses?.title || 'curso'} (${t.users?.email || '?'})`,
            time: new Date(t.created_at).toLocaleString('pt-BR'),
            severity,
        });
    });

    events.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
    return events.slice(0, 8);
}

async function getSystemCounts() {
    const [{ count: users }, { count: courses }, { count: transactions }] = await Promise.all([
        supabaseAdmin.from('users').select('id', { count: 'exact', head: true }),
        supabaseAdmin.from('courses').select('id', { count: 'exact', head: true }),
        supabaseAdmin.from('transactions').select('id', { count: 'exact', head: true }),
    ]);
    return { users: users || 0, courses: courses || 0, transactions: transactions || 0 };
}

export default async function MasterSecurityPage() {
    const [events, counts] = await Promise.all([getRecentEvents(), getSystemCounts()]);

    return (
        <div className="space-y-8 animate-fade-in pb-20">
            <div>
                <h1 className="text-3xl font-display font-bold text-white uppercase tracking-wider mb-2">
                    AUDITORIA & LOGS DO SISTEMA
                </h1>
                <p className="text-[#888] font-mono text-sm uppercase tracking-widest">
                    Visão de Segurança, Cadastros e Transações Recentes
                </p>
            </div>

            {/* Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded flex items-center gap-4">
                    <ShieldCheck className="text-red-500 shrink-0" size={24} />
                    <div>
                        <p className="text-white font-bold font-mono">RBAC Firewall</p>
                        <p className="text-red-500/80 text-xs font-bold uppercase tracking-widest">ATIVO E BLINDADO</p>
                    </div>
                </div>
                <div className="bg-[#111] border border-[#222] p-4 rounded flex items-center gap-4">
                    <Server className="text-[#888] shrink-0" size={24} />
                    <div>
                        <p className="text-white font-bold font-mono">Bunny.net API</p>
                        <p className="text-green-500 text-xs font-bold uppercase tracking-widest">OPERACIONAL</p>
                    </div>
                </div>
                <div className="bg-[#111] border border-[#222] p-4 rounded flex items-center gap-4">
                    <Key className="text-[#888] shrink-0" size={24} />
                    <div>
                        <p className="text-white font-bold font-mono">Asaas Webhooks</p>
                        <p className="text-green-500 text-xs font-bold uppercase tracking-widest">CONECTADO</p>
                    </div>
                </div>
                <div className="bg-[#111] border border-[#222] p-4 rounded">
                    <p className="text-[#555] text-xs font-mono uppercase tracking-widest mb-1">Registros no BD</p>
                    <p className="text-white text-sm font-mono">{counts.users} usuários · {counts.courses} cursos · {counts.transactions} transações</p>
                </div>
            </div>

            {/* Event Log */}
            <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded overflow-hidden">
                <div className="p-6 border-b border-[#1a1a1a] flex justify-between items-center bg-[#111]">
                    <h2 className="text-white font-bold font-heading uppercase tracking-wide">EVENTOS RECENTES (BANCO DE DADOS)</h2>
                    <span className="text-xs font-mono text-[#666]">{events.length} eventos</span>
                </div>

                {events.length === 0 ? (
                    <div className="p-10 text-center text-[#555] text-sm">Nenhum evento recente.</div>
                ) : (
                    <ul className="divide-y divide-[#1a1a1a]">
                        {events.map((log) => (
                            <li key={log.id} className="p-4 flex gap-4 hover:bg-[#111] transition-colors items-start">
                                <div className="mt-1 shrink-0">
                                    {log.severity === 'high' && <AlertTriangle size={16} className="text-amber-500" />}
                                    {log.severity === 'medium' && <CreditCard size={16} className="text-yellow-500" />}
                                    {log.severity === 'low' && log.type === 'access' && <UserPlus size={16} className="text-blue-400" />}
                                    {log.severity === 'low' && log.type === 'financial' && <span className="block w-2 h-2 rounded-full bg-green-500 mt-1" />}
                                </div>
                                <div className="flex-1">
                                    <p className={`font-sans text-sm ${log.severity === 'high' ? 'text-amber-500' : 'text-white'}`}>
                                        {log.desc}
                                    </p>
                                    <p className="text-[#666] text-xs font-mono mt-1">{log.time} · tipo: {log.type}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
