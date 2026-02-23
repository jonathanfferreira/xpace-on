import { Search, Bell } from 'lucide-react';

export function Topbar() {
    return (
        <header className="h-16 border-b border-[#151515] bg-[#020202]/90 backdrop-blur-md sticky top-0 z-40 px-6 flex items-center justify-between">

            {/* Command/Search Input Mock */}
            <div className="flex-1 max-w-md">
                <div className="relative group">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555] group-focus-within:text-primary transition-colors">
                        <Search size={18} />
                    </div>
                    <input
                        type="text"
                        placeholder="Comando de busca rápida..."
                        className="w-full bg-[#080808] border border-[#222] focus:border-primary/50 text-white font-sans text-sm py-2 pl-10 pr-4 outline-none transition-all placeholder:text-[#444] rounded-none focus:ring-1 focus:ring-primary/20"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                        <kbd className="hidden sm:inline-flex bg-[#111] border border-[#333] text-[#777] rounded-sm px-1.5 py-0.5 text-[10px] font-mono">⌘</kbd>
                        <kbd className="hidden sm:inline-flex bg-[#111] border border-[#333] text-[#777] rounded-sm px-1.5 py-0.5 text-[10px] font-mono">K</kbd>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
                <button className="relative text-[#666] hover:text-white transition-colors p-2">
                    <Bell size={20} />
                    {/* Unread Badge */}
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-secondary ring-2 ring-[#020202]"></span>
                </button>

                {/* Minimalist Profile HUD */}
                <div className="pl-4 border-l border-[#222] flex items-center gap-3 cursor-pointer group">
                    <div className="flex flex-col items-end">
                        <span className="text-white font-heading text-sm font-semibold tracking-wide">ID: 0042</span>
                        <span className="text-[#666] text-[10px] font-mono uppercase tracking-widest group-hover:text-primary transition-colors">Nível Inciante</span>
                    </div>
                    <div className="w-9 h-9 border border-[#333] bg-[#0a0a0a] flex items-center justify-center p-0.5 group-hover:border-primary/50 transition-colors">
                        {/* Using a pseudo-avatar box for that cyberpunk mechanical feel */}
                        <div className="w-full h-full bg-[#111] flex items-center justify-center">
                            <div className="w-1/2 h-[2px] bg-[#333] mb-1"></div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
