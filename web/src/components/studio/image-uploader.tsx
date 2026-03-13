"use client";

import { useState, useRef } from "react";
import { UploadCloud, X, Loader2, Image as ImageIcon } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

interface ImageUploaderProps {
    bucket: "thumbnails" | "avatars" | "logos"; // Extendable
    folder?: string;
    currentImageUrl?: string | null;
    onUploadSuccess: (url: string) => void;
    onError?: (error: string) => void;
    label?: string;
    className?: string;
}

export function ImageUploader({
    bucket,
    folder = "general",
    currentImageUrl,
    onUploadSuccess,
    onError,
    label = "Arraste uma imagem ou clique para selecionar",
    className = ""
}: ImageUploaderProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];
        
        // Preview temporal base64
        const objUrl = URL.createObjectURL(file);
        setPreviewUrl(objUrl);
        await uploadFile(file);
    };

    const uploadFile = async (file: File) => {
        if (!file.type.startsWith("image/")) {
            if (onError) onError("Por favor, selecione apenas arquivos de imagem.");
            return;
        }

        setIsUploading(true);
        try {
            const supabase = createClient();
            
            // Random filename to avoid conflicts
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
            const filePath = `${folder}/${fileName}`;

            const { data, error } = await supabase.storage
                .from(bucket)
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (error) throw error;

            // Pega a URL publica
            const { data: publicData } = supabase.storage
                .from(bucket)
                .getPublicUrl(filePath);

            onUploadSuccess(publicData.publicUrl);
            setPreviewUrl(publicData.publicUrl); // Troca pelo real
        } catch (error: any) {
            console.error("Upload error:", error);
            setPreviewUrl(currentImageUrl || null); // Reverte preview
            if (onError) onError(error.message || "Erro no upload da imagem");
        } finally {
            setIsUploading(false);
        }
    };

    const handleClear = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setPreviewUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        onUploadSuccess(""); // Envia string vazia para limpar no DB
    };

    return (
        <div className={`relative w-full border-2 border-dashed ${previewUrl ? 'border-[#333]' : 'border-[#222] hover:border-primary/50'} bg-[#0a0a0a] transition-colors rounded overflow-hidden group ${className}`}>
            <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange} 
                accept="image/*" 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                disabled={isUploading}
            />
            
            {previewUrl ? (
                <div className="relative w-full aspect-video bg-[#111] flex items-center justify-center">
                    <img 
                        src={previewUrl} 
                        alt="Preview" 
                        className="w-full h-full object-cover opacity-90 group-hover:opacity-70 transition-opacity"
                    />
                    
                    {/* Botão de excluir */}
                    {!isUploading && (
                        <button 
                            onClick={handleClear}
                            className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black text-white rounded-full opacity-0 group-hover:opacity-100 transition-all z-20"
                            title="Remover imagem"
                        >
                            <X size={16} />
                        </button>
                    )}

                    {isUploading && (
                        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center z-20 backdrop-blur-sm">
                            <Loader2 className="w-8 h-8 text-primary animate-spin mb-2" />
                            <span className="text-xs text-white uppercase tracking-widest font-mono">Enviando...</span>
                        </div>
                    )}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-8 px-4 text-center aspect-video">
                    {isUploading ? (
                        <>
                            <Loader2 className="w-8 h-8 text-primary animate-spin mb-3" />
                            <span className="text-xs text-[#888] uppercase tracking-widest font-mono">Processando...</span>
                        </>
                    ) : (
                        <>
                            <div className="w-12 h-12 rounded-full bg-[#111] flex items-center justify-center mb-3 group-hover:bg-primary/10 transition-colors">
                                <UploadCloud className="w-5 h-5 text-[#666] group-hover:text-primary transition-colors" />
                            </div>
                            <span className="text-sm text-[#888] font-sans group-hover:text-white transition-colors">{label}</span>
                            <span className="text-[10px] text-[#555] font-mono mt-2">JPEG, PNG ou WEBP (Max 5MB)</span>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
