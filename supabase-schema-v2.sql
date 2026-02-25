-- ============================================================
-- GATINHAS CLUB — SQL COMPLETO (execute no Supabase SQL Editor)
-- ============================================================

-- 1. TIPOS
DO $$ BEGIN
  CREATE TYPE plano_tipo AS ENUM ('basico', 'destaque', 'premium');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 2. TABELA: user_profiles (roles e dados do auth.users)
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'gp', 'admin')),
  nome text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
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

-- 3. TABELA: gp_applications (cadastros pendentes de aprovação)
CREATE TABLE IF NOT EXISTS public.gp_applications (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nome text NOT NULL CHECK (char_length(nome) BETWEEN 2 AND 50),
  idade integer NOT NULL CHECK (idade BETWEEN 18 AND 80),
  bairro text NOT NULL,
  categoria text NOT NULL CHECK (categoria IN ('Luxo', 'Independente', 'Massagem', 'Acompanhante')),
  descricao text NOT NULL CHECK (char_length(descricao) BETWEEN 20 AND 1000),
  whatsapp text NOT NULL CHECK (whatsapp ~ '^[0-9]{12,13}$'),
  fotos text[] DEFAULT '{}',
  status text NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'aprovado', 'rejeitado')),
  admin_nota text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 4. TABELA: profiles (anúncios das GPs aprovadas)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  nome text NOT NULL CHECK (char_length(nome) BETWEEN 2 AND 50),
  idade integer NOT NULL CHECK (idade BETWEEN 18 AND 80),
  bairro text NOT NULL,
  categoria text NOT NULL CHECK (categoria IN ('Luxo', 'Independente', 'Massagem', 'Acompanhante')),
  descricao text NOT NULL CHECK (char_length(descricao) BETWEEN 20 AND 1000),
  foto_principal text,
  fotos text[] DEFAULT '{}',
  whatsapp text NOT NULL CHECK (whatsapp ~ '^[0-9]{12,13}$'),
  verificada boolean NOT NULL DEFAULT false,
  destaque boolean NOT NULL DEFAULT false,
  plano plano_tipo NOT NULL DEFAULT 'basico',
  ativo boolean NOT NULL DEFAULT true,
  visualizacoes integer NOT NULL DEFAULT 0,
  cliques_whatsapp integer NOT NULL DEFAULT 0,
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 5. TABELA: pagamentos
CREATE TABLE IF NOT EXISTS public.pagamentos (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id),
  plano plano_tipo NOT NULL,
  valor_centavos integer NOT NULL CHECK (valor_centavos > 0),
  status text NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'aprovado', 'recusado', 'estornado')),
  gateway text,
  gateway_id text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 6. TABELA: denuncias
CREATE TABLE IF NOT EXISTS public.denuncias (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  motivo text NOT NULL CHECK (motivo IN ('menor_idade', 'foto_falsa', 'spam', 'conteudo_ilegal', 'outro')),
  descricao text,
  ip_denunciante text,
  resolvida boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 7. TABELA: auditoria_logs
CREATE TABLE IF NOT EXISTS public.auditoria_logs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tabela text NOT NULL,
  operacao text NOT NULL CHECK (operacao IN ('INSERT', 'UPDATE', 'DELETE')),
  registro_id uuid,
  dados_antes jsonb,
  dados_depois jsonb,
  user_id uuid,
  ip text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- STORAGE BUCKET
-- ============================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('profiles', 'profiles', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- RLS (Row Level Security)
-- ============================================================

-- user_profiles
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuário vê próprio perfil"
  ON public.user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Usuário atualiza próprio perfil"
  ON public.user_profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admin vê todos user_profiles"
  ON public.user_profiles FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles up
      WHERE up.id = auth.uid() AND up.role = 'admin'
    )
  );

CREATE POLICY "Trigger pode inserir user_profiles"
  ON public.user_profiles FOR INSERT
  WITH CHECK (true);

-- gp_applications
ALTER TABLE public.gp_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "GP vê própria application"
  ON public.gp_applications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuário logado envia application"
  ON public.gp_applications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admin gerencia todas applications"
  ON public.gp_applications FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles up
      WHERE up.id = auth.uid() AND up.role = 'admin'
    )
  );

-- profiles (anúncios)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Perfis ativos visíveis para todos"
  ON public.profiles FOR SELECT
  USING (ativo = true);

CREATE POLICY "GP edita próprio anúncio"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "GP cria anúncio"
  ON public.profiles FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.user_profiles up
      WHERE up.id = auth.uid() AND up.role IN ('gp', 'admin')
    )
  );

CREATE POLICY "Admin gerencia todos perfis"
  ON public.profiles FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles up
      WHERE up.id = auth.uid() AND up.role = 'admin'
    )
  );

-- Storage policies
CREATE POLICY "Qualquer um pode ver fotos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'profiles');

CREATE POLICY "Usuário autenticado faz upload"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'profiles' AND
    auth.uid() IS NOT NULL AND
    (storage.foldername(name))[2] = auth.uid()::text
  );

CREATE POLICY "Usuário deleta próprias fotos"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'profiles' AND
    (storage.foldername(name))[2] = auth.uid()::text
  );

-- ============================================================
-- FUNÇÃO: tornar usuário admin (use apenas via SQL Editor)
-- Exemplo: SELECT set_admin('email@exemplo.com');
-- ============================================================
CREATE OR REPLACE FUNCTION public.set_admin(p_email text)
RETURNS void AS $$
DECLARE
  v_uid uuid;
BEGIN
  SELECT id INTO v_uid FROM auth.users WHERE email = p_email;
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'Usuário não encontrado: %', p_email;
  END IF;
  INSERT INTO public.user_profiles (id, role)
  VALUES (v_uid, 'admin')
  ON CONFLICT (id) DO UPDATE SET role = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- ÍNDICES para performance
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_profiles_ativo ON public.profiles(ativo);
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_categoria ON public.profiles(categoria);
CREATE INDEX IF NOT EXISTS idx_gp_applications_status ON public.gp_applications(status);
CREATE INDEX IF NOT EXISTS idx_gp_applications_user_id ON public.gp_applications(user_id);
