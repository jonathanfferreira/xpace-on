"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, CheckCircle2, ChevronDown, ChevronUp, Lock } from "lucide-react";

// Fake Data: Perfil do Mestre
const MOCK_PROFESSOR = {
    name: "Ton Novaes",
    slug: "tonnovaes",
    role: "COREÓGRAFO & FUNDADOR",
    bio: "Com mais de 15 anos de mercado, Ton desenvolveu uma metodologia de ensino mecânico que permite qualquer pessoa dominar a base do Hip Hop com clareza, isolamento e controle absoluto.",
    brandColor: "#6324b2", // Roxo original do Brand Book
    avatarUrl: "https://xebvjxhdxyxoflmsvyzy.supabase.co/storage/v1/object/public/avatars/ton.jpg", // Fake Supabase bucket URL
};

// Fake Data: Treinamento Base (Cursos Dele)
const MOCK_COURSES = [
    {
        id: "course-123",
        title: "Fundamentos Hip-Hop",
        price: 349.90,
        installments: "12x de R$ 34,90",
        description: "Um mergulho extremo na base: Bounces, Grooves, Footworks e Isolamento Corporal.",
        thumbnail: "/images/bg-degrade.png",
        modules: [
            {
                title: "Modulo Base 1: Verticalidade",
                lessonsCount: 4,
                duration: "45 min"
            },
            {
                title: "Modulo Base 2: Grooves Inferiores",
                lessonsCount: 6,
                duration: "1h 20m"
            }
        ]
    }
];

export default function ProfessorProfilePage() {
    const [expandedCourse, setExpandedCourse] = useState<string | null>("course-123");

    const toggleCourse = (id: string) => {
        setExpandedCourse(expandedCourse === id ? null : id);
    };

    return (
        <div className="min-h-screen bg-[#050505] font-sans selection:bg-primary/30 text-white relative">
            {/* Background Cover Topo */}
            <div
                className="absolute top-0 left-0 w-full h-[500px] z-0 opacity-20 pointer-events-none"
                style={{
                    background: `radial-gradient(circle at center top, ${MOCK_PROFESSOR.brandColor}, transparent 70%)`
                }}
            ></div>

            {/* Container Tático e Geométrico (Sem Arredondamentos Fofos) */}
            <div className="max-w-4xl mx-auto px-6 py-20 relative z-10">

                {/* Header Identidade */}
                <div className="flex flex-col md:flex-row gap-8 items-center md:items-start mb-20 text-center md:text-left">
                    <div className="w-32 h-32 md:w-40 md:w-40 bg-[#111] border-2 flex items-center justify-center shrink-0 shadow-[0_0_40px_rgba(99,36,178,0.3)] relative overflow-hidden" style={{ borderColor: MOCK_PROFESSOR.brandColor }}>
                        {/* Fake Avatar Image Placeholder */}
                        <div className="absolute inset-0 bg-[#222]"></div>
                        <span className="relative z-10 font-heading text-4xl text-[#444]">TN</span>
                    </div>

                    <div className="flex-1 mt-2">
                        <div className="inline-block border border-white/20 px-3 py-1 mb-4 text-[10px] font-mono tracking-widest uppercase bg-white/5 backdrop-blur-sm">
                            {MOCK_PROFESSOR.role}
                        </div>
                        <h1 className="text-5xl md:text-6xl font-heading uppercase tracking-tight mb-4" style={{ color: MOCK_PROFESSOR.brandColor, WebkitTextStroke: '1px white' }}>
                            {MOCK_PROFESSOR.name}
                        </h1>
                        <p className="text-[#888] font-sans leading-relaxed text-lg max-w-2xl">
                            {MOCK_PROFESSOR.bio}
                        </p>
                    </div>
                </div>

                {/* Vitrine de Produtos (Anti-SaaS Bento Grid) */}
                <div>
                    <div className="flex items-center gap-4 mb-8">
                        <h2 className="text-3xl font-display uppercase tracking-widest text-[#555]">Treinamentos Originais</h2>
                        <div className="flex-1 h-[1px] bg-gradient-to-r from-[#222] to-transparent"></div>
                    </div>

                    <div className="flex flex-col gap-8">
                        {MOCK_COURSES.map((course) => (
                            <div key={course.id} className="bg-[#0a0a0a] border border-[#222] flex flex-col group overflow-hidden">

                                {/* Card Header (Thumbnail + CTA) */}
                                <div className="flex flex-col md:flex-row border-b border-[#222]">
                                    <div className="w-full md:w-[320px] h-[200px] bg-[#111] relative overflow-hidden shrink-0">
                                        <div className="absolute inset-0 bg-[url('/images/bg-degrade.png')] bg-cover opacity-30 contrast-125 sepia group-hover:scale-105 transition-transform duration-700"></div>
                                        <div className="absolute inset-0 border-[4px] border-transparent group-hover:border-primary/20 transition-colors z-10 pointer-events-none"></div>
                                        <Play className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 text-white/50 z-20" />
                                    </div>

                                    <div className="p-6 md:p-8 flex-1 flex flex-col justify-center">
                                        <h3 className="text-3xl font-heading uppercase text-white mb-2">{course.title}</h3>
                                        <p className="text-[#888] text-sm mb-6 max-w-md line-clamp-2">{course.description}</p>

                                        <div className="mt-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                            <div>
                                                <span className="block text-2xl font-display text-white">R$ {course.price.toFixed(2).replace('.', ',')}</span>
                                                <span className="text-[10px] font-mono text-[#666] uppercase tracking-widest">{course.installments}</span>
                                            </div>
                                            <Link
                                                href={`/checkout/${course.id}`}
                                                className="bg-white text-black font-bold px-8 py-3 text-sm uppercase tracking-wider hover:bg-primary hover:text-white transition-colors border border-transparent flex items-center gap-2"
                                            >
                                                Garantir Vaga <CheckCircle2 size={16} />
                                            </Link>
                                        </div>
                                    </div>
                                </div>

                                {/* Ementa do Curso (Acordeão HUD) */}
                                <div>
                                    <button
                                        onClick={() => toggleCourse(course.id)}
                                        className="w-full flex items-center justify-between p-4 bg-[#050505] hover:bg-[#111] transition-colors border-b border-[#1a1a1a] text-[#888] text-xs font-mono uppercase tracking-widest"
                                    >
                                        Ver Grade Curricular Completa
                                        {expandedCourse === course.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                    </button>

                                    {expandedCourse === course.id && (
                                        <div className="p-6 bg-[#080808]">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {course.modules.map((mod, idx) => (
                                                    <div key={idx} className="border border-[#1a1a1a] p-4 flex items-start gap-4 hover:border-[#333] transition-colors bg-[#0a0a0a]">
                                                        <span className="font-display text-2xl text-[#333] leading-none">{String(idx + 1).padStart(2, '0')}</span>
                                                        <div>
                                                            <h4 className="font-sans font-bold text-sm text-[#ccc] mb-1">{mod.title}</h4>
                                                            <div className="flex items-center gap-3 text-[10px] font-mono text-[#666] uppercase">
                                                                <span>{mod.lessonsCount} Aulas</span>
                                                                <span className="w-1 h-1 bg-[#333]"></span>
                                                                <span>{mod.duration}</span>
                                                                <Lock size={10} className="ml-auto" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
