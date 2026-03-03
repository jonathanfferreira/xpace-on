'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Upload, Package, DollarSign, Weight, Ruler, Save, Loader2, Info } from 'lucide-react'

export default function NovoProdutoPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock: '1',
        weight_kg: '0.3',
        width_cm: '20',
        height_cm: '10',
        length_cm: '20',
        image_url: '' // Simplificado para 1 URL no MVP
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            // Validation
            if (!formData.name || !formData.price) {
                throw new Error("Nome e Preço são obrigatórios.")
            }

            const payload = {
                name: formData.name,
                description: formData.description,
                price: parseFloat(formData.price.replace(',', '.')),
                stock: parseInt(formData.stock, 10),
                weight_kg: parseFloat(formData.weight_kg),
                width_cm: parseFloat(formData.width_cm),
                height_cm: parseFloat(formData.height_cm),
                length_cm: parseFloat(formData.length_cm),
                images: formData.image_url ? [formData.image_url] : [],
                is_active: true
            }

            const response = await fetch('/api/xtore/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || "Erro ao salvar produto.")
            }

            // Success! Redireciona de volta p/ listagem
            router.push('/studio/loja')
            router.refresh()

        } catch (err: any) {
            setError(err.message || 'Ocorreu um erro desconhecido.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <div className="mb-8">
                <Link href="/studio/loja" className="inline-flex items-center gap-2 text-[#888] hover:text-white transition-colors mb-4 text-sm font-sans">
                    <ArrowLeft size={16} /> Voltar para Minha Loja
                </Link>
                <h1 className="font-heading text-4xl mb-2 tracking-tight uppercase">
                    Novo <span className="text-transparent bg-clip-text text-gradient-neon">Produto</span>
                </h1>
                <p className="text-[#888] font-sans">Cadastre itens de merchandising do seu Studio na XTAGE.</p>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-500 font-sans text-sm flex items-center gap-2">
                    <Info size={16} /> {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">

                {/* 1. Informações Básicas */}
                <div className="bg-[#0A0A0A] border border-[#222] rounded-lg p-6">
                    <div className="flex items-center gap-2 mb-6 border-b border-[#222] pb-4">
                        <Package className="text-primary" size={20} />
                        <h2 className="font-heading text-xl uppercase text-white">Informações Básicas</h2>
                    </div>

                    <div className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[#aaa] font-sans">Nome do Produto *</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Ex: Camiseta Oversized Studio Dance"
                                className="w-full bg-[#050505] border border-[#333] rounded px-4 py-3 text-white focus:border-primary outline-none transition-colors"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[#aaa] font-sans">Descrição</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Detalhes do tecido, estampa, conceito..."
                                rows={4}
                                className="w-full bg-[#050505] border border-[#333] rounded px-4 py-3 text-white focus:border-primary outline-none transition-colors resize-none"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[#aaa] font-sans">URL da Imagem (Provisório)</label>
                            <div className="flex gap-2">
                                <span className="inline-flex items-center px-4 rounded border border-[#333] bg-[#111] text-[#666]">
                                    <Upload size={16} />
                                </span>
                                <input
                                    type="url"
                                    name="image_url"
                                    value={formData.image_url}
                                    onChange={handleChange}
                                    placeholder="https://suaimagem.com/foto.jpg"
                                    className="w-full bg-[#050505] border border-[#333] rounded px-4 py-3 text-white focus:border-primary outline-none transition-colors"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Preço e Estoque */}
                <div className="bg-[#0A0A0A] border border-[#222] rounded-lg p-6">
                    <div className="flex items-center gap-2 mb-6 border-b border-[#222] pb-4">
                        <DollarSign className="text-secondary" size={20} />
                        <h2 className="font-heading text-xl uppercase text-white">Vendas e Estoque</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[#aaa] font-sans">Preço de Venda (R$) *</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#666] font-display">R$</span>
                                <input
                                    type="text"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    placeholder="89.90"
                                    className="w-full bg-[#050505] border border-[#333] rounded pl-12 pr-4 py-3 text-white focus:border-secondary outline-none transition-colors font-mono"
                                    required
                                />
                            </div>
                            <p className="text-[10px] text-[#555] font-sans">Ao vender, a taxa da XTAGE é aplicada sobre este valor via Asaas Split.</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[#aaa] font-sans">Quantidade em Estoque</label>
                            <input
                                type="number"
                                name="stock"
                                min="0"
                                value={formData.stock}
                                onChange={handleChange}
                                className="w-full bg-[#050505] border border-[#333] rounded px-4 py-3 text-white focus:border-secondary outline-none transition-colors"
                            />
                        </div>
                    </div>
                </div>

                {/* 3. Dados Logísticos (Correios) */}
                <div className="bg-[#0A0A0A] border border-[#222] rounded-lg p-6">
                    <div className="flex items-center gap-2 mb-6 border-b border-[#222] pb-4">
                        <Ruler className="text-blue-400" size={20} />
                        <h2 className="font-heading text-xl uppercase text-white">Dados de Frete (Obrigatório Correios)</h2>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-[#aaa] font-sans flex items-center gap-1">
                                <Weight size={12} /> Peso (kg)
                            </label>
                            <input
                                type="number"
                                step="0.100"
                                min="0.100"
                                name="weight_kg"
                                value={formData.weight_kg}
                                onChange={handleChange}
                                className="w-full bg-[#111] border border-[#333] rounded px-3 py-2 text-white focus:border-blue-400 outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-[#aaa] font-sans">Largura (cm)</label>
                            <input
                                type="number"
                                name="width_cm"
                                min="10"
                                value={formData.width_cm}
                                onChange={handleChange}
                                className="w-full bg-[#111] border border-[#333] rounded px-3 py-2 text-white focus:border-blue-400 outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-[#aaa] font-sans">Altura (cm)</label>
                            <input
                                type="number"
                                name="height_cm"
                                min="2"
                                value={formData.height_cm}
                                onChange={handleChange}
                                className="w-full bg-[#111] border border-[#333] rounded px-3 py-2 text-white focus:border-blue-400 outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-[#aaa] font-sans">Comprim. (cm)</label>
                            <input
                                type="number"
                                name="length_cm"
                                min="15"
                                value={formData.length_cm}
                                onChange={handleChange}
                                className="w-full bg-[#111] border border-[#333] rounded px-3 py-2 text-white focus:border-blue-400 outline-none"
                            />
                        </div>
                    </div>
                    <p className="text-xs text-[#555] mt-4 font-sans">Essas medidas são de caixa já embalada e são usadas em tempo-real na API do Melhor Envio no carrinho do cliente.</p>
                </div>

                {/* Submit Actions */}
                <div className="flex gap-4 pt-4 border-t border-[#1a1a1a]">
                    <Link
                        href="/studio/loja"
                        className="px-6 py-4 rounded bg-[#111] hover:bg-[#1a1a1a] text-white border border-[#333] font-bold font-sans text-sm transition-colors"
                    >
                        Cancelar
                    </Link>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded bg-primary hover:bg-primary-hover text-white font-bold font-sans transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest"
                    >
                        {loading ? (
                            <><Loader2 size={20} className="animate-spin" /> Salvando...</>
                        ) : (
                            <><Save size={20} /> Cadastrar Produto</>
                        )}
                    </button>
                </div>
            </form>
        </div>
    )
}
