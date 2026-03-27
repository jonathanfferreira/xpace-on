'use client';

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface DataPoint {
    date: string;
    value: number;
}

interface StudioChartProps {
    data: DataPoint[];
    label: string;
    color?: string;
    formatValue?: (v: number) => string;
}

export function StudioChart({ data, label, color = '#6324B2', formatValue }: StudioChartProps) {
    const fmt = formatValue || ((v: number) => String(v));

    return (
        <div className="w-full h-48">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                    <defs>
                        <linearGradient id={`gradient-${label}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={color} stopOpacity={0.3} />
                            <stop offset="100%" stopColor={color} stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
                    <XAxis
                        dataKey="date"
                        stroke="#444"
                        tick={{ fill: '#666', fontSize: 10, fontFamily: 'monospace' }}
                        axisLine={{ stroke: '#222' }}
                        tickLine={false}
                    />
                    <YAxis
                        stroke="#444"
                        tick={{ fill: '#666', fontSize: 10, fontFamily: 'monospace' }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#111',
                            border: '1px solid #333',
                            borderRadius: '4px',
                            fontFamily: 'monospace',
                            fontSize: '11px',
                        }}
                        labelStyle={{ color: '#888' }}
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        formatter={((value: any) => [fmt(Number(value ?? 0)), label]) as any}
                    />
                    <Area
                        type="monotone"
                        dataKey="value"
                        stroke={color}
                        strokeWidth={2}
                        fill={`url(#gradient-${label})`}
                        dot={false}
                        activeDot={{ r: 4, fill: color, stroke: '#000', strokeWidth: 2 }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}

interface PeriodSelectorProps {
    value: string;
    onChange: (period: string) => void;
}

export function PeriodSelector({ value, onChange }: PeriodSelectorProps) {
    const periods = [
        { key: '7d', label: '7D' },
        { key: '30d', label: '30D' },
        { key: '90d', label: '90D' },
    ];

    return (
        <div className="flex gap-1 p-0.5 bg-[#111] border border-[#222] rounded-lg">
            {periods.map(p => (
                <button
                    key={p.key}
                    onClick={() => onChange(p.key)}
                    className={`px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest rounded-md transition-all ${
                        value === p.key
                            ? 'bg-primary text-white shadow-lg'
                            : 'text-[#666] hover:text-white'
                    }`}
                >
                    {p.label}
                </button>
            ))}
        </div>
    );
}
