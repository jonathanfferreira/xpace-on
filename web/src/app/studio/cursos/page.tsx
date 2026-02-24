import { Plus, Search, Video, MoreVertical, Edit2, Trash2 } from "lucide-react";
import Link from "next/link";

export default function StudioCoursesPage() {
    return (
        <div className="max-w-6xl mx-auto pb-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-white uppercase tracking-tight mb-2">Editor de Cursos</h1>
                    <p className="text-[#888] font-sans text-sm">Gerencie suas Séries, Módulos e ordene suas Aulas para entrega aos alunos.</p>
                </div>
                <Link
                    href="/studio/cursos/novo"
                    className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded font-mono text-sm uppercase tracking-wider font-bold transition-all"
                >
                    <Plus size={18} /> Novo Curso
                </Link>
            </div>

            {/* Filters */}
            <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-4 rounded flex flex-col sm:flex-row gap-4 mb-8">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555]" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar curso por título..."
                        className="w-full bg-[#111] border border-[#222] rounded py-2 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-primary/50 transition-colors"
                    />
                </div>
                <div className="flex gap-2">
                    <select className="bg-[#111] border border-[#222] rounded py-2 px-4 text-[#888] text-sm focus:outline-none cursor-pointer hover:border-[#333]">
                        <option>Todos os Status</option>
                        <option>Publicados</option>
                        <option>Rascunhos</option>
                    </select>
                </div>
            </div>

            {/* Courses List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <CourseCard
                    title="Danças Urbanas Básico"
                    modules={4}
                    lessons={24}
                    status="Publicado"
                    coverUrl="/images/bg-degrade.png"
                />
                <CourseCard
                    title="Mecânica Avançada do Footwork"
                    modules={2}
                    lessons={12}
                    status="Publicado"
                    coverUrl="/images/bg-degrade.png"
                />
                <CourseCard
                    title="Waacking Coreográfico"
                    modules={0}
                    lessons={0}
                    status="Rascunho"
                    coverUrl="/images/bg-degrade.png"
                />
            </div>
        </div>
    );
}

function CourseCard({ title, modules, lessons, status, coverUrl }: any) {
    const isDraft = status === 'Rascunho';

    return (
        <div className="bg-[#0a0a0a] border border-[#1a1a1a] hover:border-[#333] transition-colors rounded-sm overflow-hidden group flex flex-col">
            <div className="h-40 relative bg-[#111] border-b border-[#1a1a1a] overflow-hidden">
                <div className="absolute inset-0 bg-cover bg-center opacity-30 group-hover:scale-105 transition-transform duration-700" style={{ backgroundImage: `url(${coverUrl})` }}></div>

                <div className="absolute top-3 left-3 flex gap-2">
                    <span className={`text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded border ${isDraft ? 'bg-[#1a1a1a] text-[#888] border-[#333]' : 'bg-primary/20 text-primary border-primary/30'}`}>
                        {status}
                    </span>
                </div>

                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="w-8 h-8 bg-black/80 backdrop-blur rounded flex items-center justify-center text-white hover:text-primary transition-colors border border-white/10">
                        <MoreVertical size={16} />
                    </button>
                </div>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                    <h3 className="font-heading font-bold text-white text-lg uppercase tracking-wide leading-tight mb-3">{title}</h3>

                    <div className="flex items-center gap-4 text-xs font-sans text-[#666] mb-4">
                        <span className="flex items-center gap-1.5"><Video size={14} /> {modules} Módulos</span>
                        <span className="flex items-center gap-1.5"><PlayCircle size={14} className="text-[#444]" /> {lessons} Aulas</span>
                    </div>
                </div>

                <div className="pt-4 border-t border-[#1a1a1a] flex justify-between items-center">
                    <button className="text-xs font-mono text-[#888] hover:text-white uppercase tracking-widest flex items-center gap-1">
                        <Edit2 size={12} /> Editar
                    </button>
                    <button className="text-xs font-mono text-accent/50 hover:text-accent uppercase tracking-widest flex items-center gap-1">
                        <Trash2 size={12} /> Excluir
                    </button>
                </div>
            </div>
        </div>
    );
}

import { PlayCircle } from "lucide-react";
