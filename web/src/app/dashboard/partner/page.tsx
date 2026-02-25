'use client';

import { useState } from 'react';
import { Rocket, DollarSign, Users, LayoutDashboard, CheckCircle2, ArrowRight } from 'lucide-react';
import Image from 'next/image';

export default function PartnerProgramPage() {
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Em um cenário real, aqui criaríamos um registro 'pending_school' no banco de dados.
        // E engatilharia um alerta pro Painel Master.
        setIsSubmitted(true);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-12 animate-fade-in pb-20">
            {/* Header / Hero */}
            <div className="relative rounded-2xl overflow-hidden border border-[#222] bg-[#050505] pt-12 px-6 pb-6 md:px-12 md:py-16 text-center isolate">
                <div className="absolute inset-0 bg-gradient-to-b from-red-500/10 to-transparent z-0"></div>
                <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-red-500/50 to-transparent"></div>

                <div className="relative z-10 flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
                        <Rocket className="text-red-500" size={32} />
                    </div>
                    <h1 className="text-3xl md:text-5xl font-display font-bold text-white uppercase tracking-wider mb-4">
                        XPACE <span className="text-red-500">PARTNER</span>
                    </h1>
                    <p className="text-[#888] md:text-lg max-w-2xl font-sans mb-8">
                        Seja dono do seu próprio pedaço na pista. Transforme seus alunos presenciais em globais,
                        crie assinaturas, cursos avulsos e tenha seu próprio Studio Manager.
                    </p>
                    <a href="#application-form" className="bg-red-500 text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-red-600 transition-colors shadow-[0_0_20px_rgba(239,68,68,0.4)] flex items-center gap-2">
                        Quero Ser um Professor <ArrowRight size={16} />
                    </a>
                </div>
            </div>

            {/* Benefits Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-6 rounded-xl hover:border-red-500/30 transition-colors group">
                    <DollarSign className="text-red-500 mb-4 group-hover:scale-110 transition-transform" size={28} />
                    <h3 className="text-white font-bold font-heading uppercase tracking-wide mb-2">Monetização Direta</h3>
                    <p className="text-[#666] text-sm leading-relaxed">Venda assinaturas mensais ou masterclasses avulsas. O dinheiro cai direto na sua conta operada pelo Asaas (Gateway).</p>
                </div>
                <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-6 rounded-xl hover:border-red-500/30 transition-colors group">
                    <LayoutDashboard className="text-red-500 mb-4 group-hover:scale-110 transition-transform" size={28} />
                    <h3 className="text-white font-bold font-heading uppercase tracking-wide mb-2">Studio Dashboard</h3>
                    <p className="text-[#666] text-sm leading-relaxed">Você ganha acesso à aba secreta /studio. Lá você faz upload de aulas criptografadas (Anti-Pirataria) e gere seus alunos.</p>
                </div>
                <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-6 rounded-xl hover:border-red-500/30 transition-colors group">
                    <Users className="text-red-500 mb-4 group-hover:scale-110 transition-transform" size={28} />
                    <h3 className="text-white font-bold font-heading uppercase tracking-wide mb-2">Comunidade Global</h3>
                    <p className="text-[#666] text-sm leading-relaxed">Seu catálogo ficará exposto para toda a rede XPACE, permitindo que dançarinos do mundo inteiro descubram sua didática.</p>
                </div>
            </div>

            {/* Application Form */}
            <div id="application-form" className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-6 md:p-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                {isSubmitted ? (
                    <div className="text-center py-12 relative z-10 flex flex-col items-center">
                        <div className="w-20 h-20 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center mb-6">
                            <CheckCircle2 className="text-green-500" size={40} />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Solicitação Recebida!</h2>
                        <p className="text-[#888] mb-6 max-w-md">
                            Nossa equipe de curadoria master está analisando seu perfil. Quando você for aprovado, seu
                            Painel Studio será ativado automaticamente e você receberá um e-mail de boas vindas.
                        </p>
                        <button
                            onClick={() => setIsSubmitted(false)}
                            className="text-red-500 underline text-sm hover:text-white"
                        >
                            Enviar outra solicitação
                        </button>
                    </div>
                ) : (
                    <div className="relative z-10">
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-white font-display uppercase tracking-wide mb-2">Formulário de Inscrição</h2>
                            <p className="text-[#666]">Preencha os dados abaixo para a curadoria do CEO.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-mono text-[#888] uppercase mb-2">Nome da Escola ou Prof. (Artístico)</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Ex: Urban Dynamics"
                                        className="w-full bg-[#111] border border-[#222] rounded-lg p-3.5 text-white font-sans text-sm focus:outline-none focus:border-red-500/50 transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-mono text-[#888] uppercase mb-2">Instagram (Para Curadoria)</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="@seu.instagram"
                                        className="w-full bg-[#111] border border-[#222] rounded-lg p-3.5 text-white font-sans text-sm focus:outline-none focus:border-red-500/50 transition-colors"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-mono text-[#888] uppercase mb-2">Link de Vídeo (Opcional - YouTube, TikTok, Drive)</label>
                                <input
                                    type="url"
                                    placeholder="https://"
                                    className="w-full bg-[#111] border border-[#222] rounded-lg p-3.5 text-white font-sans text-sm focus:outline-none focus:border-red-500/50 transition-colors"
                                />
                                <p className="text-[#555] text-xs mt-2">Um link mostrando você ou seus alunos dançando acelera o processo.</p>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-4 mt-8 flex items-center justify-center gap-2 bg-red-500 text-white font-bold uppercase tracking-widest rounded-lg hover:bg-red-600 transition-colors"
                            >
                                Enviar para Curadoria
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}
