'use client'

import { useState } from 'react'
import { Palette, Type, Upload, Save, Eye } from 'lucide-react'
import Image from 'next/image'

const PRESET_COLORS = [
    '#6324b2', '#eb00bc', '#ff5200', '#00d4aa', '#2563eb',
    '#dc2626', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6',
]

export default function WhiteLabelPage() {
    const [brandColor, setBrandColor] = useState('#6324b2')
    const [schoolName, setSchoolName] = useState('')
    const [customColor, setCustomColor] = useState('#6324b2')
    const [saving, setSaving] = useState(false)

    const handleSave = async () => {
        setSaving(true)
        // TODO: Update tenant in Supabase with brand_color and logo_url
        await new Promise(r => setTimeout(r, 1500))
        setSaving(false)
        alert('Configurações de marca salvas! (Mock)')
    }

    return (
        <div className="max-w-4xl mx-auto pb-20">
            {/* Header */}
            <div className="mb-10">
                <h1 className="font-heading text-4xl mb-2 tracking-tight uppercase">
                    White <span className="text-transparent bg-clip-text text-gradient-neon">Label</span>
                </h1>
                <p className="text-[#888] font-sans">Personalize o visual do ambiente dos seus alunos com sua identidade.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Configuration Panel */}
                <div className="space-y-6">
                    {/* Logo Upload */}
                    <div className="bg-[#0A0A0A] border border-[#222] rounded-sm p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Type size={18} className="text-primary" />
                            <h2 className="font-heading text-lg uppercase tracking-widest text-white">Logo & Nome</h2>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="font-sans text-sm font-medium text-white/70">Nome da Escola / Studio</label>
                                <input
                                    type="text"
                                    value={schoolName}
                                    onChange={e => setSchoolName(e.target.value)}
                                    placeholder="Ex: Dance Academy BR"
                                    className="w-full bg-[#050505] border border-surface focus:border-primary rounded-lg px-4 py-3 font-sans text-white placeholder:text-[#555] outline-none transition-colors focus:ring-1 focus:ring-primary"
                                />
                            </div>

                            <div className="flex flex-col items-center justify-center border-2 border-dashed border-[#333] rounded-sm p-8 text-center hover:border-primary/50 transition-colors cursor-pointer group">
                                <Upload size={32} className="text-[#444] group-hover:text-primary transition-colors mb-2" />
                                <p className="text-xs font-sans text-[#555]">Enviar logo personalizado</p>
                                <p className="text-[10px] font-sans text-[#444] mt-1">PNG transparente, 512×512</p>
                            </div>
                        </div>
                    </div>

                    {/* Brand Color */}
                    <div className="bg-[#0A0A0A] border border-[#222] rounded-sm p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Palette size={18} className="text-secondary" />
                            <h2 className="font-heading text-lg uppercase tracking-widest text-white">Cor Primária</h2>
                        </div>

                        <div className="grid grid-cols-5 gap-3 mb-4">
                            {PRESET_COLORS.map(color => (
                                <button
                                    key={color}
                                    onClick={() => { setBrandColor(color); setCustomColor(color) }}
                                    className={`w-full aspect-square rounded-sm border-2 transition-all duration-200 hover:scale-110 ${brandColor === color ? 'border-white scale-105' : 'border-transparent'}`}
                                    style={{ backgroundColor: color }}
                                />
                            ))}
                        </div>

                        <div className="flex items-center gap-3">
                            <label className="font-sans text-xs text-[#666]">Personalizado:</label>
                            <input
                                type="color"
                                value={customColor}
                                onChange={e => { setCustomColor(e.target.value); setBrandColor(e.target.value) }}
                                className="w-10 h-10 border border-[#333] bg-transparent rounded cursor-pointer"
                            />
                            <input
                                type="text"
                                value={customColor.toUpperCase()}
                                onChange={e => { setCustomColor(e.target.value); setBrandColor(e.target.value) }}
                                className="flex-1 bg-[#050505] border border-[#222] rounded px-3 py-2 font-mono text-xs text-white outline-none"
                            />
                        </div>
                    </div>

                    {/* Save */}
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="w-full relative overflow-hidden rounded-lg bg-white text-black font-sans font-bold py-3.5 transition-transform duration-200 active:scale-[0.98] disabled:opacity-50"
                    >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            <Save size={18} />
                            {saving ? 'SALVANDO...' : 'SALVAR IDENTIDADE'}
                        </span>
                    </button>
                </div>

                {/* Live Preview */}
                <div className="bg-[#0A0A0A] border border-[#222] rounded-sm p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <Eye size={18} className="text-accent" />
                        <h2 className="font-heading text-lg uppercase tracking-widest text-white">Preview ao Vivo</h2>
                    </div>

                    {/* Mini App Preview */}
                    <div className="bg-[#050505] border border-[#1a1a1a] rounded overflow-hidden">
                        {/* Mini Topbar */}
                        <div className="h-10 flex items-center px-4 border-b border-[#1a1a1a]" style={{ borderBottomColor: brandColor + '40' }}>
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-5 rounded-full" style={{ backgroundColor: brandColor }} />
                                <span className="text-xs font-heading text-white uppercase tracking-widest">
                                    {schoolName || 'Sua Escola'}
                                </span>
                            </div>
                        </div>

                        {/* Mini Content */}
                        <div className="p-4 space-y-3">
                            <div className="w-full h-24 bg-[#111] rounded flex items-center justify-center">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: brandColor + '30', border: `1px solid ${brandColor}50` }}>
                                    <span style={{ color: brandColor }} className="text-xs">▶</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="h-3 rounded-full w-3/4" style={{ backgroundColor: brandColor + '20' }} />
                                <div className="h-2 bg-[#1a1a1a] rounded-full w-1/2" />
                            </div>

                            <div className="flex gap-2">
                                <div className="h-7 px-3 rounded text-[10px] font-sans font-medium flex items-center text-white" style={{ backgroundColor: brandColor }}>
                                    Assistir Aula
                                </div>
                                <div className="h-7 px-3 rounded text-[10px] font-sans flex items-center border text-[#666]" style={{ borderColor: brandColor + '40' }}>
                                    Ver Módulos
                                </div>
                            </div>
                        </div>
                    </div>

                    <p className="text-[10px] font-sans text-[#444] text-center mt-4">
                        Preview de como seus alunos verão o ambiente personalizado
                    </p>
                </div>
            </div>
        </div>
    )
}
