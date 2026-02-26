# Gatinhas Club – Plataforma de Classificados Adultos em Macapá AP

## 🚀 PROTOCOLO DE DOMÍNIO TOTAL IMPLEMENTADO ✅
Este repositório foi atualizado com melhorias críticas de SEO, Performance e UX para dominar os resultados de busca em Macapá e Santana (Amapá).

### ⚡ Melhorias Realizadas:
- **Performance e PWA**: Implementação de `manifest.json` e `sw.js` para instalação mobile.
- **Critical CSS**: Estilos iniciais injetados no `<head>` para carregamento instantâneo.
- **Caching & Segurança**: Configurações avançadas no `vercel.json` com HSTS e Cache-Control.
- **SEO Local**: 10 Landing Pages exclusivas para bairros (Centro, Buritizal, Trem, Zerão, etc) com textos de 300+ palavras.
- **Dados Estruturados**: Implementação de JSON-LD `Product` com `AggregateRating` (estrelinhas no Google).
- **UX**: Sistema de Favoritos (LocalStorage) e Rastreamento GA4.
- **Sitemaps**: `sitemap.xml` e `sitemap-images.xml` configurados.

---

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

## 📍 Páginas SEO (Bairros)
As novas rotas de silagem local estão disponíveis em `/acompanhantes/:bairro-macapa`.

## 📦 Deploy Recomendado
- **Vercel** ou **Netlify** com SPA redirect (`/*` → `/index.html`)
- Configure as variáveis de ambiente no painel do serviço
