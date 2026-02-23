'use client'

import { useState } from 'react'
import { User, Mail, Camera, Save, Shield } from 'lucide-react'
import Image from 'next/image'

export default function PerfilPage() {
    const [fullName, setFullName] = useState('Jonathan Ferreira')
    const [email] = useState('fferreira.jonathan@gmail.com')
    const [saving, setSaving] = useState(false)

    const handleSave = async () => {
        setSaving(true)
        await new Promise(r => setTimeout(r, 1500))
        setSaving(false)
    }

    return (
        <div className="max-w-3xl mx-auto pb-20">
            <div className="mb-10">
                <h1 className="font-heading text-4xl mb-2 tracking-tight uppercase">
                    <span className="text-transparent bg-clip-text text-gradient-neon">Identidade</span>
                </h1>
                <p className="text-[#888] font-sans">Gerencie seu perfil e informações de conta.</p>
            </div>

            {/* Avatar Section */}
            <div className="bg-[#0A0A0A] border border-[#222] rounded-sm p-6 mb-6">
                <div className="flex items-center gap-6">
                    <div className="relative group cursor-pointer">
                        <div className="w-20 h-20 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center overflow-hidden">
                            <span className="font-heading text-2xl text-primary uppercase">JF</span>
                        </div>
                        <div className="absolute inset-0 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Camera size={20} className="text-white" />
                        </div>
                    </div>
                    <div>
                        <h2 className="font-heading text-xl text-white uppercase">{fullName}</h2>
                        <p className="text-xs font-sans text-[#666]">{email}</p>
                        <div className="flex items-center gap-1 mt-1">
                            <Shield size={12} className="text-emerald-400" />
                            <span className="text-[10px] font-sans text-emerald-400">Conta verificada via Google</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Form */}
            <div className="bg-[#0A0A0A] border border-[#222] rounded-sm p-6 mb-6 space-y-5">
                <h2 className="font-heading text-lg uppercase tracking-widest text-white mb-4">Dados Pessoais</h2>

                <div className="space-y-2">
                    <label className="font-sans text-sm font-medium text-white/70">Nome Completo</label>
                    <div className="relative">
                        <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#555]" />
                        <input
                            type="text"
                            value={fullName}
                            onChange={e => setFullName(e.target.value)}
                            className="w-full bg-[#050505] border border-surface focus:border-primary rounded-lg pl-10 pr-4 py-3 font-sans text-white outline-none transition-colors focus:ring-1 focus:ring-primary"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="font-sans text-sm font-medium text-white/70">E-mail</label>
                    <div className="relative">
                        <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#555]" />
                        <input
                            type="email"
                            value={email}
                            disabled
                            className="w-full bg-[#050505] border border-surface rounded-lg pl-10 pr-4 py-3 font-sans text-[#666] outline-none cursor-not-allowed"
                        />
                    </div>
                    <p className="text-[10px] font-sans text-[#444]">E-mail vinculado via OAuth. Não pode ser alterado.</p>
                </div>
            </div>

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
    )
}
