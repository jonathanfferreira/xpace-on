'use client';

import { useState } from 'react';
import { MasterSidebar } from "@/components/master/master-sidebar";
import { Menu } from 'lucide-react';

export default function MasterLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    // Nota RBAC: Restringir isso apenas a JWT custom_claim "role: platform_admin"
    return (
        <div className="flex bg-[#050505] min-h-screen text-[#ededed] font-sans selection:bg-primary/30 selection:text-white">
            <MasterSidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />

            <main className="flex-1 flex flex-col relative overflow-x-hidden min-w-0">
                <header className="h-[64px] border-b border-[#1a1a1a] bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-4 md:px-8">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setSidebarOpen(true)} className="md:hidden mr-2 text-[#888] hover:text-white">
                            <Menu size={20} />
                        </button>
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse hidden md:block"></div>
                        <h1 className="font-heading uppercase tracking-widest text-[#555] text-sm">Controle Mestre</h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="text-right hidden md:block">
                            <p className="text-sm font-bold text-white">Jonathan F.</p>
                            <p className="text-[10px] text-red-500 font-mono uppercase tracking-widest">CEO / Supremo</p>
                        </div>
                        <div className="w-10 h-10 rounded-full border border-red-500/30 bg-black flex items-center justify-center">
                            <span className="text-red-500 font-bold font-heading text-xs">ON</span>
                        </div>
                    </div>
                </header>

                <div className="flex-1 p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
