import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import ProfileCard from "@/components/ProfileCard";
import { useProfiles } from "@/hooks/useProfiles";
import type { Profile } from "@/data/mockProfiles";

interface SEOPageConfig {
  slug: string;
  title: string;
  h1: string;
  h2: string;
  metaDescription: string;
  content: string;
  extraContent?: string;
  filterFn: (p: Profile) => boolean;
  relatedLinks: { to: string; label: string }[];
}

export const seoPages: Record<string, SEOPageConfig> = {
  "acompanhantes-macapa": {
    slug: "acompanhantes-macapa",
    title: "Acompanhantes em Macapá – AP | Classificados Adultos",
    h1: "Acompanhantes em Macapá – AP",
    h2: "Encontre Acompanhantes Independentes em Macapá, Amapá",
    metaDescription: "As melhores acompanhantes independentes em Macapá, AP. Perfis verificados, fotos reais e contato direto via WhatsApp. Classificados adultos seguros e discretos no Gatinhas Club.",
    content: `Bem-vindo ao Gatinhas Club, o principal portal de acompanhantes em Macapá – AP. Aqui você encontra perfis de anunciantes independentes que atuam na capital do Amapá, em bairros como Centro, Santa Rita, Buritizal, Laguinho, Congós, Marco Zero e muito mais.`, 
    extraContent: `Macapá, capital do estado do Amapá (AP), é a única capital brasileira cortada pela linha do Equador. Com uma população de aproximadamente 500 mil habitantes, a cidade possui vida noturna ativa e uma demanda crescente por serviços de acompanhantes independentes. No Gatinhas Club você encontra perfis verificados de acompanhantes em Macapá com fotos reais, descrição completa e contato direto via WhatsApp. Todas as anunciantes são maiores de 18 anos e atuam de forma completamente independente.
Nossa plataforma atende a capital Macapá e a cidade de Santana, a segunda maior do Amapá. Você pode filtrar por bairro, tipo de atendimento e disponibilidade. Acompanhantes no Centro de Macapá, acompanhantes na Zona Norte, Zona Sul e todas as regiões da cidade estão no Gatinhas Club. Encontre também massagistas independentes em Macapá, acompanhantes de luxo para eventos e jantares, e garotas de programa em Macapá AP com atendimento discreto e profissional.`, 
    filterFn: (p) => ["Luxo", "Independente", "Acompanhante"].includes(p.categoria),
    relatedLinks: [
      { to: "/acompanhantes-centro-macapa", label: "Acompanhantes no Centro de Macapá" },
      { to: "/acompanhantes-zona-norte-macapa", label: "Acompanhantes Zona Norte" },
      { to: "/acompanhantes-zona-sul-macapa", label: "Acompanhantes Zona Sul" },
      { to: "/garotas-de-programa-macapa", label: "Garotas de Programa Macapá" },
      { to: "/massagem-macapa", label: "Massagem em Macapá" },
    ],
  },
  "garotas-de-programa-macapa": {
    slug: "garotas-de-programa-macapa",
    title: "Garotas de Programa Macapá – Classificados Adultos | Gatinhas Club",
    h1: "Garotas de Programa em Macapá – AP",
    h2: "Anúncios Independentes – Garotas de Programa Macapá",
    metaDescription: "Garotas de programa em Macapá, AP. Perfis verificados e com fotos reais no Gatinhas Club. Classificados adultos para maiores de 18 anos em Macapá – Amapá.",
    content: `Encontre no Gatinhas Club os perfis de garotas de programa em Macapá, a capital do Amapá. Anúncios independentes, discretos e verificados. Todas as anunciantes são maiores de 18 anos.`, 
    extraContent: `Nossa plataforma é dedicada a conectar você com garotas de programa em Macapá que oferecem serviços de forma independente e com total discrição. Priorizamos a segurança e a autenticidade, garantindo que todos os perfis sejam verificados e as fotos 100% reais. Seja para um encontro casual, uma companhia para eventos ou momentos de relaxamento, o Gatinhas Club oferece uma vasta seleção de profissionais em diversas categorias e bairros de Macapá. Explore perfis detalhados, entre em contato direto via WhatsApp e agende seu encontro com confiança. Acompanhantes no Centro, Zona Norte, Zona Sul e outros bairros estão disponíveis para atender às suas preferências.`, 
    filterFn: (p) => ["Luxo", "Independente", "Acompanhante"].includes(p.categoria),
    relatedLinks: [
      { to: "/acompanhantes-macapa", label: "Acompanhantes em Macapá" },
      { to: "/acompanhantes-macapa-ap", label: "Acompanhante Macapá AP" },
      { to: "/acompanhantes-centro-macapa", label: "Acompanhantes Centro Macapá" },
      { to: "/acompanhantes-zona-norte-macapa", label: "Acompanhantes Zona Norte" },
      { to: "/acompanhantes-zona-sul-macapa", label: "Acompanhantes Zona Sul" },
    ],
  },
  "acompanhantes-macapa-ap": {
    slug: "acompanhantes-macapa-ap",
    title: "Acompanhante Macapá AP – Classificados Adultos | Gatinhas Club",
    h1: "Acompanhante em Macapá – AP (Amapá)",
    h2: "Perfis Verificados de Acompanhantes em Macapá – AP",
    metaDescription: "Acompanhante Macapá AP – encontre perfis verificados no Gatinhas Club. Classificados adultos independentes em Macapá, capital do Amapá.",
    content: `Macapá, capital do estado do Amapá (AP), é a única capital brasileira cortada pela linha do Equador. Com sua rica cultura e vida noturna vibrante, a cidade atrai visitantes e moradores em busca de momentos especiais. No Gatinhas Club, você encontra uma seleção exclusiva de acompanhantes em Macapá AP, todas com perfis verificados e fotos 100% reais. Nossa plataforma garante discrição e segurança, permitindo que você entre em contato direto com a acompanhante de sua escolha via WhatsApp.`, 
    extraContent: `Seja para um jantar romântico, uma companhia para eventos sociais ou simplesmente para desfrutar de momentos de lazer, as acompanhantes do Gatinhas Club estão prontas para oferecer uma experiência inesquecível. Explore perfis detalhados, com informações sobre serviços, preferências e disponibilidade. Atendemos em diversos bairros de Macapá, incluindo Centro, Santa Rita, Buritizal, e muitos outros. Além de acompanhantes, você também pode encontrar massagistas e garotas de programa independentes, todas comprometidas com a sua satisfação e discrição. Priorizamos a autenticidade e a transparência, para que você possa fazer sua escolha com total confiança.`, 
    filterFn: () => true,
    relatedLinks: [
      { to: "/acompanhantes-macapa", label: "Acompanhantes em Macapá" },
      { to: "/garotas-de-programa-macapa", label: "Garotas de Programa Macapá" },
      { to: "/acompanhantes-centro-macapa", label: "Acompanhantes Centro Macapá" },
      { to: "/massagem-macapa", label: "Massagem Macapá" },
    ],
  },
  "acompanhantes-centro-macapa": {
    slug: "acompanhantes-centro-macapa",
    title: "Acompanhantes no Centro de Macapá – AP | Gatinhas Club",
    h1: "Acompanhantes no Centro de Macapá – AP",
    h2: "Perfis Verificados no Bairro Centro, Macapá",
    metaDescription: "Encontre acompanhantes independentes no Centro de Macapá, AP. Região central com fácil acesso, discrição total.",
    content: `O bairro Centro de Macapá é o coração pulsante da capital do Amapá, com fácil acesso por toda a cidade e uma vida noturna agitada. No Gatinhas Club, você encontra uma seleção exclusiva de acompanhantes no Centro de Macapá, todas com perfis verificados e fotos 100% reais. Nossa plataforma garante discrição e segurança, permitindo que você entre em contato direto com a acompanhante de sua escolha via WhatsApp.`, 
    extraContent: `A região central de Macapá é ideal para quem busca encontros discretos e convenientes, próximo a hotéis, restaurantes e pontos turísticos como a Fortaleza de São José. As acompanhantes disponíveis no Centro oferecem uma variedade de serviços, desde companhia para eventos até momentos íntimos e relaxantes. Explore perfis detalhados, com informações sobre serviços, preferências e disponibilidade. Priorizamos a autenticidade e a transparência, para que você possa fazer sua escolha com total confiança e desfrutar de uma experiência inesquecível no coração de Macapá.`, 
    filterFn: (p) => p.bairro === "Centro",
    relatedLinks: [
      { to: "/acompanhantes-macapa", label: "Acompanhantes em Macapá" },
      { to: "/acompanhantes-zona-norte-macapa", label: "Acompanhantes Zona Norte" },
      { to: "/acompanhantes-zona-sul-macapa", label: "Acompanhantes Zona Sul" },
      { to: "/garotas-de-programa-macapa", label: "Garotas de Programa Macapá" },
    ],
  },
  "acompanhantes-zona-norte-macapa": {
    slug: "acompanhantes-zona-norte-macapa",
    title: "Acompanhantes na Zona Norte de Macapá – AP | Gatinhas Club",
    h1: "Acompanhantes na Zona Norte de Macapá – AP",
    h2: "Anúncios Independentes na Zona Norte de Macapá",
    metaDescription: "Acompanhantes independentes na Zona Norte de Macapá, AP – bairros Novo Horizonte, Jardim Equatorial, Pacoval e Zerão.",
    content: `A Zona Norte de Macapá compreende bairros vibrantes como Novo Horizonte, Jardim Equatorial, Pacoval e Zerão. Se você busca acompanhantes na Zona Norte de Macapá, o Gatinhas Club oferece perfis verificados e contato direto.`, 
    extraContent: `Nesta região em constante crescimento, você encontrará uma variedade de acompanhantes independentes, prontas para proporcionar momentos de prazer e discrição. Nossos perfis são cuidadosamente verificados, garantindo fotos 100% reais e informações precisas. A Zona Norte é ideal para quem busca conveniência e atendimento de qualidade em uma área dinâmica da cidade. Explore as opções disponíveis, entre em contato via WhatsApp e agende seu encontro com total segurança e privacidade.`, 
    filterFn: (p) => ["Novo Horizonte", "Jardim Equatorial", "Pacoval", "Zerão"].includes(p.bairro),
    relatedLinks: [
      { to: "/acompanhantes-macapa", label: "Acompanhantes em Macapá" },
      { to: "/acompanhantes-zona-sul-macapa", label: "Acompanhantes Zona Sul" },
      { to: "/acompanhantes-centro-macapa", label: "Acompanhantes Centro Macapá" },
    ],
  },
  "acompanhantes-zona-sul-macapa": {
    slug: "acompanhantes-zona-sul-macapa",
    title: "Acompanhantes na Zona Sul de Macapá – AP | Gatinhas Club",
    h1: "Acompanhantes na Zona Sul de Macapá – AP",
    h2: "Anúncios Independentes na Zona Sul de Macapá",
    metaDescription: "Acompanhantes independentes na Zona Sul de Macapá, AP – Congós, Laguinho, Trem, Beirol, Buritizal e Santa Rita.",
    content: `A Zona Sul de Macapá reúne bairros populares e movimentados como Congós, Laguinho, Trem, Beirol, Buritizal e Santa Rita. Se você está em busca de acompanhantes na Zona Sul de Macapá, o Gatinhas Club é a sua plataforma ideal. Oferecemos perfis verificados de profissionais independentes, garantindo discrição e segurança em seus encontros.`, 
    extraContent: `Nesta região da capital amapaense, você encontrará uma diversidade de acompanhantes prontas para atender às suas expectativas. Seja para uma companhia agradável, um momento de relaxamento ou uma experiência mais íntima, nossas anunciantes oferecem serviços de alta qualidade. Todos os perfis contam com fotos 100% reais e informações detalhadas, permitindo que você faça uma escolha informada. Entre em contato direto via WhatsApp com a acompanhante de sua preferência e agende seu encontro com total privacidade. A Zona Sul de Macapá, com seus diversos pontos de interesse e fácil acesso, proporciona o cenário perfeito para encontros memoráveis.`, 
    filterFn: (p) => ["Congós", "Laguinho", "Trem", "Beirol", "Buritizal", "Santa Rita"].includes(p.bairro),
    relatedLinks: [
      { to: "/acompanhantes-macapa", label: "Acompanhantes em Macapá" },
      { to: "/acompanhantes-zona-norte-macapa", label: "Acompanhantes Zona Norte" },
      { to: "/massagem-macapa", label: "Massagem Macapá" },
    ],
  },
  "massagem-macapa": {
    slug: "massagem-macapa",
    title: "Massagem Relaxante em Macapá – AP | Gatinhas Club",
    h1: "Massagem Relaxante e Terapêutica em Macapá – AP",
    h2: "Massagistas Independentes em Macapá, Amapá",
    metaDescription: "Encontre massagistas independentes em Macapá, AP. Massagem relaxante, terapêutica e sensorial.",
    content: `Confira os perfis de massagistas independentes em Macapá, capital do Amapá. No Gatinhas Club, você encontra profissionais qualificadas que oferecem uma variedade de serviços de massagem, incluindo relaxante, terapêutica e sensorial.`, 
    extraContent: `Nossas massagistas são independentes e trabalham com total discrição, proporcionando um ambiente de tranquilidade e bem-estar. Seja para aliviar o estresse do dia a dia, relaxar os músculos ou desfrutar de um momento de puro prazer, você encontrará a massagem ideal para suas necessidades. Todos os perfis são verificados e permitem contato direto via WhatsApp, garantindo que você possa agendar seu horário com facilidade e segurança. Explore as opções disponíveis em diversos bairros de Macapá e encontre a massagista perfeita para sua sessão de relaxamento.`, 
    filterFn: (p) => p.categoria === "Massagem",
    relatedLinks: [
      { to: "/acompanhantes-macapa", label: "Acompanhantes em Macapá" },
      { to: "/garotas-de-programa-macapa", label: "Garotas de Programa Macapá" },
    ],
  },
  "acompanhantes-luxo-macapa": {
    slug: "acompanhantes-luxo-macapa",
    title: "Acompanhantes de Luxo em Macapá – AP | Gatinhas Club",
    h1: "Acompanhantes de Luxo em Macapá – AP",
    h2: "Perfis Premium e de Luxo em Macapá, Amapá",
    metaDescription: "Acompanhantes de luxo em Macapá, AP. Perfis sofisticados e verificados no Gatinhas Club.",
    content: `Encontre acompanhantes de luxo em Macapá, AP, no Gatinhas Club. Nossa plataforma reúne perfis sofisticados e verificados, ideais para quem busca uma companhia exclusiva e de alto padrão na capital do Amapá.`, 
    extraContent: `As acompanhantes de luxo disponíveis no Gatinhas Club são selecionadas para oferecer uma experiência diferenciada, seja para eventos sociais, jantares de negócios, viagens ou momentos íntimos. Com discrição e elegância, elas proporcionam um atendimento personalizado e inesquecível. Todos os perfis são cuidadosamente verificados, garantindo fotos 100% reais e informações precisas. Entre em contato direto via WhatsApp com a acompanhante de sua preferência e desfrute de momentos de requinte e exclusividade em Macapá.`, 
    filterFn: (p) => p.categoria === "Luxo",
    relatedLinks: [
      { to: "/acompanhantes-macapa", label: "Acompanhantes em Macapá" },
      { to: "/garotas-de-programa-macapa", label: "Garotas de Programa Macapá" },
    ],
  },
};

const SEOPage = () => {
  const { slug } = useParams();

  // Descobre o slug pela URL atual quando não vem por parâmetro
  const currentSlug = slug || window.location.pathname.replace("/", "");
  const config = seoPages[currentSlug];

  const { data: allProfiles = [], isLoading } = useProfiles();

  const profiles = useMemo(() => {
    if (!config) return [];
    return allProfiles.filter(config.filterFn);
  }, [allProfiles, config]);

  if (!config) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <h1 className="font-display text-2xl font-bold text-foreground">Página não encontrada</h1>
          <Link to="/" className="mt-4 inline-block text-sm text-primary hover:underline">
            Voltar ao início
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEOHead
        title={config.title}
        description={config.metaDescription}
        canonical={`/${config.slug}`}
        keywords={`${config.h1}, acompanhantes macapá, classificados adultos, ${config.slug.replace(/-/g, ' ')}`}
        ogImageAlt={config.h1}
      />

      <section className="gradient-hero py-12 sm:py-16">
        <div className="container">
          <h1 className="font-display text-3xl font-bold text-primary-foreground sm:text-4xl">
            {config.h1}
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-primary-foreground/70">
            {config.content}
          </p>
        </div>
      </section>

      {/* Breadcrumb Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Início",
              "item": "https://www.gatinhasclub.site"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": config.h1,
              "item": `https://www.gatinhasclub.site/${config.slug}`
            }
          ]
        })}
      </script>

      <section className="container py-8 sm:py-12">
        <h2 className="mb-6 font-display text-2xl font-semibold text-foreground">{config.h2}</h2>

        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : profiles.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {profiles.map((p, i) => (
              <ProfileCard key={p.id} profile={p} index={i} />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <p className="text-sm text-muted-foreground">
              Nenhum perfil disponível nesta categoria no momento.{" "}
              <Link to="/" className="text-primary hover:underline" rel="home">Ver todos os anúncios</Link>
            </p>
          </div>
        )}

        {config.extraContent && (
          <div className="mt-10 rounded-xl border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground">{config.extraContent}</p>
          </div>
        )}

        <div className="mt-10">
          <h3 className="mb-4 font-display text-xl font-semibold text-foreground">Categorias Relacionadas</h3>
          <div className="flex flex-wrap gap-2">
            {config.relatedLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground transition-all hover:border-primary hover:text-primary"
                rel="related"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default SEOPage;
