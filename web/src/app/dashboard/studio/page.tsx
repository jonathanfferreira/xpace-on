import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { LayoutDashboard, Users, Video, DollarSign, Settings, Lock } from 'lucide-react';
import Link from 'next/link';

export default async function CreatorStudioPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    // Camada de Segurança Server-Side: Verifica se o usuário é dono de uma "Escola (Tenant)" ATIVA.
    // Se um aluno comum tentar acessar /dashboard/studio, ele toma um Kick invisível de volta pro /dashboard.
    const { data: tenant } = await supabase
        .from('tenants')
        .select('*')
        .eq('owner_id', user.id)
        .eq('status', 'active')
        .single();

    if (!tenant) {
        // Redireciona usuários não autorizados para a página onde aplica para ser parceiro
        redirect('/dashboard/partner');
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-20">
            {/* Header / Security Banner */}
            <div className="bg-[#0A0A0A] border border-[#222] rounded-2xl p-6 md:p-8 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="absolute top-0 right-0 p-32 bg-green-500/5 blur-[100px] rounded-full pointer-events-none"></div>

                <div className="relative z-10 flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center shrink-0">
                        <Lock className="text-green-500" size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-display font-bold text-white uppercase tracking-wider mb-1">
                            Creator <span className="text-primary">Studio</span>
                        </h1>
                        <p className="text-[#888] font-sans text-sm">
                            Área Restrita. Você está logado na escola <span className="text-white font-bold">{tenant.name}</span>.
                        </p>
                    </div>
                </div>

                <div className="relative z-10 text-right w-full md:w-auto">
                    <p className="text-[10px] text-green-500 font-mono uppercase tracking-widest mb-1">Status da Escola</p>
                    <div className="inline-flex items-center gap-2 bg-green-500/10 text-green-500 px-3 py-1 rounded-full text-xs font-bold border border-green-500/20">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        ONLINE E OPERANTE
                    </div>
                </div>
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Link href="/dashboard/studio/cursos" className="bg-[#0A0A0A] border border-[#222] hover:border-primary/50 transition-colors rounded-xl p-5 flex flex-col group">
                    <div className="w-10 h-10 rounded-lg bg-[#111] group-hover:bg-primary/10 flex items-center justify-center mb-4 transition-colors">
                        <Video size={20} className="text-[#888] group-hover:text-primary transition-colors" />
                    </div>
                    <h3 className="text-white font-heading font-bold uppercase mb-1">Cursos & Aulas</h3>
                    <p className="text-[#555] text-xs font-sans">Gerencie seus uploads (DRM Automático).</p>
                </Link>

                <Link href="/dashboard/studio/alunos" className="bg-[#0A0A0A] border border-[#222] hover:border-blue-500/50 transition-colors rounded-xl p-5 flex flex-col group">
                    <div className="w-10 h-10 rounded-lg bg-[#111] group-hover:bg-blue-500/10 flex items-center justify-center mb-4 transition-colors">
                        <Users size={20} className="text-[#888] group-hover:text-blue-500 transition-colors" />
                    </div>
                    <h3 className="text-white font-heading font-bold uppercase mb-1">Meus Alunos</h3>
                    <p className="text-[#555] text-xs font-sans">Acompanhe engajamento e gamificação.</p>
                </Link>

                <Link href="/dashboard/studio/financeiro" className="bg-[#0A0A0A] border border-[#222] hover:border-green-500/50 transition-colors rounded-xl p-5 flex flex-col group">
                    <div className="w-10 h-10 rounded-lg bg-[#111] group-hover:bg-green-500/10 flex items-center justify-center mb-4 transition-colors">
                        <DollarSign size={20} className="text-[#888] group-hover:text-green-500 transition-colors" />
                    </div>
                    <h3 className="text-white font-heading font-bold uppercase mb-1">Financeiro</h3>
                    <p className="text-[#555] text-xs font-sans">Relatórios Asaas e Split de Pagamentos.</p>
                </Link>

                <Link href="/dashboard/studio/config" className="bg-[#0A0A0A] border border-[#222] hover:border-[#666] transition-colors rounded-xl p-5 flex flex-col group">
                    <div className="w-10 h-10 rounded-lg bg-[#111] group-hover:bg-[#222] flex items-center justify-center mb-4 transition-colors">
                        <Settings size={20} className="text-[#888] group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="text-white font-heading font-bold uppercase mb-1">Configurações</h3>
                    <p className="text-[#555] text-xs font-sans">Dados da escola e Chave Pix Recebedora.</p>
                </Link>
            </div>

            {/* Empty State / Notice */}
            <div className="border border-dashed border-[#333] rounded-2xl p-12 text-center mt-8">
                <LayoutDashboard className="mx-auto text-[#444] mb-4" size={48} />
                <h3 className="text-white font-heading text-lg uppercase mb-2">Seu Studio de Criação</h3>
                <p className="text-[#666] text-sm max-w-md mx-auto line-height-[1.6]">
                    Esta é uma prévia do seu ambiente restrito. Como a sua escola <strong>{tenant.name}</strong> está validada com a plataforma XTAGE, apenas você e os usuários que você delegar permissão podem acessar os dados financeiros e conteúdo desta URL.
                </p>
            </div>
        </div>
    );
}
