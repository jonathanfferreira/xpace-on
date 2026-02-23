import Link from "next/link";
import { Play } from "lucide-react";
import { Top10Carousel } from "@/components/layout/top10-carousel";

export default function DashboardPage() {
    return (
        <div className="max-w-6xl mx-auto pb-20">
            {/* Header Panel */}
            <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="font-heading text-4xl mb-2 tracking-tight uppercase">Terminal <span className="text-transparent bg-clip-text text-gradient-neon">Alpha</span></h1>
                    <p className="text-[#888] font-sans">Bem-vindo(a) de volta. Seu progresso sincronizado.</p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-[#111] border border-[#222] px-4 py-2 rounded flex flex-col items-center justify-center min-w-[100px]">
                        <span className="text-secondary font-display text-2xl">1,240</span>
                        <span className="text-[10px] text-[#555] font-mono uppercase tracking-widest">XP Acumulado</span>
                    </div>
                    <div className="bg-[#111] border border-[#222] px-4 py-2 rounded flex flex-col items-center justify-center min-w-[100px]">
                        <span className="text-accent font-display text-2xl">04</span>
                        <span className="text-[10px] text-[#555] font-mono uppercase tracking-widest">Sequência (Dias)</span>
                    </div>
                </div>
            </div>

            {/* Continue Watching (HUD Style) */}
            <h2 className="font-display text-2xl mb-4 tracking-widest text-[#555] uppercase">Sessão Ativa</h2>

            <div className="group relative border border-[#222] bg-[#0A0A0A] hover:border-primary/50 transition-colors duration-500 rounded-sm overflow-hidden mb-12">
                {/* Neon accent line */}
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-neon z-10"></div>

                <div className="flex flex-col md:flex-row p-6 pl-8 gap-8 items-center relative z-20">
                    <div className="w-full md:w-64 h-36 bg-[#1A1A1A] relative border border-[#333] group-hover:border-primary/40 transition-colors flex shrink-0 items-center justify-center overflow-hidden">
                        {/* Thumbnail Placeholder */}
                        <div className="absolute inset-0 bg-[url('/images/bg-degrade.png')] bg-cover opacity-20 sepia contrast-150"></div>
                        <Play className="text-white/50 group-hover:text-white transition-colors relative z-10 w-12 h-12" />
                    </div>

                    <div className="flex-1 flex flex-col justify-center">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="bg-primary/10 text-primary border border-primary/20 text-[10px] font-mono uppercase px-2 py-0.5 tracking-widest">Módulo 02</span>
                            <span className="text-[#666] text-xs font-sans">Fundamentos Hip-Hop</span>
                        </div>
                        <h3 className="text-2xl font-bold font-heading text-white mb-2 uppercase">Bounces & Grooves Essenciais</h3>
                        <p className="text-[#888] text-sm mb-6 line-clamp-2 max-w-2xl">Treinamento mecânico e orgânico do bounce superior. Prática focada no eixo vertical e dissociação de ombros para preparo do aluno iniciante.</p>

                        <div className="flex items-center gap-6">
                            <Link href="/aula/mock-123" className="border border-white hover:bg-white hover:text-black transition-colors px-6 py-2 pb-1.5 text-sm font-sans font-bold flex items-center gap-2">
                                <Play size={16} fill="currentColor" /> RETOMAR TREINO
                            </Link>
                            <div className="flex-1 max-w-xs flex items-center gap-3">
                                <div className="h-1 flex-1 bg-[#222] rounded-full overflow-hidden">
                                    <div className="h-full bg-primary w-[45%]"></div>
                                </div>
                                <span className="text-xs font-mono text-[#666] tracking-widest">45%</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* HUD Decoration */}
                <div className="absolute top-2 right-2 flex gap-1">
                    <div className="w-1 h-1 bg-[#333]"></div>
                    <div className="w-1 h-1 bg-[#333]"></div>
                    <div className="w-1 h-1 bg-primary"></div>
                </div>
                <div className="absolute bottom-2 right-2 flex gap-1">
                    <div className="w-8 h-[2px] bg-[#222]"></div>
                </div>
            </div>

            {/* Feature 2.5: Ranking de Aulas Populares (Top 10) */}
            <Top10Carousel />

        </div>
    );
}
