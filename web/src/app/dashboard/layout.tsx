'use client'

import { useState } from 'react';
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { XpaceTour } from "@/components/pwa/xpace-tour";
import { PwaInstallBanner } from "@/components/pwa/install-banner";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex bg-[#050505] min-h-screen text-[#ededed] font-sans selection:bg-primary/30 selection:text-white">
            {/* Sidebar fixo à esquerda (gaveta no mobile) */}
            <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col md:ml-[80px] w-full transition-all duration-300">
                <Topbar onMenuClick={() => setSidebarOpen(true)} />
                <XpaceTour />
                <PwaInstallBanner />

                {/* Page Content Holder */}
                <main className="flex-1 p-4 md:p-6 lg:p-10 relative overflow-x-hidden">
                    {/* Subtle Background Pattern/Glow */}
                    <div className="fixed top-1/4 -right-[200px] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none z-0"></div>
                    <div className="fixed bottom-0 left-1/4 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[150px] pointer-events-none z-0"></div>

                    <div className="relative z-10">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
