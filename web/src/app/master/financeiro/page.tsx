import { DollarSign, TrendingUp, CreditCard, ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function getFinanceData() {
    const { data: transactions } = await supabaseAdmin
        .from('transactions')
        .select(`
            id, amount, status, payment_method, created_at,
            users:user_id(full_name, email),
            courses:course_id(title, tenants:tenant_id(name))
        `)
        .order('created_at', { ascending: false })
        .limit(50);

    const rows = transactions || [];
    const confirmed = rows.filter((t: any) => t.status === 'confirmed');
    const pending = rows.filter((t: any) => t.status === 'pending');
    const gmv = confirmed.reduce((acc: number, t: any) => acc + Number(t.amount), 0);
    const pendingTotal = pending.reduce((acc: number, t: any) => acc + Number(t.amount), 0);
    const platformRevenue = gmv * 0.10;

    return { transactions: rows, gmv, pendingTotal, platformRevenue };
}

export default async function MasterFinancePage() {
    const { transactions, gmv, pendingTotal, platformRevenue } = await getFinanceData();
    const fmt = (v: number) => v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    return (
        <div className="space-y-8 animate-fade-in pb-20">
            <div>
                <h1 className="text-3xl font-display font-bold text-white uppercase tracking-wider mb-2">HUB FINANCEIRO</h1>
                <p className="text-[#888] font-mono text-sm uppercase tracking-widest">Controle de Cashflow, Splits e Repasses</p>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-6 rounded hover:border-[#333] transition-colors">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-[#888] font-sans text-sm font-medium">GMV Confirmado</h3>
                        <DollarSign size={18} className="text-[#333]" />
                    </div>
                    <span className="text-white text-3xl font-bold font-mono">R$ {fmt(gmv)}</span>
                    <p className="text-xs text-[#555] font-mono mt-2">{transactions.filter((t: any) => t.status === 'confirmed').length} transações confirmadas</p>
                </div>

                <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-6 rounded hover:border-[#333] transition-colors">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-[#888] font-sans text-sm font-medium">Receita da Plataforma (10%)</h3>
                        <TrendingUp size={18} className="text-[#333]" />
                    </div>
                    <span className="text-white text-3xl font-bold font-mono">R$ {fmt(platformRevenue)}</span>
                    <p className="text-xs text-[#555] font-mono mt-2">Split sobre GMV confirmado</p>
                </div>

                <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-6 rounded hover:border-[#333] transition-colors">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-[#888] font-sans text-sm font-medium">Pendente (aguardando)</h3>
                        <CreditCard size={18} className="text-[#333]" />
                    </div>
                    <span className="text-white text-3xl font-bold font-mono">R$ {fmt(pendingTotal)}</span>
                    <p className="text-xs text-[#555] font-mono mt-2">{transactions.filter((t: any) => t.status === 'pending').length} pagamentos pendentes</p>
                </div>
            </div>

            {/* Transactions table */}
            <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded">
                <div className="p-6 border-b border-[#1a1a1a] flex justify-between items-center">
                    <h2 className="text-white font-bold font-heading uppercase tracking-wide">ÚLTIMAS TRANSAÇÕES</h2>
                    <span className="text-xs text-[#555] font-mono">{transactions.length} registros</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#111] text-[#666] text-xs uppercase font-mono tracking-widest">
                                <th className="p-4 font-normal">Aluno</th>
                                <th className="p-4 font-normal">Curso / Escola</th>
                                <th className="p-4 font-normal">Método</th>
                                <th className="p-4 font-normal">Data</th>
                                <th className="p-4 font-normal">Status</th>
                                <th className="p-4 font-normal text-right">Valor</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm font-sans divide-y divide-[#1a1a1a]">
                            {transactions.length === 0 ? (
                                <tr><td colSpan={6} className="p-8 text-center text-[#555]">Nenhuma transação encontrada.</td></tr>
                            ) : (transactions as any[]).map((tx) => (
                                <tr key={tx.id} className="hover:bg-[#111] transition-colors">
                                    <td className="p-4">
                                        <p className="text-white text-sm">{tx.users?.full_name || 'Usuário'}</p>
                                        <p className="text-[#666] text-xs font-mono">{tx.users?.email}</p>
                                    </td>
                                    <td className="p-4">
                                        <p className="text-white text-sm">{tx.courses?.title || '—'}</p>
                                        <p className="text-[#666] text-xs">{tx.courses?.tenants?.name || '—'}</p>
                                    </td>
                                    <td className="p-4 text-[#888] font-mono text-xs uppercase">
                                        {tx.payment_method === 'pix' ? 'PIX' : tx.payment_method === 'credit' ? 'Crédito' : tx.payment_method || '—'}
                                    </td>
                                    <td className="p-4 text-[#666] font-mono text-xs">
                                        {new Date(tx.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                                    </td>
                                    <td className="p-4">
                                        <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${
                                            tx.status === 'confirmed' ? 'text-green-400 border-green-400/30 bg-green-400/10' :
                                            tx.status === 'pending'   ? 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10' :
                                            tx.status === 'overdue'   ? 'text-orange-400 border-orange-400/30 bg-orange-400/10' :
                                            'text-red-400 border-red-400/30 bg-red-400/10'
                                        }`}>
                                            {tx.status === 'confirmed' ? 'Confirmado' :
                                             tx.status === 'pending'   ? 'Pendente' :
                                             tx.status === 'overdue'   ? 'Vencido' :
                                             tx.status === 'mock'      ? 'Mock/Teste' : tx.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right font-mono font-bold">
                                        <div className="flex items-center justify-end gap-1">
                                            {tx.status === 'confirmed'
                                                ? <ArrowUpRight size={14} className="text-green-500" />
                                                : <ArrowDownRight size={14} className="text-[#555]" />}
                                            <span className={tx.status === 'confirmed' ? 'text-green-400' : 'text-[#888]'}>
                                                R$ {fmt(Number(tx.amount))}
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
