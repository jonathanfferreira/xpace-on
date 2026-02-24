'use client'

import { useState, useEffect } from 'react'
import { Bell, Moon, Globe, Shield, Monitor, Save } from 'lucide-react'

export default function ConfigPage() {
    const [notifications, setNotifications] = useState(true)
    const [darkMode, setDarkMode] = useState(true)
    const [language, setLanguage] = useState('pt-BR')
    const [antiPiracy, setAntiPiracy] = useState(true)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        // Inicializa estado visual com base no storage local
        const savedTheme = localStorage.getItem('xpace-theme')
        if (savedTheme === 'light') {
            setDarkMode(false)
            document.documentElement.classList.add('theme-light')
        }
    }, [])

    const handleSave = async () => {
        setSaving(true)

        // Simular salvamento
        await new Promise(r => setTimeout(r, 600))

        // Aplicar Inversão Visual ("Light Mode Cyberpunk")
        if (!darkMode) {
            document.documentElement.classList.add('theme-light')
            localStorage.setItem('xpace-theme', 'light')
        } else {
            document.documentElement.classList.remove('theme-light')
            localStorage.setItem('xpace-theme', 'dark')
        }

        setSaving(false)
        alert('As configurações do Holo-Deck foram sincronizadas para a sua conta!')
    }

    return (
        <div className="max-w-3xl mx-auto pb-20">
            <div className="mb-10">
                <h1 className="font-heading text-4xl mb-2 tracking-tight uppercase">
                    <span className="text-transparent bg-clip-text text-gradient-neon">Configuração</span>
                </h1>
                <p className="text-[#888] font-sans">Ajuste o comportamento e as preferências do sistema.</p>
            </div>

            <div className="space-y-4">
                {/* Notifications */}
                <SettingRow
                    icon={<Bell size={18} />}
                    label="Notificações"
                    description="Receber alertas de novos cursos e conquistas"
                    enabled={notifications}
                    onToggle={() => setNotifications(!notifications)}
                />

                {/* Dark Mode */}
                <SettingRow
                    icon={<Moon size={18} />}
                    label="Modo Escuro"
                    description="Interface cyberpunk padrão (recomendado)"
                    enabled={darkMode}
                    onToggle={() => setDarkMode(!darkMode)}
                />

                {/* Anti-Piracy */}
                <SettingRow
                    icon={<Shield size={18} />}
                    label="Sessão Única"
                    description="Bloquear acesso simultâneo em múltiplos dispositivos"
                    enabled={antiPiracy}
                    onToggle={() => setAntiPiracy(!antiPiracy)}
                />

                {/* Language */}
                <div className="bg-[#0A0A0A] border border-[#222] rounded-sm p-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-sm bg-[#111] border border-[#222] flex items-center justify-center text-primary">
                            <Globe size={18} />
                        </div>
                        <div>
                            <h3 className="font-heading text-sm uppercase tracking-widest text-white">Idioma</h3>
                            <p className="text-[10px] font-sans text-[#555]">Idioma da interface</p>
                        </div>
                    </div>
                    <select
                        value={language}
                        onChange={e => setLanguage(e.target.value)}
                        className="bg-[#111] border border-[#222] text-white font-sans text-xs px-3 py-2 rounded outline-none focus:border-primary"
                    >
                        <option value="pt-BR">Português (BR)</option>
                        <option value="en">English</option>
                        <option value="es">Español</option>
                    </select>
                </div>

                {/* Device Info */}
                <div className="bg-[#0A0A0A] border border-[#222] rounded-sm p-5">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-10 h-10 rounded-sm bg-[#111] border border-[#222] flex items-center justify-center text-accent">
                            <Monitor size={18} />
                        </div>
                        <div>
                            <h3 className="font-heading text-sm uppercase tracking-widest text-white">Dispositivo Atual</h3>
                            <p className="text-[10px] font-sans text-[#555]">Sessão ativa neste navegador</p>
                        </div>
                    </div>
                    <div className="bg-[#050505] border border-[#1a1a1a] rounded p-3 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-sans text-white">Windows • Chrome</p>
                            <p className="text-[10px] font-sans text-[#555]">Última atividade: Agora</p>
                        </div>
                        <span className="text-[10px] font-sans bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded">
                            Ativo
                        </span>
                    </div>
                </div>
            </div>

            <button
                onClick={handleSave}
                disabled={saving}
                className="w-full relative overflow-hidden rounded-lg bg-white text-black font-sans font-bold py-3.5 transition-transform duration-200 active:scale-[0.98] disabled:opacity-50 mt-6"
            >
                <span className="relative z-10 flex items-center justify-center gap-2">
                    <Save size={18} />
                    {saving ? 'SALVANDO...' : 'SALVAR CONFIGURAÇÕES'}
                </span>
            </button>
        </div>
    )
}

function SettingRow({ icon, label, description, enabled, onToggle }: {
    icon: React.ReactNode; label: string; description: string; enabled: boolean; onToggle: () => void
}) {
    return (
        <div className="bg-[#0A0A0A] border border-[#222] rounded-sm p-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-sm bg-[#111] border border-[#222] flex items-center justify-center text-primary">
                    {icon}
                </div>
                <div>
                    <h3 className="font-heading text-sm uppercase tracking-widest text-white">{label}</h3>
                    <p className="text-[10px] font-sans text-[#555]">{description}</p>
                </div>
            </div>
            <button
                onClick={onToggle}
                className={`relative w-11 h-6 rounded-full transition-colors ${enabled ? 'bg-primary' : 'bg-[#333]'}`}
            >
                <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform shadow-md ${enabled ? 'left-[22px]' : 'left-0.5'}`} />
            </button>
        </div>
    )
}
