'use client';

import { StudioChart } from '@/components/charts/studio-chart';
import { Users, DollarSign } from 'lucide-react';

interface Props {
    enrollmentsByDay: { date: string; value: number }[];
    revenueByDay: { date: string; value: number }[];
}

export function StudioChartsClient({ enrollmentsByDay, revenueByDay }: Props) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
            <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-sm p-6">
                <h3 className="font-heading font-bold uppercase text-white tracking-wide mb-4 text-sm flex items-center gap-2">
                    <Users size={14} className="text-primary" /> Matrículas (30 dias)
                </h3>
                <StudioChart
                    data={enrollmentsByDay}
                    label="Matrículas"
                    color="#6324B2"
                />
            </div>
            <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-sm p-6">
                <h3 className="font-heading font-bold uppercase text-white tracking-wide mb-4 text-sm flex items-center gap-2">
                    <DollarSign size={14} className="text-secondary" /> Receita (30 dias)
                </h3>
                <StudioChart
                    data={revenueByDay}
                    label="Receita"
                    color="#EB00BC"
                    formatValue={(v) => `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                />
            </div>
        </div>
    );
}
