-- Adicionando colunas de biografia e avatar para a vitrine na tabela tenants
ALTER TABLE public.tenants 
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Comentários para documentação
COMMENT ON COLUMN public.tenants.bio IS 'Biografia ou descrição da escola para a vitrine pública.';
COMMENT ON COLUMN public.tenants.avatar_url IS 'URL da foto de perfil ou logo circular da escola.';
