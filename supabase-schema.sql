-- ============================================================
-- GATINHAS CLUB – Supabase Schema
-- Execute este SQL no Editor do Supabase para criar o schema
-- ============================================================

-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- para busca full-text

-- ============================================================
-- ENUM: planos disponíveis
-- ============================================================
CREATE TYPE plano_tipo AS ENUM ('basico', 'destaque', 'premium');

-- ============================================================
-- TABELA: profiles (anúncios/anunciantes)
-- ============================================================
CREATE TABLE public.profiles (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome            TEXT NOT NULL CHECK (char_length(nome) BETWEEN 2 AND 50),
  idade           INTEGER NOT NULL CHECK (idade >= 18 AND idade <= 80),
  bairro          TEXT NOT NULL,
  categoria       TEXT NOT NULL CHECK (categoria IN ('Luxo', 'Independente', 'Massagem', 'Acompanhante')),
  descricao       TEXT NOT NULL CHECK (char_length(descricao) BETWEEN 20 AND 1000),
  foto_principal  TEXT,                       -- URL pública no Supabase Storage
  fotos           TEXT[] DEFAULT '{}',         -- array de URLs
  whatsapp        TEXT NOT NULL CHECK (whatsapp ~ '^[0-9]{12,13}$'),
  verificada      BOOLEAN NOT NULL DEFAULT FALSE,
  destaque        BOOLEAN NOT NULL DEFAULT FALSE,
  plano           plano_tipo NOT NULL DEFAULT 'basico',
  ativo           BOOLEAN NOT NULL DEFAULT TRUE,
  visualizacoes   INTEGER NOT NULL DEFAULT 0,
  cliques_whatsapp INTEGER NOT NULL DEFAULT 0,
  expires_at      TIMESTAMPTZ,                -- NULL = sem expiração (básico não pago)
  user_id         UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices para performance e SEO
CREATE INDEX idx_profiles_bairro       ON public.profiles(bairro) WHERE ativo = TRUE;
CREATE INDEX idx_profiles_categoria    ON public.profiles(categoria) WHERE ativo = TRUE;
CREATE INDEX idx_profiles_destaque     ON public.profiles(destaque DESC, created_at DESC) WHERE ativo = TRUE;
CREATE INDEX idx_profiles_ativo        ON public.profiles(ativo, created_at DESC);
CREATE INDEX idx_profiles_user_id      ON public.profiles(user_id);
CREATE INDEX idx_profiles_plano        ON public.profiles(plano) WHERE ativo = TRUE;
-- Full-text search
CREATE INDEX idx_profiles_nome_trgm    ON public.profiles USING gin(nome gin_trgm_ops);
CREATE INDEX idx_profiles_desc_trgm    ON public.profiles USING gin(descricao gin_trgm_ops);

-- ============================================================
-- TABELA: pagamentos
-- ============================================================
CREATE TABLE public.pagamentos (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id      UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  user_id         UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  plano           plano_tipo NOT NULL,
  valor_centavos  INTEGER NOT NULL CHECK (valor_centavos > 0),
  status          TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'aprovado', 'recusado', 'estornado')),
  gateway         TEXT,                       -- ex: 'mercadopago', 'pix', 'stripe'
  gateway_id      TEXT,                       -- ID externo do gateway
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_pagamentos_profile ON public.pagamentos(profile_id);
CREATE INDEX idx_pagamentos_status  ON public.pagamentos(status);

-- ============================================================
-- TABELA: denuncias
-- ============================================================
CREATE TABLE public.denuncias (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id      UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  motivo          TEXT NOT NULL CHECK (motivo IN ('menor_idade', 'foto_falsa', 'spam', 'conteudo_ilegal', 'outro')),
  descricao       TEXT,
  ip_denunciante  TEXT,
  resolvida       BOOLEAN NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_denuncias_profile   ON public.denuncias(profile_id);
CREATE INDEX idx_denuncias_resolvida ON public.denuncias(resolvida) WHERE resolvida = FALSE;

-- ============================================================
-- TABELA: auditoria_logs (para conformidade legal)
-- ============================================================
CREATE TABLE public.auditoria_logs (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tabela      TEXT NOT NULL,
  operacao    TEXT NOT NULL CHECK (operacao IN ('INSERT', 'UPDATE', 'DELETE')),
  registro_id UUID,
  dados_antes JSONB,
  dados_depois JSONB,
  user_id     UUID,
  ip          TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_auditoria_tabela     ON public.auditoria_logs(tabela, created_at DESC);
CREATE INDEX idx_auditoria_registro   ON public.auditoria_logs(registro_id);

-- ============================================================
-- FUNÇÃO: atualizar updated_at automaticamente
-- ============================================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_pagamentos_updated_at
  BEFORE UPDATE ON public.pagamentos
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- FUNÇÃO: incrementar visualizações (RPC)
-- ============================================================
CREATE OR REPLACE FUNCTION public.increment_profile_view(profile_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.profiles
  SET visualizacoes = visualizacoes + 1
  WHERE id = profile_id AND ativo = TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- FUNÇÃO: incrementar cliques no WhatsApp (RPC)
-- ============================================================
CREATE OR REPLACE FUNCTION public.increment_whatsapp_click(profile_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.profiles
  SET cliques_whatsapp = cliques_whatsapp + 1
  WHERE id = profile_id AND ativo = TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- FUNÇÃO: expirar anúncios automaticamente (cron)
-- Use pg_cron ou chamada externa para executar diariamente
-- ============================================================
CREATE OR REPLACE FUNCTION public.expirar_anuncios()
RETURNS INTEGER AS $$
DECLARE
  total INTEGER;
BEGIN
  UPDATE public.profiles
  SET ativo = FALSE
  WHERE expires_at IS NOT NULL
    AND expires_at < NOW()
    AND ativo = TRUE;
  GET DIAGNOSTICS total = ROW_COUNT;
  RETURN total;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pagamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.denuncias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.auditoria_logs ENABLE ROW LEVEL SECURITY;

-- Perfis: leitura pública (apenas ativos)
CREATE POLICY "profiles_select_public"
  ON public.profiles FOR SELECT
  USING (ativo = TRUE);

-- Perfis: anunciante pode ver/editar os próprios
CREATE POLICY "profiles_owner_all"
  ON public.profiles FOR ALL
  USING (auth.uid() = user_id);

-- Denúncias: qualquer um pode inserir
CREATE POLICY "denuncias_insert_public"
  ON public.denuncias FOR INSERT
  WITH CHECK (TRUE);

-- Denúncias: apenas admins podem ler/atualizar
-- (substitua pelo UUID do seu usuário admin)
CREATE POLICY "denuncias_admin_select"
  ON public.denuncias FOR SELECT
  USING (auth.jwt() ->> 'role' = 'admin');

-- Pagamentos: usuário vê os próprios
CREATE POLICY "pagamentos_owner_select"
  ON public.pagamentos FOR SELECT
  USING (auth.uid() = user_id);

-- ============================================================
-- STORAGE: bucket para fotos de anúncios
-- ============================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'profile-photos',
  'profile-photos',
  TRUE,
  5242880,  -- 5MB por arquivo
  ARRAY['image/jpeg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Policy: anunciante faz upload das próprias fotos
CREATE POLICY "profile_photos_upload"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'profile-photos'
    AND auth.uid() IS NOT NULL
  );

-- Policy: leitura pública das fotos
CREATE POLICY "profile_photos_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'profile-photos');

-- Policy: anunciante deleta as próprias fotos
CREATE POLICY "profile_photos_owner_delete"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'profile-photos'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- ============================================================
-- DADOS DE EXEMPLO (para testar)
-- ============================================================
INSERT INTO public.profiles (nome, idade, bairro, categoria, descricao, whatsapp, verificada, destaque, plano)
VALUES
  ('Isabella', 25, 'Centro', 'Luxo', 'Olá! Sou a Isabella, elegante e sofisticada. Atendo com muito carinho e discrição no Centro de Macapá.', '5596999999999', TRUE, TRUE, 'premium'),
  ('Valentina', 23, 'Santa Rita', 'Independente', 'Oi, sou a Valentina! Sou independente e atendo com muita dedicação em Santa Rita, Macapá.', '5596999999998', TRUE, FALSE, 'destaque'),
  ('Sofia', 28, 'Buritizal', 'Massagem', 'Sou a Sofia, especialista em massagem relaxante em Macapá. Ambiente aconchegante no Buritizal.', '5596999999997', FALSE, FALSE, 'basico'),
  ('Laura', 26, 'Jardim Equatorial', 'Luxo', 'Laura, sofisticada e discreta. Ambiente exclusivo no Jardim Equatorial, Zona Norte de Macapá.', '5596999999996', TRUE, TRUE, 'premium'),
  ('Helena', 24, 'Trem', 'Independente', 'Sou a Helena, jovem e atenciosa. Atendo no bairro do Trem, Zona Sul de Macapá, com discrição total.', '5596999999995', FALSE, FALSE, 'basico'),
  ('Manuela', 27, 'Marco Zero', 'Acompanhante', 'Manuela, acompanhante para eventos e jantares. Região do Marco Zero, Macapá. Elegância garantida.', '5596999999994', TRUE, TRUE, 'destaque'),
  ('Camila', 22, 'Congós', 'Independente', 'Sou a Camila, independente e carinhosa. Atendo na região dos Congós, Macapá AP.', '5596999999993', FALSE, FALSE, 'basico'),
  ('Bianca', 29, 'Laguinho', 'Massagem', 'Bianca, massagista profissional em Macapá. Sessões de relaxamento no Laguinho. Agende já!', '5596999999992', TRUE, FALSE, 'destaque');

-- ============================================================
-- VIEWS úteis para analytics
-- ============================================================
CREATE VIEW public.v_stats_por_bairro AS
SELECT
  bairro,
  COUNT(*) AS total_perfis,
  SUM(visualizacoes) AS total_visualizacoes,
  SUM(cliques_whatsapp) AS total_cliques_whatsapp
FROM public.profiles
WHERE ativo = TRUE
GROUP BY bairro
ORDER BY total_perfis DESC;

CREATE VIEW public.v_stats_por_categoria AS
SELECT
  categoria,
  COUNT(*) AS total_perfis,
  COUNT(*) FILTER (WHERE verificada = TRUE) AS verificadas,
  COUNT(*) FILTER (WHERE destaque = TRUE) AS em_destaque,
  AVG(visualizacoes)::INTEGER AS media_visualizacoes
FROM public.profiles
WHERE ativo = TRUE
GROUP BY categoria;

-- ============================================================
-- FIM DO SCHEMA
-- ============================================================
