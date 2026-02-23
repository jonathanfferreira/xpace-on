import Link from "next/link";
import Image from "next/image";

export default function RegisterPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4 relative overflow-hidden bg-background">
            {/* Background Glow Custom */}
            <div className="pointer-events-none absolute inset-0 z-0">
                <Image
                    src="/images/bg-degrade.png"
                    alt="XPACE Background"
                    fill
                    className="object-cover opacity-50 mix-blend-screen"
                    priority
                />
            </div>

            <div className="z-10 w-full max-w-md relative group mt-8">
                <div className="absolute -inset-[1px] bg-gradient-neon rounded-2xl opacity-40 blur-[2px] transition-opacity duration-500 group-hover:opacity-100 pointer-events-none"></div>

                <div className="relative bg-[#0d0d0d]/80 border border-surface rounded-2xl p-8 backdrop-blur-2xl">
                    <div className="mb-8 text-center flex flex-col items-center">
                        <div className="w-48 mb-2">
                            <Image
                                src="/images/xpace-logo-branca.png"
                                alt="XPACE Logo"
                                width={240}
                                height={80}
                                className="w-full object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                                priority
                            />
                        </div>
                        <h1 className="font-heading text-xl uppercase tracking-widest text-[#888888] mb-2">Criação de <span className="text-white">ID</span></h1>
                    </div>

                    <form className="space-y-4">
                        <div className="space-y-2">
                            <label className="font-display text-lg tracking-widest text-white/70" htmlFor="name">Nome Completo</label>
                            <input
                                id="name"
                                type="text"
                                placeholder="Ex: John Doe"
                                className="w-full bg-[#050505] border border-surface focus:border-primary rounded-lg px-4 py-3 font-sans text-white outline-none transition-colors focus:ring-1 focus:ring-primary"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="font-display text-lg tracking-widest text-white/70" htmlFor="email">E-mail</label>
                            <input
                                id="email"
                                type="email"
                                placeholder="seu@email.com"
                                className="w-full bg-[#050505] border border-surface focus:border-secondary rounded-lg px-4 py-3 font-sans text-white outline-none transition-colors focus:ring-1 focus:ring-secondary"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="font-display text-lg tracking-widest text-white/70" htmlFor="password">Senha</label>
                            <input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                className="w-full bg-[#050505] border border-surface focus:border-accent rounded-lg px-4 py-3 font-sans text-white outline-none transition-colors focus:ring-1 focus:ring-accent"
                            />
                        </div>

                        <div className="pt-2">
                            <button
                                type="button"
                                className="w-full relative overflow-hidden rounded-lg bg-white text-black font-sans font-bold py-3 transition-transform duration-200 active:scale-[0.98] mt-4"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    INICIAR SEQUÊNCIA
                                    <Image src="/images/xpace-seta.png" alt="Seta" width={16} height={16} className="invert mix-blend-difference" />
                                </span>
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 text-center border-t border-surface pt-6">
                        <p className="font-sans text-sm text-[#777777]">
                            Já possui identificação?{' '}
                            <Link href="/login" className="text-white hover:text-primary transition-colors font-medium">Faça Login</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
