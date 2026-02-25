'use client';

import { ShieldCheck, Server, AlertTriangle, Key } from 'lucide-react';

export default function MasterSecurityPage() {
    const logs = [
        { id: 'log-01', type: 'access', desc: 'Sessão revogada do e-mail carla@teste.com (Motivo: IP Suspeito)', time: 'Há 5 minutos', severity: 'medium' },
        { id: 'log-02', type: 'system', desc: 'Webhook da Bunny.net falhou ao processar vídeo vid_9x2b. Retentativa agendada.', time: 'Há 12 minutos', severity: 'high' },
        { id: 'log-03', type: 'financial', desc: 'Asaas: Pagamento Aprovado (R$ 49,90) - Escola: HipHop Masterclass', time: 'Há 45 minutos', severity: 'low' },
        { id: 'log-04', type: 'access', desc: 'Super Usuário (admin) logou no Painel Mestre.', time: 'Há 2 horas', severity: 'low' },
        { id: 'log-05', type: 'system', desc: 'Supabase SSR Edge Middleware recompilado pela Vercel.', time: 'Há 4 horas', severity: 'low' },
    ];

    return (
        <div className="space-y-8 animate-fade-in pb-20">
            <div>
                <h1 className="text-3xl font-display font-bold text-white uppercase tracking-wider mb-2">
                    AUDITORIA & LOGS DO SISTEMA
                </h1>
                <p className="text-[#888] font-mono text-sm uppercase tracking-widest">
                    Visão de Segurança, Webhooks e Ações Restritas
                </p>
            </div>

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
            </div>

            <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded overflow-hidden">
                <div className="p-6 border-b border-[#1a1a1a] flex justify-between items-center bg-[#111]">
                    <h2 className="text-white font-bold font-heading uppercase tracking-wide">LOG DE EVENTOS (ÚLTIMAS 24H)</h2>
                    <span className="text-xs font-mono text-[#666]">15.241 Linhas Capturadas</span>
                </div>

                <ul className="divide-y divide-[#1a1a1a]">
                    {logs.map((log) => (
                        <li key={log.id} className="p-4 flex gap-4 hover:bg-[#111] transition-colors items-start">
                            <div className="mt-1 shrink-0">
                                {log.severity === 'high' && <AlertTriangle size={16} className="text-amber-500" />}
                                {log.severity === 'medium' && <ShieldCheck size={16} className="text-red-500" />}
                                {log.severity === 'low' && <span className="block w-2 h-2 rounded-full bg-blue-500 mt-1"></span>}
                            </div>
                            <div className="flex-1">
                                <p className={`font-sans text-sm ${log.severity === 'high' ? 'text-amber-500' : 'text-white'}`}>
                                    {log.desc}
                                </p>
                                <p className="text-[#666] text-xs font-mono mt-1">{log.time} • Tipo: {log.type}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
