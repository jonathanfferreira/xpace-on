import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";

// Mock baseado no Retorno SQL da RPC 'get_top_10_lessons'
const MOCK_TOP_10 = [
    { id: 1, title: "Dissociação de Ombros", course: "Fundamentos Hip-Hop", views: "14.2k" },
    { id: 2, title: "Rocking Básico", course: "Fundamentos Hip-Hop", views: "12.8k" },
    { id: 3, title: "Footwork Patterns 01", course: "Breakdance Origin", views: "9.5k" },
    { id: 4, title: "Chest Pops & Hits", course: "Popping Mastery", views: "8.1k" },
    { id: 5, title: "O que é o Bounce?", course: "Fundamentos Hip-Hop", views: "7.9k" },
    { id: 6, title: "Gliding & Slides", course: "Illusion Styles", views: "6.4k" },
    { id: 7, title: "Six Step Tutorial", course: "Breakdance Origin", views: "5.2k" },
    { id: 8, title: "Isolamento Completo", course: "Popping Mastery", views: "4.8k" },
    { id: 9, title: "Party Machine", course: "Fundamentos Hip-Hop", views: "3.9k" },
    { id: 10, title: "Top Rock Variations", course: "Breakdance Origin", views: "3.1k" },
];

export function Top10Carousel() {
    return (
        <div className="w-full mt-16 mb-8">
            <div className="flex items-center gap-3 mb-6">
                <h2 className="font-heading text-2xl tracking-tighter uppercase text-white">Top 10 Brasil Hoje</h2>
                <div className="bg-primary/20 border border-primary/50 text-primary text-[10px] uppercase tracking-widest px-2 py-0.5 font-bold">Em Alta</div>
            </div>

            <div className="flex overflow-x-auto pb-8 -mx-6 px-6 lg:-mx-10 lg:px-10 gap-x-8 lg:gap-x-12 no-scrollbar snap-x snap-mandatory">
                {MOCK_TOP_10.map((lesson, index) => (
                    <Link
                        href={`/dashboard/aula/${lesson.id}`}
                        key={lesson.id}
                        className="relative shrink-0 w-[280px] h-[160px] group snap-start block"
                    >
                        {/* O Grande Número de Fundo Estilo Netflix */}
                        <div className="absolute -left-8 -bottom-6 font-display text-[150px] leading-none text-[#1A1A1A] group-hover:text-[#252525] transition-colors z-0 select-none drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]" style={{ WebkitTextStroke: '2px #333' }}>
                            {index + 1}
                        </div>

                        {/* Thumbnail Box */}
                        <div className="absolute right-0 top-0 w-[220px] h-[140px] bg-[#0A0A0A] border border-[#222] group-hover:border-primary/60 transition-colors rounded-sm overflow-hidden z-10 flex flex-col justify-end p-4">
                            {/* Fundo degradê Fake */}
                            <div className="absolute inset-0 bg-[url('/images/bg-degrade.png')] bg-cover opacity-20 sepia contrast-150 grayscale group-hover:grayscale-0 transition-all duration-500"></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>

                            <div className="relative z-20 flex items-end justify-between">
                                <div>
                                    <p className="text-[10px] text-primary font-mono uppercase tracking-widest mb-1">{lesson.course}</p>
                                    <h3 className="text-white font-sans font-bold leading-tight line-clamp-2">{lesson.title}</h3>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shrink-0 ml-2 group-hover:bg-primary group-hover:border-primary transition-all">
                                    <Play size={14} className="text-white ml-0.5" fill="currentColor" />
                                </div>
                            </div>
                        </div>

                        {/* Tag de Views (Simulando Popularidade) */}
                        <div className="absolute right-2 -top-3 z-20 bg-secondary text-black font-bold text-[10px] px-2 py-0.5 uppercase tracking-widest shadow-[0_0_10px_#eb00bc]">
                            {lesson.views} Views
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
