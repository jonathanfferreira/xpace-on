-- Sprint 35: Modo Formação (Progressão Linear)
-- Adiciona a flag is_linear_progression aos Cursos.

ALTER TABLE public.courses 
ADD COLUMN IF NOT EXISTS is_linear_progression BOOLEAN NOT NULL DEFAULT false;

-- O Front-end agora será responsável por verificar essa flag (disponível via JOIN na busca de aulas)
-- E bloqueará a UI/Links caso o aluno não tenha completado a aula anterior (order_index antecedente).
