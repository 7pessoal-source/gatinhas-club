# Gatinhas Club – Plataforma de Classificados Adultos em Macapá AP

## 🚀 Stack
- React + TypeScript + Vite
- Tailwind CSS + shadcn/ui
- React Router DOM
- React Helmet Async (SEO)
- Framer Motion
- TanStack Query
- **Supabase** (banco de dados, auth, storage)

## ⚡ Setup Rápido

```bash
npm install
cp .env.example .env
# preencha VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY
npm run dev
```

## 🗄️ Configurar Supabase

1. Crie um projeto em [supabase.com](https://supabase.com)
2. Vá em **SQL Editor** e execute o conteúdo de `supabase-schema.sql`
3. Copie a URL e a `anon key` do projeto para o `.env`
4. Pronto! O site detecta automaticamente se o Supabase está configurado

> **Sem Supabase:** o site funciona normalmente com dados mock (`src/data/mockProfiles.ts`)

## 📍 Páginas SEO

| URL | Keyword alvo |
|-----|-------------|
| `/acompanhantes-macapa` | acompanhantes em Macapá |
| `/garotas-de-programa-macapa` | garotas de programa Macapá |
| `/acompanhantes-macapa-ap` | acompanhante Macapá AP |
| `/acompanhantes-centro-macapa` | acompanhantes Centro Macapá |
| `/acompanhantes-zona-norte-macapa` | acompanhantes zona norte Macapá |
| `/acompanhantes-zona-sul-macapa` | acompanhantes zona sul Macapá |
| `/acompanhantes-luxo-macapa` | acompanhantes luxo Macapá |
| `/massagem-macapa` | massagem Macapá |

## 📋 Documentos Jurídicos

| Página | Arquivo |
|--------|---------|
| Termos de Uso | `/termos` |
| Política de Privacidade (LGPD) | `/privacidade` |
| Política de Cookies | `/cookies` |
| Aviso Legal (Marco Civil) | `/aviso-legal` |

## 🔧 Build para Produção

```bash
npm run build
# output em /dist
```

## 📦 Deploy Recomendado
- **Vercel** ou **Netlify** com SPA redirect (`/*` → `/index.html`)
- Configure as variáveis de ambiente no painel do serviço

## ⚠️ Importante
- Altere o domínio `gatinhasclub.com.br` para o seu domínio real em:
  - `src/components/SEOHead.tsx`
  - `src/pages/Index.tsx` (homeSchema)
  - `public/sitemap.xml`
- Atualize os e-mails de contato nos documentos jurídicos
