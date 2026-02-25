import { Search, Plus, Filter, MoreVertical, ShieldCheck, Ban, Edit2, PlayCircle } from "lucide-react";

export default function MasterSchoolsPage() {
    return (
        <div className="max-w-7xl mx-auto pb-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-white uppercase tracking-tight mb-2">Escolas & Criadores</h1>
                    <p className="text-[#888] font-sans text-sm">Gerencie os Inquilinos Multi-Tenant, aprovações, bloqueios master e Split Asaas.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 bg-[#111] hover:bg-[#1a1a1a] border border-[#222] text-white px-5 py-2.5 rounded font-mono text-sm uppercase tracking-wider font-bold transition-all">
                        <Filter size={18} /> Filtrar
                    </button>
                    <button className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded font-mono text-sm uppercase tracking-wider font-bold transition-all shadow-[0_0_15px_rgba(220,38,38,0.5)]">
                        <Plus size={18} /> Cadastrar Escola
                    </button>
                </div>
            </div>

            {/* Listagem Table UI */}
            <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-sm overflow-hidden">
                <div className="p-4 border-b border-[#1a1a1a] flex gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555]" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar inquilino por nome ou ID..."
                            className="w-full bg-[#111] border border-[#222] rounded py-2 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-red-500/50 transition-colors"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#111] border-b border-[#222] text-xs font-mono uppercase tracking-widest text-[#888]">
                                <th className="p-4 font-normal">Inquilino (Escola)</th>
                                <th className="p-4 font-normal">Master Owner</th>
                                <th className="p-4 font-normal">Cursos</th>
                                <th className="p-4 font-normal">GMV Mês</th>
                                <th className="p-4 font-normal">Status Asaas</th>
                                <th className="p-4 font-normal text-right">Controles</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm font-sans divide-y divide-[#1a1a1a]">
                            <SchoolRow
                                name="Urban Stars Studio"
                                id="TENANT_982A"
                                owner="Rafael Carvalho"
                                courses={4}
                                gmv="R$ 12.450"
                                status="active"
                            />
                            <SchoolRow
                                name="Footwork Academy Pro"
                                id="TENANT_B441"
                                owner="Mestre Carlos"
                                courses={1}
                                gmv="R$ 890"
                                status="pending"
                            />
                            <SchoolRow
                                name="Waacking Brasil"
                                id="TENANT_772C"
                                owner="Gaby Dance"
                                courses={12}
                                gmv="R$ 34.200"
                                status="active"
                            />
                            <SchoolRow
                                name="HipHop Basics Online"
                                id="TENANT_X009"
                                owner="João Silva"
                                courses={2}
                                gmv="R$ 0"
                                status="suspended"
                            />
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function SchoolRow({ name, id, owner, courses, gmv, status }: any) {
    return (
        <tr className="hover:bg-[#111] transition-colors group">
            <td className="p-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-[#1a1a1a] border border-[#222] flex items-center justify-center shrink-0">
                        <span className="text-[#666] font-heading font-bold">{name.substring(0, 2).toUpperCase()}</span>
                    </div>
                    <div>
                        <p className="font-bold text-white">{name}</p>
                        <p className="text-[10px] text-[#666] font-mono">{id}</p>
                    </div>
                </div>
            </td>
            <td className="p-4 text-[#aaa]">{owner}</td>
            <td className="p-4 text-[#aaa] flex items-center gap-2 mt-2"><PlayCircle size={14} /> {courses}</td>
            <td className="p-4 font-display font-medium text-white">{gmv}</td>
            <td className="p-4">
                {status === 'active' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-green-500/10 text-green-500 text-xs font-mono uppercase tracking-widest border border-green-500/20"><ShieldCheck size={14} /> Ativo (Split OK)</span>}
                {status === 'pending' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-yellow-500/10 text-yellow-500 text-xs font-mono uppercase tracking-widest border border-yellow-500/20">Criando Sub-Conta</span>}
                {status === 'suspended' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-red-500/10 text-red-500 text-xs font-mono uppercase tracking-widest border border-red-500/20"><Ban size={14} /> Supenso</span>}
            </td>
            <td className="p-4 text-right">
                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 text-[#888] hover:text-white hover:bg-[#222] rounded transition-colors" title="Editar Contrato">
                        <Edit2 size={16} />
                    </button>
                    <button className="p-2 text-red-500/70 hover:text-red-500 hover:bg-red-500/10 rounded transition-colors" title="Suspender Operação">
                        <Ban size={16} />
                    </button>
                </div>
            </td>
        </tr>
    );
}
