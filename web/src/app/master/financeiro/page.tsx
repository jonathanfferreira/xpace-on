'use client';

import { DollarSign, TrendingUp, CreditCard, ArrowDownRight, ArrowUpRight } from 'lucide-react';

export default function MasterFinancePage() {
    // Mock Data for Finance
    const transactions = [
        { id: 'tx-001', school: 'Urban Stars Studio', amount: 49.90, type: 'subscription', date: '25 Fev 2026, 14:30', status: 'completed' },
        { id: 'tx-002', school: 'HipHop Masterclass', amount: 99.00, type: 'single_purchase', date: '25 Fev 2026, 11:15', status: 'completed' },
        { id: 'tx-003', school: 'Afro Vibes', amount: 49.90, type: 'subscription', date: '24 Fev 2026, 18:45', status: 'failed' },
        { id: 'tx-004', school: 'BreakLife Academy', amount: 149.90, type: 'subscription_annual', date: '24 Fev 2026, 09:10', status: 'completed' },
        { id: 'tx-005', school: 'Urban Stars Studio', amount: -4200.00, type: 'withdrawal', date: '23 Fev 2026, 10:00', status: 'completed' },
    ];

    return (
        <div className="space-y-8 animate-fade-in pb-20">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-display font-bold text-white uppercase tracking-wider mb-2">
                    HUB FINANCEIRO (ASAAS)
                </h1>
                <p className="text-[#888] font-mono text-sm uppercase tracking-widest">
                    Controle de Cashflow, Splits e Repasses
                </p>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-6 rounded relative overflow-hidden group hover:border-[#333] transition-colors">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <DollarSign size={64} className="text-red-500" />
                    </div>
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-[#888] font-sans text-sm font-medium">Saldo Disponível (Plataforma)</h3>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-white text-3xl font-bold font-mono">R$ 21.786</span>
                        <span className="text-green-500 text-xs font-bold">+15% vs mês ant.</span>
                    </div>
                </div>

                <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-6 rounded relative overflow-hidden group hover:border-[#333] transition-colors">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-[#888] font-sans text-sm font-medium">A Receber (D+30)</h3>
                        <TrendingUp size={18} className="text-[#666]" />
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-white text-3xl font-bold font-mono">R$ 14.250</span>
                    </div>
                </div>

                <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-6 rounded relative overflow-hidden group hover:border-[#333] transition-colors">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-[#888] font-sans text-sm font-medium">Hold Revenue (Saques Pedentes)</h3>
                        <CreditCard size={18} className="text-[#666]" />
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-white text-3xl font-bold font-mono">R$ 8.500</span>
                    </div>
                </div>
            </div>

            {/* Transactions List */}
            <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded">
                <div className="p-6 border-b border-[#1a1a1a] flex justify-between items-center">
                    <h2 className="text-white font-bold font-heading uppercase tracking-wide">ÚLTIMAS TRANSAÇÕES</h2>
                    <button className="text-xs text-red-500 hover:text-white transition-colors bg-red-500/10 px-3 py-1.5 rounded uppercase font-bold tracking-wider">
                        Sincronizar Asaas
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#111] text-[#666] text-xs uppercase font-mono tracking-widest">
                                <th className="p-4 font-normal">Transação</th>
                                <th className="p-4 font-normal">Escola/Prof.</th>
                                <th className="p-4 font-normal">Tipo</th>
                                <th className="p-4 font-normal">Data</th>
                                <th className="p-4 font-normal text-right">Valor</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm font-sans divide-y divide-[#1a1a1a]">
                            {transactions.map((tx) => (
                                <tr key={tx.id} className="hover:bg-[#111] transition-colors group">
                                    <td className="p-4 text-[#888] font-mono">{tx.id}</td>
                                    <td className="p-4 text-white font-medium">{tx.school}</td>
                                    <td className="p-4 text-[#888] capitalize">
                                        {tx.type === 'subscription' && 'Assinatura'}
                                        {tx.type === 'single_purchase' && 'Avulso'}
                                        {tx.type === 'subscription_annual' && 'Anual'}
                                        {tx.type === 'withdrawal' && <span className="text-red-500 font-medium tracking-wide">Saque Efetuado</span>}
                                    </td>
                                    <td className="p-4 text-[#666]">{tx.date}</td>
                                    <td className="p-4 text-right font-mono font-bold flex items-center justify-end gap-2">
                                        {tx.amount > 0 ? (
                                            <ArrowUpRight size={14} className="text-green-500" />
                                        ) : (
                                            <ArrowDownRight size={14} className="text-red-500" />
                                        )}
                                        <span className={tx.amount > 0 ? 'text-green-500' : 'text-red-500'}>
                                            R$ {Math.abs(tx.amount).toFixed(2).replace('.', ',')}
                                        </span>
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
