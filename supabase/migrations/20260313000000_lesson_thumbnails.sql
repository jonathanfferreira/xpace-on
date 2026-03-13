-- Adiciona a coluna thumbnail_url na tabela lessons
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;

-- Cria o bucket 'thumbnails' se ele não existir
INSERT INTO storage.buckets (id, name, public)
VALUES ('thumbnails', 'thumbnails', true)
ON CONFLICT (id) DO NOTHING;

-- Política: Criadores (professores/admins logados) podem inserir no bucket thumbnails
CREATE POLICY "Criadores podem fazer upload de thumbnails"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'thumbnails');

-- Política: Criadores (professores/admins logados) podem atualizar no bucket thumbnails
CREATE POLICY "Criadores podem atualizar thumbnails"
ON storage.objects FOR UPDATE
TO authenticated
WITH CHECK (bucket_id = 'thumbnails');

-- Política: Criadores podem deletar no bucket thumbnails
CREATE POLICY "Criadores podem deletar thumbnails"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'thumbnails');

-- Política: Leitura pública
CREATE POLICY "Thumbnails são públicos para leitura"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'thumbnails');
