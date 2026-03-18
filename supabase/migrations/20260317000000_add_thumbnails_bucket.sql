-- Criação do Bucket de Storage para Capas/Thumbnails
INSERT INTO storage.buckets (id, name, public) 
VALUES ('thumbnails', 'thumbnails', true) 
ON CONFLICT (id) DO NOTHING;

-- Policies de RLS (Row Level Security) para o bucket 'thumbnails'

-- Qualquer um pode ler as capas
CREATE POLICY "Thumbnails are publicly accessible." 
ON storage.objects FOR SELECT 
USING ( bucket_id = 'thumbnails' );

-- Apenas usuários autenticados podem fazer upload
CREATE POLICY "Authenticated users can upload a thumbnail." 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK ( bucket_id = 'thumbnails' );

-- Usuários só podem atualizar os arquivos que eles mesmos enviaram
CREATE POLICY "Users can update their own thumbnail." 
ON storage.objects FOR UPDATE 
TO authenticated 
USING ( bucket_id = 'thumbnails' AND auth.uid() = owner );

-- Usuários só podem deletar os arquivos que eles mesmos enviaram
CREATE POLICY "Users can delete their own thumbnail." 
ON storage.objects FOR DELETE 
TO authenticated 
USING ( bucket_id = 'thumbnails' AND auth.uid() = owner );
