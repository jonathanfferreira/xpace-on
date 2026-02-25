'use client';

import { Save, Sliders, Database, CreditCard, PlaySquare } from 'lucide-react';

export default function MasterConfigPage() {
    return (
        <div className="space-y-8 animate-fade-in pb-20">
            <div>
                <h1 className="text-3xl font-display font-bold text-white uppercase tracking-wider mb-2">
                    ENGINE DA PLATAFORMA
                </h1>
                <p className="text-[#888] font-mono text-sm uppercase tracking-widest">
                    Configurações Globais (Tech Params, Integrações)
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Asaas Config */}
                <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <CreditCard className="text-red-500" size={24} />
                        <h2 className="text-white font-bold font-heading uppercase tracking-wide">Painel Asaas</h2>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-mono text-[#888] uppercase mb-1">API Key (Production)</label>
                            <input type="password" value="********************************" readOnly className="w-full bg-[#111] border border-[#222] rounded p-3 text-white font-mono text-sm" />
                        </div>
                        <div>
                            <label className="block text-xs font-mono text-[#888] uppercase mb-1">Taxa de Split Padrão (XPACE ON)</label>
                            <input type="number" defaultValue="15" className="w-full bg-[#111] border border-[#222] rounded p-3 text-white font-mono text-sm" />
                            <p className="text-[#555] text-xs mt-1">Essa taxa (%) é deduzida de todas as vendas das Escolas automaticamente no Gateway.</p>
                        </div>
                        <button className="bg-[#111] border border-[#333] hover:bg-[#222] text-white px-4 py-2 rounded text-sm font-bold mt-2 transition-colors">
                            Salvar Split Global
                        </button>
                    </div>
                </div>

                {/* Bunny.net Config */}
                <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <PlaySquare className="text-red-500" size={24} />
                        <h2 className="text-white font-bold font-heading uppercase tracking-wide">Bunny.net (Video API)</h2>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-mono text-[#888] uppercase mb-1">Stream Library ID</label>
                            <input type="text" defaultValue="258384" className="w-full bg-[#111] border border-[#222] rounded p-3 text-white font-mono text-sm" />
                        </div>
                        <div>
                            <label className="block text-xs font-mono text-[#888] uppercase mb-1">Access Key</label>
                            <input type="password" value="********************************" readOnly className="w-full bg-[#111] border border-[#222] rounded p-3 text-white font-mono text-sm" />
                        </div>
                        <div className="flex items-center justify-between p-3 bg-red-500/10 border border-red-500/20 rounded mt-4">
                            <div>
                                <p className="text-white font-bold text-sm">HLS DRM Ativado</p>
                                <p className="text-red-500/80 text-xs">Vídeos criptografados contra download on-the-fly.</p>
                            </div>
                            <div className="w-10 h-6 bg-red-500 rounded-full flex items-center p-1">
                                <div className="w-4 h-4 bg-white rounded-full translate-x-4"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Gamificação Engine */}
                <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded p-6 lg:col-span-2">
                    <div className="flex items-center gap-3 mb-6">
                        <Sliders className="text-red-500" size={24} />
                        <h2 className="text-white font-bold font-heading uppercase tracking-wide">Engine de Gamificação e App</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-mono text-[#888] uppercase mb-1">XP Ganho por Aula Base</label>
                            <input type="number" defaultValue="50" className="w-full bg-[#111] border border-[#222] rounded p-3 text-white font-mono text-sm" />
                        </div>
                        <div>
                            <label className="block text-xs font-mono text-[#888] uppercase mb-1">Tolerância de PWA Offline (HLS)</label>
                            <select className="w-full bg-[#111] border border-[#222] rounded p-3 text-white font-mono text-sm outline-none">
                                <option>Desativado (Risco Pirataria Alto)</option>
                                <option>72 Horas Cache (Recomendado)</option>
                                <option>30 Dias (Netflix Style)</option>
                            </select>
                        </div>
                    </div>

                    <button className="w-full py-4 mt-8 flex items-center justify-center gap-2 bg-red-500 text-white font-bold uppercase tracking-widest rounded hover:bg-red-600 transition-colors">
                        <Save size={18} /> Salvar Parâmetros da Construção
                    </button>
                </div>
            </div>
        </div>
    );
}
