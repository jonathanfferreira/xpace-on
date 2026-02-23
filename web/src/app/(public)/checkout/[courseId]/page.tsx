"use client";

import { useState } from "react";
import { Lock, CreditCard, ChevronRight, CheckCircle2 } from "lucide-react";

// Fake Info sobre o Produto
const MOCK_CHECKOUT = {
    courseTitle: "Fundamentos Hip-Hop",
    instructor: "Ton Novaes",
    price: 349.90,
    thumbnail: "/images/bg-degrade.png"
};

// Juros de mercado Asaas (Simulação Padrão)
const INTEREST_RATE = 0.0299; // ~2.99% a.m

// Calcula parcelamento progressivo (Tabela Price Simplificada Asaas)
const calculateInstallment = (cashPrice: number, months: number) => {
    if (months === 1) return cashPrice;
    // M = C * (1 + i)^t
    const amount = cashPrice * Math.pow(1 + INTEREST_RATE, months);
    return amount / months;
};

export default function CheckoutPage() {
    const [paymentMethod, setPaymentMethod] = useState<"pix" | "credit">("credit");
    const [installments, setInstallments] = useState<number>(1);

    // Array de 1 a 12 para popular o Select Map
    const installmentOptions = Array.from({ length: 12 }, (_, i) => i + 1);

    // Valor Total Transparente que será cobrado no Cartão do Aluno (Com Juros Integrado)
    const totalChargeAmount = paymentMethod === "pix"
        ? MOCK_CHECKOUT.price
        : calculateInstallment(MOCK_CHECKOUT.price, installments) * installments;

    // States de Controle do Formulário e Fetch
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [cardExpiry, setCardExpiry] = useState("");
    const [cardCvc, setCardCvc] = useState("");

    // States de Interface/Loading
    const [isProcessing, setIsProcessing] = useState(false);
    const [pixData, setPixData] = useState<{ url: string, copiaECola: string } | null>(null);
    const [successMode, setSuccessMode] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    // Função Integradora FrontEnd -> BackEnd
    const handleCheckout = async () => {
        setIsProcessing(true);
        try {
            const payload = {
                courseId: "course-123", // TODO: Pegar o dinâmico via params hook Next.js
                name, email, phone,
                paymentMethod,
                installments,
                creditCard: paymentMethod === 'credit' ? {
                    holderName: name,
                    number: cardNumber.replace(/\s/g, ''),
                    expiryMonth: cardExpiry.split('/')[0],
                    expiryYear: "20" + cardExpiry.split('/')[1],
                    ccv: cardCvc
                } : null
            };

            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.error || "Erro ao processar pagamento");

            // Handle Retorno PIX Mock ou Real
            if (paymentMethod === 'pix') {
                setPixData({ url: data.pixQrCodeUrl, copiaECola: data.pixCopiaECola });
            } else {
                // Cartão aprovado
                setSuccessMode(true);
            }

        } catch (error: any) {
            alert(error.message); // Temporário, ideal usar Toast
        } finally {
            setIsProcessing(false);
        }
    };
    return (
        <div className="min-h-screen bg-[#050505] text-[#ededed] font-sans selection:bg-primary/30">

            {/* Checkout Navbar */}
            <nav className="h-16 border-b border-[#1a1a1a] flex items-center justify-center bg-black/50 backdrop-blur-md sticky top-0 z-50">
                <Lock size={16} className="text-[#666] mr-2" />
                <span className="text-xs font-mono uppercase tracking-widest text-[#888]">Checkout Seguro XPACE.ON</span>
            </nav>

            <div className="max-w-6xl mx-auto px-6 py-12 lg:py-20 flex flex-col lg:flex-row gap-12 lg:gap-24 relative">

                {/* Glow Effects */}
                <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px] pointer-events-none"></div>

                {/* Esquerda: Billing & Payment (App Style) */}
                <div className="flex-1 max-w-xl relative z-10">

                    <h1 className="text-4xl font-heading uppercase text-white mb-2">Finalizar<br />Inscrição</h1>
                    <p className="text-[#888] mb-10 text-sm">Próximo passo: Acesso Imediato ao XPACE OS.</p>

                    <div className="space-y-10">

                        {/* Seção 1: Identificação Fast-Track */}
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <span className="w-6 h-6 border border-primary text-primary flex items-center justify-center font-display text-sm">1</span>
                                <h2 className="font-heading text-xl uppercase text-white">Sua Identidade</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="col-span-1 md:col-span-2 space-y-1">
                                    <label className="text-[10px] font-mono text-[#666] uppercase tracking-widest pl-1">E-mail de Acesso</label>
                                    <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="nome@email.com" className="w-full bg-[#0a0a0a] border border-[#222] focus:border-primary px-4 py-3 outline-none text-white transition-colors" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-mono text-[#666] uppercase tracking-widest pl-1">Nome Completo</label>
                                    <input value={name} onChange={e => setName(e.target.value)} type="text" placeholder="Como quer ser chamado?" className="w-full bg-[#0a0a0a] border border-[#222] focus:border-primary px-4 py-3 outline-none text-white transition-colors" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-mono text-[#666] uppercase tracking-widest pl-1">WhatsApp</label>
                                    <input value={phone} onChange={e => setPhone(e.target.value)} type="text" placeholder="(11) 90000-0000" className="w-full bg-[#0a0a0a] border border-[#222] focus:border-primary px-4 py-3 outline-none text-white transition-colors" />
                                </div>
                            </div>
                        </div>

                        {/* Seção 2: Pagamento (Integrado Fake Asaas) */}
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <span className="w-6 h-6 border border-primary text-primary flex items-center justify-center font-display text-sm">2</span>
                                <h2 className="font-heading text-xl uppercase text-white">Pagamento</h2>
                            </div>

                            {/* Tabs PIX vs Credit */}
                            <div className="flex gap-2 mb-6">
                                <button
                                    onClick={() => setPaymentMethod("credit")}
                                    className={`flex-1 py-4 flex flex-col items-center justify-center gap-2 border transition-all ${paymentMethod === 'credit' ? 'border-primary bg-primary/5 text-white' : 'border-[#222] bg-[#0a0a0a] text-[#666] hover:border-[#444]'}`}
                                >
                                    <CreditCard size={24} />
                                    <span className="text-xs font-mono uppercase tracking-widest">Cartão de Crédito</span>
                                </button>
                                <button
                                    onClick={() => setPaymentMethod("pix")}
                                    className={`flex-1 py-4 flex flex-col items-center justify-center gap-2 border transition-all ${paymentMethod === 'pix' ? 'border-secondary bg-secondary/5 text-white' : 'border-[#222] bg-[#0a0a0a] text-[#666] hover:border-[#444]'}`}
                                >
                                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M7.16 3.48c-1.37-.92-3.15-.31-3.69 1.14l-1.4 3.73c-.23.61-.13 1.28.28 1.83l3.64 4.88c.68.91 2.05.91 2.73 0l3.64-4.88c.41-.55.51-1.22.28-1.83l-1.4-3.73c-.54-1.45-2.32-2.06-3.69-1.14zm11.23 0c-1.37-.92-3.15-.31-3.69 1.14l-1.4 3.73c-.23.61-.13 1.28.28 1.83l3.64 4.88c.68.91 2.05.91 2.73 0l3.64-4.88c.41-.55.51-1.22.28-1.83l-1.4-3.73c-.54-1.45-2.32-2.06-3.69-1.14zM12 11.5c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" /></svg>
                                    <span className="text-xs font-mono uppercase tracking-widest mt-1">PIX Instantâneo</span>
                                </button>
                            </div>

                            {/* Form Dinâmico */}
                            {paymentMethod === 'credit' && (
                                <div className="space-y-4 p-6 bg-[#0a0a0a] border border-[#222]">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-mono text-[#666] uppercase tracking-widest pl-1">Número do Cartão</label>
                                        <input value={cardNumber} onChange={e => setCardNumber(e.target.value)} type="text" placeholder="0000 0000 0000 0000" className="w-full bg-[#111] border border-[#333] focus:border-primary px-4 py-3 outline-none text-white transition-colors font-mono" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-mono text-[#666] uppercase tracking-widest pl-1">Vencimento</label>
                                            <input value={cardExpiry} onChange={e => setCardExpiry(e.target.value)} type="text" placeholder="MM/AA" className="w-full bg-[#111] border border-[#333] focus:border-primary px-4 py-3 outline-none text-white transition-colors" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-mono text-[#666] uppercase tracking-widest pl-1">CVC</label>
                                            <input value={cardCvc} onChange={e => setCardCvc(e.target.value)} type="text" placeholder="123" className="w-full bg-[#111] border border-[#333] focus:border-primary px-4 py-3 outline-none text-white transition-colors" />
                                        </div>
                                    </div>
                                    <div className="space-y-1 mt-4 border-t border-[#222] pt-4">
                                        <label className="text-[10px] font-mono text-[#666] uppercase tracking-widest pl-1">Opções de Parcelamento</label>
                                        <select
                                            className="w-full bg-[#111] border border-[#333] focus:border-primary px-4 py-3 outline-none text-white transition-colors appearance-none cursor-pointer"
                                            value={installments}
                                            onChange={(e) => setInstallments(Number(e.target.value))}
                                        >
                                            {installmentOptions.map(num => {
                                                const instValue = calculateInstallment(MOCK_CHECKOUT.price, num);
                                                return (
                                                    <option key={num} value={num}>
                                                        {num}x de R$ {instValue.toFixed(2).replace('.', ',')} {num === 1 ? '(Sem Juros)' : ''}
                                                    </option>
                                                )
                                            })}
                                        </select>
                                    </div>
                                </div>
                            )}

                            {paymentMethod === 'pix' && !pixData && (
                                <div className="p-8 bg-[#0a0a0a] border border-[#222] text-center flex flex-col items-center">
                                    <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
                                        <CheckCircle2 size={24} className="text-secondary" />
                                    </div>
                                    <h3 className="text-white font-sans font-bold mb-2">Geração de QR Code Ativa</h3>
                                    <p className="text-[#888] text-sm max-w-sm">Ao clicar em confirmar, você receberá o código PIX Copia & Cola e o QR Code. Acesso liberado em até 10 segundos após o pagamento.</p>
                                </div>
                            )}

                            {/* TELA SUCESSO PIX (Retorno Asaas) */}
                            {pixData && (
                                <div className="p-8 bg-secondary/5 border border-secondary/30 text-center flex flex-col items-center">
                                    <h3 className="text-white font-sans font-bold mb-4">Escaneie para Pagar</h3>
                                    <div className="bg-white p-2 rounded relative mb-4">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={pixData.url || `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${pixData.copiaECola}`} alt="PIX QR Code" className="w-48 h-48" />
                                    </div>
                                    <p className="text-[#888] text-xs mb-2">Ou copie a chave abaixo:</p>
                                    <div
                                        onClick={() => {
                                            navigator.clipboard.writeText(pixData.copiaECola);
                                            setIsCopied(true);
                                            setTimeout(() => setIsCopied(false), 2000);
                                        }}
                                        className="bg-[#050505] border border-[#222] w-full p-3 flex justify-between gap-4 font-mono text-[10px] text-[#666] overflow-hidden break-all text-left relative group cursor-copy hover:border-[#444] transition-colors"
                                    >
                                        <span>{pixData.copiaECola.slice(0, 40)}...</span>
                                        <span className="text-secondary absolute right-3 hidden group-hover:block bg-[#050505] pl-2 transition-all">
                                            {isCopied ? "Copiado!" : "Copiar"}
                                        </span>
                                    </div>
                                    <p className="text-secondary font-mono tracking-widest uppercase text-xs mt-6 blink-anim">Aguardando Pagamento...</p>
                                </div>
                            )}

                            {/* TELA SUCESSO CARTÃO */}
                            {successMode && (
                                <div className="p-8 bg-primary/5 border border-primary/30 text-center flex flex-col items-center">
                                    <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4 text-primary">
                                        <CheckCircle2 size={32} />
                                    </div>
                                    <h3 className="text-white font-sans font-bold text-xl mb-2">Acesso Liberado!</h3>
                                    <p className="text-[#888] text-sm max-w-sm mb-6">Pagamento processado com sucesso. Bem vindo ao XPACE.ON.</p>
                                    <a href="/dashboard" className="bg-primary text-white font-bold py-3 px-8 text-sm uppercase tracking-widest hover:bg-primary/80 transition-colors inline-block w-full max-w-xs">
                                        Acessar Dashboard
                                    </a>
                                </div>
                            )}

                        </div>

                        {!pixData && !successMode && (
                            <button
                                onClick={handleCheckout}
                                disabled={isProcessing}
                                className={`w-full font-bold py-5 mt-4 transition-colors flex items-center justify-center gap-2 group ${isProcessing ? 'bg-[#222] text-[#666] cursor-not-allowed' : 'bg-white text-black hover:bg-primary hover:text-white'}`}
                            >
                                <span className="uppercase tracking-widest text-sm">
                                    {isProcessing ? "Processando..." : "Completar Inscrição"}
                                </span>
                                {!isProcessing && <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                            </button>
                        )}

                        <p className="text-center text-[#555] text-xs font-sans mt-4 flex items-center justify-center gap-1.5"><Lock size={12} /> Pagamento 100% processado pelo Asaas de forma segura.</p>

                    </div>
                </div>

                {/* Direita: Resumo do Pedido (HUD Fixo) */}
                <div className="w-full lg:w-[400px] shrink-0 relative z-10">
                    <div className="sticky top-24 bg-[#0a0a0a] border border-[#222] p-6">

                        <div className="flex gap-4 mb-6">
                            <div className="w-24 h-24 bg-[#111] relative overflow-hidden border border-[#333] shrink-0">
                                <div className="absolute inset-0 bg-[url('/images/bg-degrade.png')] bg-cover opacity-50 sepia contrast-150"></div>
                            </div>
                            <div className="flex flex-col justify-center">
                                <h3 className="font-heading uppercase text-xl text-white leading-tight mb-1">{MOCK_CHECKOUT.courseTitle}</h3>
                                <span className="text-[#888] font-sans text-xs">Por {MOCK_CHECKOUT.instructor}</span>
                            </div>
                        </div>

                        <div className="border-t border-[#1a1a1a] py-6 space-y-4">
                            <div className="flex justify-between items-center text-sm font-sans text-[#888]">
                                <span>Valor do Treinamento</span>
                                <span>R$ {MOCK_CHECKOUT.price.toFixed(2).replace('.', ',')}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm font-sans text-[#888]">
                                <span>Taxas da Operadora (Juros)</span>
                                {paymentMethod === 'pix' || installments === 1 ? (
                                    <span className="text-secondary font-mono tracking-widest uppercase text-[10px] px-2 py-0.5 border border-secondary/30 bg-secondary/10">Isento</span>
                                ) : (
                                    <span className="text-[#888]">R$ {(totalChargeAmount - MOCK_CHECKOUT.price).toFixed(2).replace('.', ',')}</span>
                                )}
                            </div>
                        </div>

                        <div className="border-t border-[#222] pt-6 flex justify-between items-end">
                            <div className="flex flex-col">
                                <span className="text-[#666] font-mono text-[10px] uppercase tracking-widest mb-1">Total {paymentMethod === 'credit' && installments > 1 ? `em ${installments}x` : 'a vista'}</span>
                                <span className="text-white font-display text-4xl">R$ {totalChargeAmount.toFixed(2).replace('.', ',')}</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
