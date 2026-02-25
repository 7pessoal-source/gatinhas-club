-- ============================================================
-- GATINHAS CLUB — Schema Completo v3
-- Execute no Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- Extensões
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ============================================================
-- 1. TIPOS ENUM
-- ============================================================
DO $$ BEGIN
  CREATE TYPE plano_tipo AS ENUM ('basico', 'destaque', 'premium');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ============================================================
-- 2. TABELA: user_profiles
--    Criada automaticamente via trigger ao signup
-- ============================================================
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id          uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role        text NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'gp', 'admin')),
  nome        text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- Trigger: cria user_profile automaticamente ao cadastrar
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_profiles (id, nome, role)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'nome',
    'user'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- 3. TABELA: gp_applications
--    Cadastros de GPs pendentes de aprovação admin
-- ============================================================
CREATE TABLE IF NOT EXISTS public.gp_applications (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nome        text NOT NULL CHECK (char_length(nome) BETWEEN 2 AND 50),
  idade       integer NOT NULL CHECK (idade BETWEEN 18 AND 80),
  bairro      text NOT NULL,
  categoria   text NOT NULL CHECK (categoria IN ('Luxo', 'Independente', 'Massagem', 'Acompanhante')),
  descricao   text NOT NULL CHECK (char_length(descricao) BETWEEN 20 AND 1000),
  whatsapp    text NOT NULL CHECK (whatsapp ~ '^[0-9]{12,13}$'),
  fotos       text[] DEFAULT '{}',
  status      text NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'aprovado', 'rejeitado')),
  admin_nota  text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- 4. TABELA: profiles (anúncios das GPs aprovadas)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id                  uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id             uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  nome                text NOT NULL CHECK (char_length(nome) BETWEEN 2 AND 50),
  idade               integer NOT NULL CHECK (idade BETWEEN 18 AND 80),
  bairro              text NOT NULL,
  categoria           text NOT NULL CHECK (categoria IN ('Luxo', 'Independente', 'Massagem', 'Acompanhante')),
  descricao           text NOT NULL CHECK (char_length(descricao) BETWEEN 20 AND 1000),
  foto_principal      text,
  fotos               text[] DEFAULT '{}',
  whatsapp            text NOT NULL CHECK (whatsapp ~ '^[0-9]{12,13}$'),
  verificada          boolean NOT NULL DEFAULT false,
  destaque            boolean NOT NULL DEFAULT false,
  plano               plano_tipo NOT NULL DEFAULT 'basico',
  ativo               boolean NOT NULL DEFAULT true,
  visualizacoes       integer NOT NULL DEFAULT 0,
  cliques_whatsapp    integer NOT NULL DEFAULT 0,
  expires_at          timestamptz,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- 5. TABELA: pagamentos
-- ============================================================
CREATE TABLE IF NOT EXISTS public.pagamentos (
  id              uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id      uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  user_id         uuid REFERENCES auth.users(id),
  plano           plano_tipo NOT NULL,
  valor_centavos  integer NOT NULL CHECK (valor_centavos > 0),
  status          text NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'aprovado', 'recusado', 'estornado')),
  gateway         text,
  gateway_id      text,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- 6. TABELA: denuncias
-- ============================================================
CREATE TABLE IF NOT EXISTS public.denuncias (
  id              uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id      uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  motivo          text NOT NULL CHECK (motivo IN ('menor_idade', 'foto_falsa', 'spam', 'conteudo_ilegal', 'outro')),
  descricao       text,
  ip_denunciante  text,
  resolvida       boolean NOT NULL DEFAULT false,
  created_at      timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- 7. TABELA: auditoria_logs
-- ============================================================
CREATE TABLE IF NOT EXISTS public.auditoria_logs (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tabela      text NOT NULL,
  operacao    text NOT NULL CHECK (operacao IN ('INSERT', 'UPDATE', 'DELETE')),
  registro_id uuid,
  dados_antes jsonb,
  dados_depois jsonb,
  user_id     uuid,
  ip          text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- FUNÇÕES UTILITÁRIAS
-- ============================================================

-- updated_at automático
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE TRIGGER trg_gp_applications_updated_at
  BEFORE UPDATE ON public.gp_applications
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE TRIGGER trg_pagamentos_updated_at
  BEFORE UPDATE ON public.pagamentos
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Incrementar visualizações
CREATE OR REPLACE FUNCTION public.increment_profile_view(profile_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.profiles
  SET visualizacoes = visualizacoes + 1
  WHERE id = profile_id AND ativo = TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Incrementar cliques WhatsApp
CREATE OR REPLACE FUNCTION public.increment_whatsapp_click(profile_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.profiles
  SET cliques_whatsapp = cliques_whatsapp + 1
  WHERE id = profile_id AND ativo = TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Expirar anúncios
CREATE OR REPLACE FUNCTION public.expirar_anuncios()
RETURNS INTEGER AS $$
DECLARE total INTEGER;
BEGIN
  UPDATE public.profiles
  SET ativo = FALSE
  WHERE expires_at IS NOT NULL AND expires_at < NOW() AND ativo = TRUE;
  GET DIAGNOSTICS total = ROW_COUNT;
  RETURN total;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Promover usuário a admin via email
-- Uso: SELECT public.set_admin('admin@seusite.com');
CREATE OR REPLACE FUNCTION public.set_admin(p_email text)
RETURNS void AS $$
DECLARE v_uid uuid;
BEGIN
  SELECT id INTO v_uid FROM auth.users WHERE email = p_email;
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'Usuário não encontrado: %', p_email;
  END IF;
  INSERT INTO public.user_profiles (id, role)
  VALUES (v_uid, 'admin')
  ON CONFLICT (id) DO UPDATE SET role = 'admin', updated_at = now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- STORAGE BUCKET
-- ============================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'profiles',
  'profiles',
  true,
  5242880,  -- 5MB por arquivo
  ARRAY['image/jpeg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- ÍNDICES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_profiles_ativo        ON public.profiles(ativo, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_user_id      ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_categoria    ON public.profiles(categoria) WHERE ativo = true;
CREATE INDEX IF NOT EXISTS idx_profiles_bairro       ON public.profiles(bairro) WHERE ativo = true;
CREATE INDEX IF NOT EXISTS idx_profiles_destaque     ON public.profiles(destaque DESC, created_at DESC) WHERE ativo = true;
CREATE INDEX IF NOT EXISTS idx_profiles_plano        ON public.profiles(plano) WHERE ativo = true;
CREATE INDEX IF NOT EXISTS idx_profiles_nome_trgm    ON public.profiles USING gin(nome gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_profiles_desc_trgm    ON public.profiles USING gin(descricao gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_gp_applications_status  ON public.gp_applications(status);
CREATE INDEX IF NOT EXISTS idx_gp_applications_user_id ON public.gp_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_pagamentos_profile    ON public.pagamentos(profile_id);
CREATE INDEX IF NOT EXISTS idx_pagamentos_status     ON public.pagamentos(status);
CREATE INDEX IF NOT EXISTS idx_denuncias_profile     ON public.denuncias(profile_id);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- user_profiles RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "up_own_select" ON public.user_profiles;
CREATE POLICY "up_own_select"
  ON public.user_profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "up_own_update" ON public.user_profiles;
CREATE POLICY "up_own_update"
  ON public.user_profiles FOR UPDATE
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "up_trigger_insert" ON public.user_profiles;
CREATE POLICY "up_trigger_insert"
  ON public.user_profiles FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "up_admin_all" ON public.user_profiles;
CREATE POLICY "up_admin_all"
  ON public.user_profiles FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles up
      WHERE up.id = auth.uid() AND up.role = 'admin'
    )
  );

-- gp_applications RLS
ALTER TABLE public.gp_applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "gpa_own_select" ON public.gp_applications;
CREATE POLICY "gpa_own_select"
  ON public.gp_applications FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "gpa_own_insert" ON public.gp_applications;
CREATE POLICY "gpa_own_insert"
  ON public.gp_applications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "gpa_admin_all" ON public.gp_applications;
CREATE POLICY "gpa_admin_all"
  ON public.gp_applications FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles up
      WHERE up.id = auth.uid() AND up.role = 'admin'
    )
  );

-- profiles (anúncios) RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "pf_public_select" ON public.profiles;
CREATE POLICY "pf_public_select"
  ON public.profiles FOR SELECT
  USING (ativo = true);

DROP POLICY IF EXISTS "pf_own_select_inactive" ON public.profiles;
CREATE POLICY "pf_own_select_inactive"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "pf_gp_insert" ON public.profiles;
CREATE POLICY "pf_gp_insert"
  ON public.profiles FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.user_profiles up
      WHERE up.id = auth.uid() AND up.role IN ('gp', 'admin')
    )
  );

DROP POLICY IF EXISTS "pf_gp_update" ON public.profiles;
CREATE POLICY "pf_gp_update"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "pf_admin_all" ON public.profiles;
CREATE POLICY "pf_admin_all"
  ON public.profiles FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles up
      WHERE up.id = auth.uid() AND up.role = 'admin'
    )
  );

-- pagamentos RLS
ALTER TABLE public.pagamentos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "pag_own_select" ON public.pagamentos;
CREATE POLICY "pag_own_select"
  ON public.pagamentos FOR SELECT
  USING (auth.uid() = user_id);

-- denuncias RLS
ALTER TABLE public.denuncias ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "den_public_insert" ON public.denuncias;
CREATE POLICY "den_public_insert"
  ON public.denuncias FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "den_admin_select" ON public.denuncias;
CREATE POLICY "den_admin_select"
  ON public.denuncias FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles up
      WHERE up.id = auth.uid() AND up.role = 'admin'
    )
  );

-- auditoria_logs RLS
ALTER TABLE public.auditoria_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "audit_admin_all" ON public.auditoria_logs;
CREATE POLICY "audit_admin_all"
  ON public.auditoria_logs FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles up
      WHERE up.id = auth.uid() AND up.role = 'admin'
    )
  );

-- ============================================================
-- STORAGE POLICIES
-- ============================================================

-- Leitura pública
DROP POLICY IF EXISTS "storage_public_read" ON storage.objects;
CREATE POLICY "storage_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'profiles');

-- Upload: usuário autenticado, dentro da pasta gp-photos/{user_id}/
-- Estrutura do path: gp-photos/{user_id}/{filename}
DROP POLICY IF EXISTS "storage_auth_upload" ON storage.objects;
CREATE POLICY "storage_auth_upload"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'profiles'
    AND auth.uid() IS NOT NULL
    AND (storage.foldername(name))[2] = auth.uid()::text
  );

-- Update de próprias fotos
DROP POLICY IF EXISTS "storage_own_update" ON storage.objects;
CREATE POLICY "storage_own_update"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'profiles'
    AND (storage.foldername(name))[2] = auth.uid()::text
  );

-- Delete de próprias fotos
DROP POLICY IF EXISTS "storage_own_delete" ON storage.objects;
CREATE POLICY "storage_own_delete"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'profiles'
    AND (storage.foldername(name))[2] = auth.uid()::text
  );

-- ============================================================
-- VIEWS DE ANALYTICS
-- ============================================================
CREATE OR REPLACE VIEW public.v_stats_por_bairro AS
SELECT
  bairro,
  COUNT(*) AS total_perfis,
  SUM(visualizacoes) AS total_visualizacoes,
  SUM(cliques_whatsapp) AS total_cliques_whatsapp
FROM public.profiles
WHERE ativo = TRUE
GROUP BY bairro
ORDER BY total_perfis DESC;

CREATE OR REPLACE VIEW public.v_stats_por_categoria AS
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
-- DADOS DE EXEMPLO (opcional — remova em produção)
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
  ('Bianca', 29, 'Laguinho', 'Massagem', 'Bianca, massagista profissional em Macapá. Sessões de relaxamento no Laguinho. Agende já!', '5596999999992', TRUE, FALSE, 'destaque')
ON CONFLICT DO NOTHING;

-- ============================================================
-- FIM DO SCHEMA v3
-- ============================================================
-- APÓS EXECUTAR, promova seu usuário admin com:
--   SELECT public.set_admin('seu@email.com');
-- ============================================================
