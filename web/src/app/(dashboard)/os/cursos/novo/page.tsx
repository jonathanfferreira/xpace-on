'use client'

import { useState } from 'react'
import { Upload, Plus, Trash2, GripVertical, Save, ImageIcon } from 'lucide-react'

interface Module {
    id: string
    name: string
    lessons: Lesson[]
}

interface Lesson {
    id: string
    title: string
    videoFile: string | null
}

export default function UploadCoursePage() {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [price, setPrice] = useState('349.90')
    const [modules, setModules] = useState<Module[]>([
        {
            id: 'mod-1',
            name: 'Módulo 01',
            lessons: [{ id: 'les-1', title: '', videoFile: null }]
        }
    ])
    const [saving, setSaving] = useState(false)

    const addModule = () => {
        const newId = `mod-${Date.now()}`
        setModules([...modules, {
            id: newId,
            name: `Módulo ${String(modules.length + 1).padStart(2, '0')}`,
            lessons: [{ id: `les-${Date.now()}`, title: '', videoFile: null }]
        }])
    }

    const addLesson = (moduleId: string) => {
        setModules(modules.map(m => m.id === moduleId ? {
            ...m,
            lessons: [...m.lessons, { id: `les-${Date.now()}`, title: '', videoFile: null }]
        } : m))
    }

    const removeModule = (moduleId: string) => {
        if (modules.length <= 1) return
        setModules(modules.filter(m => m.id !== moduleId))
    }

    const removeLesson = (moduleId: string, lessonId: string) => {
        setModules(modules.map(m => m.id === moduleId ? {
            ...m,
            lessons: m.lessons.filter(l => l.id !== lessonId)
        } : m))
    }

    const updateModuleName = (moduleId: string, name: string) => {
        setModules(modules.map(m => m.id === moduleId ? { ...m, name } : m))
    }

    const updateLessonTitle = (moduleId: string, lessonId: string, title: string) => {
        setModules(modules.map(m => m.id === moduleId ? {
            ...m,
            lessons: m.lessons.map(l => l.id === lessonId ? { ...l, title } : l)
        } : m))
    }

    const handleSave = async () => {
        setSaving(true)
        // TODO: Integrar com Supabase para salvar curso, módulos e aulas
        await new Promise(r => setTimeout(r, 1500))
        setSaving(false)
        alert('Curso salvo com sucesso! (Mock)')
    }

    return (
        <div className="max-w-4xl mx-auto pb-20">
            {/* Header */}
            <div className="mb-10">
                <h1 className="font-heading text-4xl mb-2 tracking-tight uppercase">
                    Criar <span className="text-transparent bg-clip-text text-gradient-neon">Curso</span>
                </h1>
                <p className="text-[#888] font-sans">Monte a estrutura do seu treinamento e publique para seus alunos.</p>
            </div>

            {/* Course Info */}
            <div className="bg-[#0A0A0A] border border-[#222] rounded-sm p-6 mb-6">
                <h2 className="font-heading text-lg uppercase tracking-widest text-white mb-6">Informações do Curso</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Thumbnail */}
                    <div className="md:row-span-2 flex flex-col items-center justify-center border-2 border-dashed border-[#333] rounded-sm p-6 text-center hover:border-primary/50 transition-colors cursor-pointer group">
                        <ImageIcon size={40} className="text-[#444] group-hover:text-primary transition-colors mb-3" />
                        <p className="text-xs font-sans text-[#555] group-hover:text-[#888] transition-colors">
                            Clique para enviar a thumbnail do curso
                        </p>
                        <p className="text-[10px] font-sans text-[#444] mt-1">1280×720 recomendado</p>
                    </div>

                    {/* Title */}
                    <div className="md:col-span-2 space-y-2">
                        <label className="font-sans text-sm font-medium text-white/70">Título do Curso</label>
                        <input
                            type="text"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            placeholder="Ex: Fundamentos Hip-Hop"
                            className="w-full bg-[#050505] border border-surface focus:border-primary rounded-lg px-4 py-3 font-sans text-white placeholder:text-[#555] outline-none transition-colors focus:ring-1 focus:ring-primary"
                        />
                    </div>

                    {/* Description & Price */}
                    <div className="space-y-2">
                        <label className="font-sans text-sm font-medium text-white/70">Descrição</label>
                        <textarea
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            placeholder="Descreva o conteúdo do curso..."
                            rows={3}
                            className="w-full bg-[#050505] border border-surface focus:border-secondary rounded-lg px-4 py-3 font-sans text-white placeholder:text-[#555] outline-none transition-colors focus:ring-1 focus:ring-secondary resize-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="font-sans text-sm font-medium text-white/70">Preço (Mínimo R$39,90)</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#555] font-sans text-sm">R$</span>
                            <input
                                type="number"
                                value={price}
                                onChange={e => setPrice(e.target.value)}
                                min="39.90"
                                step="0.01"
                                className="w-full bg-[#050505] border border-surface focus:border-accent rounded-lg pl-10 pr-4 py-3 font-sans text-white outline-none transition-colors focus:ring-1 focus:ring-accent"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Modules & Lessons */}
            <div className="space-y-4 mb-8">
                <div className="flex items-center justify-between">
                    <h2 className="font-heading text-lg uppercase tracking-widest text-white">Módulos & Aulas</h2>
                    <button
                        onClick={addModule}
                        className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 text-primary font-sans text-xs font-medium rounded hover:bg-primary/20 transition-colors"
                    >
                        <Plus size={14} /> Adicionar Módulo
                    </button>
                </div>

                {modules.map((mod, modIdx) => (
                    <div key={mod.id} className="bg-[#0A0A0A] border border-[#222] rounded-sm overflow-hidden">
                        {/* Module Header */}
                        <div className="flex items-center gap-3 p-4 border-b border-[#1a1a1a] bg-[#080808]">
                            <GripVertical size={16} className="text-[#444] cursor-grab" />
                            <input
                                type="text"
                                value={mod.name}
                                onChange={e => updateModuleName(mod.id, e.target.value)}
                                className="flex-1 bg-transparent border-none font-heading text-white uppercase tracking-widest text-sm outline-none"
                            />
                            <button
                                onClick={() => removeModule(mod.id)}
                                className="text-[#444] hover:text-red-400 transition-colors p-1"
                                disabled={modules.length <= 1}
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>

                        {/* Lessons */}
                        <div className="p-4 space-y-3">
                            {mod.lessons.map((lesson, lesIdx) => (
                                <div key={lesson.id} className="flex items-center gap-3">
                                    <span className="text-[10px] font-mono text-[#555] w-6 text-center">{String(lesIdx + 1).padStart(2, '0')}</span>
                                    <input
                                        type="text"
                                        value={lesson.title}
                                        onChange={e => updateLessonTitle(mod.id, lesson.id, e.target.value)}
                                        placeholder={`Título da Aula ${lesIdx + 1}`}
                                        className="flex-1 bg-[#050505] border border-[#1a1a1a] focus:border-primary/50 rounded px-3 py-2 font-sans text-sm text-white placeholder:text-[#444] outline-none transition-colors"
                                    />
                                    <button className="flex items-center gap-1 px-3 py-2 bg-[#111] border border-[#222] text-[#666] hover:text-white font-sans text-xs rounded transition-colors">
                                        <Upload size={12} /> Vídeo
                                    </button>
                                    <button
                                        onClick={() => removeLesson(mod.id, lesson.id)}
                                        className="text-[#444] hover:text-red-400 transition-colors p-1"
                                    >
                                        <Trash2 size={12} />
                                    </button>
                                </div>
                            ))}

                            <button
                                onClick={() => addLesson(mod.id)}
                                className="flex items-center gap-1 text-[#555] hover:text-primary font-sans text-xs transition-colors mt-2"
                            >
                                <Plus size={12} /> Adicionar Aula
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Save Button */}
            <button
                onClick={handleSave}
                disabled={saving}
                className="w-full relative overflow-hidden rounded-lg bg-white text-black font-sans font-bold py-3.5 transition-transform duration-200 active:scale-[0.98] disabled:opacity-50"
            >
                <span className="relative z-10 flex items-center justify-center gap-2">
                    <Save size={18} />
                    {saving ? 'SALVANDO...' : 'PUBLICAR CURSO'}
                </span>
            </button>
        </div>
    )
}
