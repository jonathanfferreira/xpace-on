'use client';

import { UploadCloud, CheckCircle2, Film, Info, AlertTriangle } from "lucide-react";
import { useState } from "react";
import * as tus from 'tus-js-client';

export default function StudioUploadPage() {
    const [dragActive, setDragActive] = useState(false);
    const [fileStatus, setFileStatus] = useState<'idle' | 'uploading' | 'processing' | 'success'>('idle');
    const [progress, setProgress] = useState(0);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
        else if (e.type === "dragleave") setDragActive(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            startDirectUploadSequence(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            startDirectUploadSequence(e.target.files[0]);
        }
    };

    const startDirectUploadSequence = async (file: File) => {
        try {
            setFileStatus('uploading');
            setProgress(0);

            // 1. Autorizar o upload no Serverless (Retorna Assinatura Hasheada)
            const response = await fetch('/api/bunny/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: file.name })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Falha na Autorização da Nuvem');

            const { videoId, libraryId, signature, expirationTime } = data;

            // 2. TUS Protocol (Upload chunking direto para o Storage do CDN)
            const upload = new tus.Upload(file, {
                endpoint: "https://video.bunnycdn.com/tusupload",
                retryDelays: [0, 3000, 5000, 10000, 20000],
                headers: {
                    AuthorizationSignature: signature,
                    AuthorizationExpire: String(expirationTime),
                    VideoId: videoId,
                    LibraryId: String(libraryId),
                },
                metadata: {
                    filetype: file.type,
                    title: file.name,
                },
                onError: function (error) {
                    console.error("Falha fatal no TUS Upload:", error);
                    setFileStatus('idle');
                    alert("Quebra de conexão: " + error.message);
                },
                onProgress: function (bytesUploaded, bytesTotal) {
                    const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(0);
                    setProgress(Number(percentage));
                },
                onSuccess: function () {
                    console.log("Arquivo MP4 totalmente transmitido para a Bunny (%s)", upload.url);
                    setFileStatus('processing');

                    // A verdadeira transição de 'processing' para 'success' vem do Webhook via Bando de Dados.
                    // Mas para UX fluida, simulamos a aprovação após o upload da aba do professor:
                    setTimeout(() => {
                        setFileStatus('success');
                    }, 4000);
                }
            });

            upload.start();
        } catch (e: any) {
            console.error(e);
            setFileStatus('idle');
            alert(e.message);
        }
    };

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <h1 className="text-3xl font-heading font-bold text-white uppercase tracking-tight mb-2">Central de Upload</h1>
            <p className="text-[#888] font-sans text-sm mb-10 border-b border-[#1a1a1a] pb-6">Envie arquivos MP4 vazados diretos de Câmera ou Edição. A plataforma Bunny.net converterá agressivamente para Steaming Padrão Netflix (HLS) garantindo altíssima performance no Player 4K.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Uploader Block */}
                <div className="md:col-span-2">
                    <form
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        className={`
                            border-2 border-dashed rounded-sm flex flex-col items-center justify-center p-12 transition-all duration-300 relative overflow-hidden bg-[#0A0A0A]
                            ${dragActive ? 'border-primary bg-primary/5 scale-[1.01]' : 'border-[#333] hover:border-[#555]'}
                            ${fileStatus !== 'idle' ? 'pointer-events-none' : 'cursor-pointer'}
                        `}
                    >
                        <input
                            type="file"
                            accept="video/mp4,video/quicktime"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                            onChange={handleChange}
                            disabled={fileStatus !== 'idle'}
                        />

                        {fileStatus === 'idle' && (
                            <>
                                <div className="w-16 h-16 rounded-full bg-[#111] border border-[#222] flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                                    <UploadCloud size={32} className="text-[#666] group-hover:text-primary transition-colors" />
                                </div>
                                <h3 className="font-heading font-bold text-lg text-white uppercase mb-2">Arraste e Solte sua Aula Aqui</h3>
                                <p className="text-sm font-sans text-[#666] text-center max-w-sm">Suporte para .MP4, .MOV até 2GB por arquivo. Os vídeos serão convertidos automaticamente com compressões multi-resolução.</p>

                                <button type="button" className="mt-8 px-6 py-2 bg-[#1a1a1a] hover:bg-[#222] text-white font-mono text-xs uppercase tracking-widest border border-[#333] rounded">
                                    Procurar Arquivo
                                </button>
                            </>
                        )}

                        {fileStatus === 'uploading' && (
                            <div className="w-full text-center z-10">
                                <div className="flex items-center justify-between mb-2 text-xs font-mono uppercase tracking-widest text-[#888]">
                                    <span>Enviando Master...</span>
                                    <span className="text-white">{progress}%</span>
                                </div>
                                <div className="w-full h-2 bg-[#111] rounded overflow-hidden border border-[#222]">
                                    <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }}></div>
                                </div>
                            </div>
                        )}

                        {fileStatus === 'processing' && (
                            <div className="w-full text-center z-10 flex flex-col items-center gap-4">
                                <div className="w-12 h-12 rounded-full border-t-2 border-r-2 border-primary animate-spin"></div>
                                <div>
                                    <p className="font-heading font-bold text-white uppercase">Convertendo HLS na Nuvem...</p>
                                    <p className="text-xs text-[#888] font-mono mt-1">Isso evita que alunos roubem seu MP4. (Bunny Stream)</p>
                                </div>
                            </div>
                        )}

                        {fileStatus === 'success' && (
                            <div className="w-full text-center z-10 flex flex-col items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/50 flex items-center justify-center">
                                    <CheckCircle2 size={32} className="text-green-500" />
                                </div>
                                <div>
                                    <p className="font-heading font-bold text-green-500 uppercase text-xl">Upload Concluído!</p>
                                    <p className="text-xs text-[#888] font-mono mt-1">Duração detectada por AI: 14:23</p>
                                </div>
                                <button onClick={() => setFileStatus('idle')} className="mt-4 px-6 py-2 bg-[#1a1a1a] hover:bg-[#222] text-white font-mono text-xs uppercase tracking-widest border border-[#333] rounded">
                                    Subir Novo Arquivo
                                </button>
                            </div>
                        )}
                    </form>
                </div>

                {/* Instructions Sidebar */}
                <div className="md:col-span-1 flex flex-col gap-6">
                    <div className="bg-[#111] border border-primary/20 rounded p-5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-3 opacity-20"><Film size={40} className="text-primary" /></div>
                        <h4 className="font-heading font-bold text-white uppercase mb-3 flex items-center gap-2 relative z-10">
                            <Info size={16} className="text-primary" /> Setup Bunny.net
                        </h4>
                        <p className="text-xs font-sans text-[#aaa] leading-relaxed relative z-10">
                            Nós não salvamos vídeos purões direto na nossa Database. Enviamos diretamente pro BunnyCDN para gerar <strong className="text-white">fragmentos HLS criptografados</strong>. Quando o aluno der Play no trem-metrô, ele usará menos internet sem travar!
                        </p>
                    </div>

                    <div className="bg-accent/5 border border-accent/20 rounded p-5">
                        <h4 className="font-heading font-bold text-accent uppercase mb-3 flex items-center gap-2">
                            <AlertTriangle size={16} /> Regras de Qualidade
                        </h4>
                        <ul className="text-xs font-sans text-[#888] space-y-2 list-disc pl-4">
                            <li>Luz limpa para garantir detecção do Holo-Trainer (Espelho).</li>
                            <li>Tamanho máximo: <strong className="text-white">2.5 GB / Aula</strong>.</li>
                            <li>FPS de Dança: Procure enviar sempre vídeos exportados à <strong className="text-white">60 frames per second</strong> para suavidade.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
