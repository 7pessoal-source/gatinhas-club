export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  image?: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: "guia-macapa",
    title: "Guia de Macapá — o que fazer e onde ir",
    excerpt: "Descubra os principais pontos turísticos e atrações de Macapá, capital do Amapá.",
    content: `# Guia de Macapá — o que fazer e onde ir

Macapá é a capital do estado do Amapá, localizada na região norte do Brasil. A cidade oferece diversas atrações turísticas e culturais para visitantes.

## Principais Atrações

### Fortaleza de São José de Macapá
A Fortaleza de São José é um importante patrimônio histórico, construída no século XVIII.

### Linha do Equador
Macapá é atravessada pela Linha do Equador, com um monumento que marca este ponto geográfico.

### Museus e Cultura
A cidade possui diversos museus que contam a história da região.

## Gastronomia
Macapá oferece uma culinária rica com pratos típicos da região amazônica.

## Hospedagem
Existem várias opções de hospedagem para todos os orçamentos.`,
    author: "Gatinhas Club",
    date: "2026-02-20",
    category: "Turismo",
  },
  {
    id: "como-funciona-gatinhas-club",
    title: "Como funciona o Gatinhas Club — guia completo",
    excerpt: "Entenda como funciona a plataforma Gatinhas Club e como encontrar acompanhantes.",
    content: `# Como funciona o Gatinhas Club — guia completo

O Gatinhas Club é uma plataforma de classificados independentes para acompanhantes em Macapá.

## Como Buscar Acompanhantes

1. Acesse o site do Gatinhas Club
2. Use os filtros de busca (bairro, categoria, idade)
3. Clique no perfil da acompanhante desejada
4. Entre em contato via WhatsApp

## Segurança e Verificação

Todos os perfis no Gatinhas Club são verificados para garantir autenticidade.

## Contato Direto

O contato é feito diretamente entre o cliente e a acompanhante via WhatsApp.

## Discrição Total

Garantimos a privacidade e discrição de todos os usuários.`,
    author: "Gatinhas Club",
    date: "2026-02-18",
    category: "Guia",
  },
  {
    id: "bairros-macapa",
    title: "Bairros de Macapá — mapa e guia",
    excerpt: "Conheça os principais bairros de Macapá e encontre acompanhantes em cada região.",
    content: `# Bairros de Macapá — mapa e guia

Macapá é dividida em diversos bairros, cada um com suas características.

## Centro
O Centro é o coração comercial de Macapá, com diversas lojas e serviços.

## Zona Norte
A Zona Norte é uma região em desenvolvimento com crescimento imobiliário.

## Zona Sul
A Zona Sul possui características residenciais e comerciais.

## Buritizal
Buritizal é um bairro tradicional de Macapá.

## Infraero
O bairro Infraero está próximo ao aeroporto.

## Jesus de Nazaré
Jesus de Nazaré é uma região com muitos serviços.

## Encontre Acompanhantes

Use os filtros por bairro para encontrar acompanhantes em sua região preferida.`,
    author: "Gatinhas Club",
    date: "2026-02-15",
    category: "Bairros",
  },
  {
    id: "como-anunciar-acompanhante",
    title: "Como anunciar como acompanhante em Macapá",
    excerpt: "Passo a passo para cadastrar seu perfil como acompanhante no Gatinhas Club.",
    content: `# Como anunciar como acompanhante em Macapá

O Gatinhas Club oferece uma plataforma simples e segura para acompanhantes anunciarem seus serviços.

## Requisitos

- Ser maior de 18 anos
- Ter fotos 100% reais
- Fornecer número de WhatsApp válido

## Passo a Passo

1. Clique em "Anunciar" no menu principal
2. Preencha o formulário com seus dados
3. Envie fotos claras e reais
4. Defina suas categorias e disponibilidade
5. Seu perfil será ativado em poucos minutos

## Verificação

Todos os perfis passam por verificação para garantir autenticidade.

## Segurança

Seus dados pessoais são protegidos e não são compartilhados.

## Suporte

Oferecemos suporte completo para acompanhantes.`,
    author: "Gatinhas Club",
    date: "2026-02-10",
    category: "Anúncios",
  },
];
