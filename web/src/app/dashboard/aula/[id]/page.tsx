import { VideoPlayer } from "@/components/player/video-player";
import { LessonSidebar } from "@/components/player/lesson-sidebar";
import { MOCK_COURSE } from "@/lib/mock-data";
import { Heart, Share2, AlertTriangle } from "lucide-react";
import { CommunityBoard } from "@/components/community/community-board";

export default function AulaPage() {
    return (
        <div className="flex flex-col md:flex-row min-h-[calc(100vh-64px)] -mx-6 lg:-mx-10 -my-6 lg:-my-10 bg-black overflow-hidden relative">

            {/* Background Ambience */}
            <div className="absolute top-0 right-1/4 w-[800px] h-[800px] bg-secondary/10 rounded-full blur-[180px] pointer-events-none"></div>

            {/* Esquerda: Player e Comunidade */}
            <div className="flex-1 flex flex-col pt-0 md:pt-4 px-0 md:px-6 relative z-10 overflow-y-auto no-scrollbar h-[calc(100vh-64px)]">

                {/* Container do Vídeo */}
                <div className="w-full max-w-5xl mx-auto shadow-2xl rounded-sm overflow-hidden ring-1 ring-[#222]">
                    <VideoPlayer />
                </div>

                {/* Metadados da Aula e Interações Base */}
                <div className="w-full max-w-5xl mx-auto mt-6 px-4 md:px-0 mb-10">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="font-mono text-xs uppercase tracking-widest text-primary border border-primary/20 bg-primary/5 px-2 py-0.5">Módulo 02</span>
                                <span className="text-[#666] font-display uppercase tracking-widest text-sm">Aula 01</span>
                            </div>
                            <h1 className="text-3xl font-heading font-bold uppercase tracking-tight text-white mb-3">
                                Dissociação de Ombros
                            </h1>
                            <p className="text-[#888] font-sans text-sm leading-relaxed max-w-3xl">
                                Nesta aula avançada, vamos dissecar a mecânica da dissociação superior. O objetivo não é apenas mover os ombros, mas criar a ilusão de que seu peito está isolado em relação ao restante do corpo.
                            </p>
                        </div>

                        {/* Ações Sociais / Relatórios */}
                        <div className="flex items-center gap-3 md:gap-4 shrink-0 border-t md:border-t-0 border-[#222] pt-4 md:pt-0">
                            <button className="flex flex-col items-center justify-center w-14 h-14 bg-[#111] border border-[#222] hover:border-primary/50 text-[#888] hover:text-white transition-colors group">
                                <Heart size={20} className="mb-1 group-hover:fill-secondary group-hover:text-secondary transition-colors" />
                                <span className="text-[10px] font-mono tracking-widest">342</span>
                            </button>
                            <button className="flex flex-col items-center justify-center w-14 h-14 bg-[#111] border border-[#222] hover:border-primary/50 text-[#888] hover:text-white transition-colors">
                                <Share2 size={20} className="mb-1" />
                            </button>
                            <button className="flex flex-col items-center justify-center w-14 h-14 bg-[#111] border border-[#222] hover:border-[#ff3300]/50 text-[#888] hover:text-[#ff3300] transition-colors">
                                <AlertTriangle size={20} className="mb-1" />
                            </button>
                        </div>
                    </div>

                    <div className="mt-4 border-t border-[#1a1a1a]">
                        <CommunityBoard />
                    </div>
                </div>
            </div>

            {/* Direita: Sidebar (Módulos e Aulas) */}
            <LessonSidebar courseTitle={MOCK_COURSE.title} modules={MOCK_COURSE.modules} />
        </div>
    );
}
