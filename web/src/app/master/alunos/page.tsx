'use client';

import { Users, Search, Filter, ShieldCheck, UserX } from 'lucide-react';

export default function MasterStudentsPage() {
    const students = [
        { id: 'al-01', name: 'Laura Oliveira', email: 'laura@email.com', level: 'Intermediário', since: '10 Jan 2026', status: 'Ativo', totalSpent: 299.90 },
        { id: 'al-02', name: 'Thiago Mendes', email: 'thiago.m@email.com', level: 'Avançado', since: '05 Fev 2026', status: 'Ativo', totalSpent: 49.90 },
        { id: 'al-03', name: 'Amanda Souza', email: 'amanda.s@email.com', level: 'Básico', since: '20 Fev 2026', status: 'Inativo', totalSpent: 0 },
        { id: 'al-04', name: 'Carlos Roberto', email: 'cr.dança@email.com', level: 'Master', since: '01 Dez 2025', status: 'Ativo', totalSpent: 890.50 },
    ];

    return (
        <div className="space-y-8 animate-fade-in pb-20">
            <div>
                <h1 className="text-3xl font-display font-bold text-white uppercase tracking-wider mb-2">
                    ALUNOS GLOBAIS
                </h1>
                <p className="text-[#888] font-mono text-sm uppercase tracking-widest">
                    Visão Geral de todos os consumidores da Plataforma
                </p>
            </div>

            <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666]" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar aluno por nome, email ou ID..."
                        className="w-full bg-[#111] border border-[#222] rounded-full py-2 pl-10 pr-4 text-sm text-white placeholder:text-[#555] focus:outline-none focus:border-red-500/50 transition-colors"
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-[#222] bg-[#111] text-[#888] rounded-full text-sm font-medium hover:text-white hover:border-[#333] transition-colors">
                        <Filter size={16} /> Filtros Avançados
                    </button>
                    <button className="flex-1 md:flex-none bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider hover:bg-red-600 transition-colors">
                        Exportar CSV
                    </button>
                </div>
            </div>

            <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#111] text-[#666] text-xs uppercase font-mono tracking-widest border-b border-[#222]">
                                <th className="p-4 font-normal">Aluno</th>
                                <th className="p-4 font-normal">Nível XP</th>
                                <th className="p-4 font-normal hidden md:table-cell">Membro Desde</th>
                                <th className="p-4 font-normal">Status LTV</th>
                                <th className="p-4 font-normal text-right">Ações Globais</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm font-sans divide-y divide-[#1a1a1a]">
                            {students.map((aluno) => (
                                <tr key={aluno.id} className="hover:bg-[#111] transition-colors group">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-[#222] flex items-center justify-center font-bold text-[#888] font-mono text-xs">
                                                {aluno.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-white font-medium">{aluno.name}</p>
                                                <p className="text-[#666] text-xs font-mono">{aluno.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-[#888] font-medium">{aluno.level}</td>
                                    <td className="p-4 text-[#666] hidden md:table-cell font-mono text-xs">{aluno.since}</td>
                                    <td className="p-4 font-mono font-bold">
                                        <span className="text-[#888] block text-xs">Total: R$ {aluno.totalSpent.toFixed(2)}</span>
                                        <span className={`text-xs ${aluno.status === 'Ativo' ? 'text-green-500' : 'text-red-500'}`}>{aluno.status}</span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="p-2 text-[#666] hover:text-white hover:bg-[#222] rounded transition-colors" title="Ver Perfil Global">
                                                <Users size={16} />
                                            </button>
                                            <button className="p-2 text-[#666] hover:text-red-500 hover:bg-red-500/10 rounded transition-colors" title="Banir Aluno (Quebra Termos)">
                                                <UserX size={16} />
                                            </button>
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
