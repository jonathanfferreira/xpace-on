import Link from 'next/link';
import Image from 'next/image';
import { Home, PlaySquare, Award, User, Settings, LogOut, BarChart3 } from 'lucide-react';

export function Sidebar() {
    return (
        <aside className="w-[80px] hover:w-[240px] transition-all duration-300 group h-screen bg-[#020202] border-r border-[#151515] flex flex-col fixed left-0 top-0 z-50">

            {/* Brand Icon / Logo */}
            <div className="h-16 flex items-center justify-center border-b border-[#151515] overflow-hidden">
                <div className="w-8 shrink-0 flex items-center justify-center opacity-100 group-hover:opacity-0 transition-opacity absolute">
                    <Image src="/images/xpace-logo-branca.png" alt="X" width={24} height={24} className="object-contain" />
                </div>
                <div className="w-[180px] shrink-0 opacity-0 group-hover:opacity-100 transition-opacity flex justify-center ml-2 relative">
                    <Image src="/images/xpace-logo-branca.png" alt="XPACE" width={120} height={32} className="object-contain" />
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-6 flex flex-col gap-2 px-3 overflow-y-auto no-scrollbar">

                <SidebarItem href="/dashboard" icon={<Home size={20} />} label="Holo-Deck" active />
                <SidebarItem href="/dashboard/cursos" icon={<PlaySquare size={20} />} label="Meus Acessos" />
                <SidebarItem href="/dashboard/conquistas" icon={<Award size={20} />} label="Conquistas" />

                <div className="my-4 border-t border-[#1a1a1a] mx-2"></div>
                <div className="px-4 text-[10px] uppercase tracking-widest text-[#444] font-display opacity-0 group-hover:opacity-100 transition-opacity mb-2">Sistema</div>

                <SidebarItem href="/dashboard/perfil" icon={<User size={20} />} label="Identidade" />
                <SidebarItem href="/dashboard/config" icon={<Settings size={20} />} label="Configuração" />

                <div className="my-4 border-t border-[#1a1a1a] mx-2"></div>
                <div className="px-4 text-[10px] uppercase tracking-widest text-[#444] font-display opacity-0 group-hover:opacity-100 transition-opacity mb-2">Criador</div>

                <SidebarItem href="/dashboard/os" icon={<BarChart3 size={20} />} label="XPACE OS" />
            </nav>

            {/* Footer Exit */}
            <div className="p-3 border-t border-[#151515]">
                <button className="w-full flex items-center p-3 rounded bg-transparent hover:bg-[#1a0505] text-[#555] hover:text-[#ff3300] transition-colors relative overflow-hidden group/btn border border-transparent hover:border-[#330a0a]">
                    <span className="w-5 shrink-0 flex justify-center z-10">
                        <LogOut size={20} />
                    </span>
                    <span className="ml-4 font-sans text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 tracking-wide">
                        Encerrar Sessão
                    </span>

                    {/* Subtle glow on hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#ff3300]/[0.05] to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
                </button>
            </div>
        </aside>
    );
}

function SidebarItem({ href, icon, label, active = false }: { href: string; icon: React.ReactNode; label: string; active?: boolean }) {
    return (
        <Link
            href={href}
            className={`
        flex items-center p-3 rounded group/link relative overflow-hidden transition-all duration-300
        ${active ? 'bg-[#0a0a0a] border border-[#222]' : 'bg-transparent border border-transparent hover:bg-[#0a0a0a] hover:border-[#1a1a1a]'}
      `}
        >
            {/* Active Indicator Bar */}
            {active && (
                <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-primary glow-primary"></div>
            )}

            {/* Icon */}
            <span className={`w-5 shrink-0 flex justify-center z-10 transition-colors ${active ? 'text-primary' : 'text-[#666] group-hover/link:text-white'}`}>
                {icon}
            </span>

            {/* Label */}
            <span className={`
        ml-4 font-sans text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap z-10 tracking-wide
        ${active ? 'text-white' : 'text-[#888] group-hover/link:text-[#ddd]'}
      `}>
                {label}
            </span>

            {/* Subtle hover effect from accent color */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#6324b2]/0 to-[#6324b2]/[0.02] opacity-0 group-hover/link:opacity-100 transition-opacity"></div>
        </Link>
    );
}
