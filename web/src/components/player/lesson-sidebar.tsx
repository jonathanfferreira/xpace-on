import { CheckCircle2, PlayCircle, Lock } from "lucide-react";
import Link from "next/link";
import { type Module } from "@/lib/mock-data";

type LessonSidebarProps = {
    courseTitle: string;
    modules: Module[];
    isLinearProgression?: boolean;
};

export function LessonSidebar({ courseTitle, modules, isLinearProgression = false }: LessonSidebarProps) {
    const totalLessons = modules.reduce((acc, mod) => acc + mod.lessons.length, 0);
    const completedLessons = modules.reduce((acc, mod) => acc + mod.lessons.filter(l => l.isCompleted).length, 0);
    const progressPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    // Achatamento das aulas p/ descobrir o índice absoluto no curso todo (Cross-module locking)
    const allFlattenedLessons = modules.flatMap(m => m.lessons);

    return (
        <div className="w-full md:w-[380px] shrink-0 bg-[#050505] border-t md:border-t-0 md:border-l border-[#151515] h-auto md:h-[calc(100vh-64px)] overflow-visible md:overflow-y-auto no-scrollbar flex flex-col relative right-0 pb-10">

            {/* Sidebar Header */}
            <div className="p-6 border-b border-[#151515] sticky top-0 bg-[#050505]/95 backdrop-blur z-20">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-secondary glow-secondary"></div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#888]">Treinamento Base</span>
                </div>
                <h2 className="font-heading text-xl uppercase leading-tight">{courseTitle}</h2>

                {/* Overall Progress */}
                <div className="mt-4 flex items-center justify-between text-xs font-mono text-[#666] mb-1">
                    <span>Progresso</span>
                    <span className="text-primary">{progressPercent}%</span>
                </div>
                <div className="w-full h-1 bg-[#1a1a1a] overflow-hidden">
                    <div className="h-full bg-gradient-neon transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
                </div>
            </div>

            {/* Modules List */}
            <div className="p-4 flex flex-col gap-6">
                {modules.map((mod, index) => (
                    <div key={mod.id}>
                        <div className="flex items-center gap-3 mb-3 px-2">
                            <span className="text-primary font-display text-xl leading-none">{String(index + 1).padStart(2, '0')}</span>
                            <h3 className="font-sans font-bold text-white text-sm uppercase tracking-wide">{mod.title}</h3>
                        </div>

                        <div className="flex flex-col gap-1">
                            {mod.lessons.map((lesson, idx) => {
                                const isCompleted = lesson.isCompleted;
                                const isActive = lesson.isActive;

                                // Linear Progression Logic (Locking via Absolute Index)
                                const absoluteIdx = allFlattenedLessons.findIndex(l => l.id === lesson.id);
                                let isLocked = false;

                                if (isLinearProgression && absoluteIdx > 0) {
                                    // Se tem progressão linear ativada, o anterior precisa estar completo (no escopo de todas as aulas)
                                    const prevLesson = allFlattenedLessons[absoluteIdx - 1];
                                    if (!prevLesson.isCompleted) {
                                        isLocked = true;
                                    }
                                }

                                const content = (
                                    <>
                                        {/* Active HUD Indicator */}
                                        {isActive && (
                                            <div className="absolute left-0 top-0 h-full w-[2px] bg-primary glow-primary"></div>
                                        )}

                                        {/* Subtle hover gradient */}
                                        {!isLocked && (
                                            <div className="absolute inset-0 bg-gradient-to-r from-primary/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        )}

                                        <div className="shrink-0 mt-0.5 relative z-10">
                                            {isCompleted ? (
                                                <CheckCircle2 size={18} className="text-secondary" />
                                            ) : isLocked ? (
                                                <Lock size={18} className="text-[#333]" />
                                            ) : isActive ? (
                                                <div className="w-[18px] h-[18px] flex justify-center items-center">
                                                    <span className="absolute w-2.5 h-2.5 bg-primary rounded-full animate-ping opacity-75"></span>
                                                    <span className="relative w-2 h-2 bg-primary rounded-full"></span>
                                                </div>
                                            ) : (
                                                <PlayCircle size={18} className="text-[#444] group-hover:text-[#888] transition-colors" />
                                            )}
                                        </div>

                                        <div className="flex-1 relative z-10">
                                            <p className={`text-sm font-sans font-medium line-clamp-2 leading-snug mb-1 ${isActive ? 'text-white' : isCompleted ? 'text-[#888]' : 'text-[#666] group-hover:text-[#aaa]'}`}>
                                                {absoluteIdx + 1}. {lesson.title}
                                            </p>
                                        </div>
                                    </>
                                );

                                const className = `w-full text-left p-3 flex items-start gap-4 transition-all duration-300 relative group overflow-hidden border border-transparent ${isActive ? 'bg-[#111] border-[#333]' : isLocked ? 'opacity-50 cursor-not-allowed bg-transparent' : 'hover:bg-[#0a0a0a] hover:border-[#222] cursor-pointer'}`;

                                if (isLocked) {
                                    return (
                                        <div key={lesson.id} className={className}>
                                            {content}
                                        </div>
                                    )
                                }

                                return (
                                    <Link key={lesson.id} href={`/dashboard/aula/${lesson.id}`} className={className}>
                                        {content}
                                    </Link>
                                )
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
